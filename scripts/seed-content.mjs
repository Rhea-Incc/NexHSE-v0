import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';
import { createServer } from 'vite';
import { fillMissingProductSkus, listServices, seedInitialContent, upsertServices } from '@workspace/db';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = path.join(repoRoot, 'artifacts/nexhse-africa');
const assetsRoot = path.join(appRoot, 'public/assets');
const dryRun = process.argv.includes('--dry-run');

try {
  loadEnvFile(path.join(repoRoot, '.env.local'));
} catch {}

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!dryRun && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is required to upload catalog images');

const server = await createServer({
  configFile: path.join(appRoot, 'vite.config.ts'),
  root: appRoot,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const source = await server.ssrLoadModule('/src/App.tsx');
  const products = source.shopProducts;
  const services = source.services;
  const blogPosts = source.blogPosts;
  if (![products, services, blogPosts].every(Array.isArray)) throw new Error('Unable to load the source catalog data');

  if (process.argv.includes('--sync-services-only')) {
    const existing = new Map((await listServices(true)).map(service => [service.slug, service]));
    await upsertServices(services.map(service => ({
      id: service.slug,
      slug: service.slug,
      number: service.number,
      title: service.title,
      short: service.short,
      outcome: service.outcome,
      type: service.type,
      image: existing.get(service.slug)?.image ?? service.image,
      group: service.group,
      active: true,
    })));
    console.log(JSON.stringify({ services: services.length, synced: true }));
  }

  if (!process.argv.includes('--sync-services-only')) {
  const uploaded = new Map();
  const imageUrl = async reference => {
    if (typeof reference !== 'string' || !reference) return '';
    if (/^https?:\/\//i.test(reference)) return reference;
    const relativePath = reference.replace(/^\/?assets\//, '');
    const localPath = path.resolve(assetsRoot, relativePath);
    if (!localPath.startsWith(`${assetsRoot}${path.sep}`) || !existsSync(localPath)) throw new Error(`Referenced image is missing: ${reference}`);
    if (uploaded.has(relativePath)) return uploaded.get(relativePath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' })[ext] ?? 'application/octet-stream';
    if (dryRun) {
      uploaded.set(relativePath, `dry-run:${relativePath}`);
      return `dry-run:${relativePath}`;
    }
    const blob = await put(`nexhse/catalog/${relativePath.split(path.sep).join('/')}`, await readFile(localPath), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    uploaded.set(relativePath, blob.url);
    return blob.url;
  };

  const productRecords = [];
  for (const product of products) {
    const productId = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    productRecords.push({
      id: productId,
      sku: `NX-${productId.toUpperCase()}`,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: await imageUrl(product.image),
      imageBackground: product.imageBackground,
      description: product.description,
      longDescription: product.longDescription,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      keywords: product.keywords,
      features: product.features,
      useCases: product.useCases,
      brand: product.brand,
      condition: product.condition,
      active: true,
    });
  }

  const serviceRecords = [];
  for (const service of services) {
    serviceRecords.push({
      id: service.slug,
      slug: service.slug,
      number: service.number,
      title: service.title,
      short: service.short,
      outcome: service.outcome,
      type: service.type,
      image: await imageUrl(service.image),
      group: service.group,
      active: true,
    });
  }

  const blogRecords = [];
  for (const post of blogPosts) {
    blogRecords.push({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      body: post.body.join('\n\n'),
      image: await imageUrl(post.image),
      date: post.date,
      readTime: post.read,
      published: true,
    });
  }

  const summary = {
    products: productRecords.length,
    services: serviceRecords.length,
    blogPosts: blogRecords.length,
    uniqueImages: uploaded.size,
    dryRun,
  };
  if (dryRun) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    const seeded = await seedInitialContent({ products: productRecords, services: serviceRecords, blogPosts: blogRecords });
    await fillMissingProductSkus();
    console.log(JSON.stringify({ ...summary, inserted: seeded }, null, 2));
  }
  }
} finally {
  await server.close();
}
