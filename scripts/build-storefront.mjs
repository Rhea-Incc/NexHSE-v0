import { spawn } from 'node:child_process';
import { copyFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storefrontRoot = path.join(repoRoot, 'artifacts/nexhse-africa');
const generatedAssets = /^(framework|icons|index|query|radix-ui|router|social-icons)-.*\.(js|css)$/;
const storefrontAssets = path.join(storefrontRoot, 'public/assets');
const publishedAssets = path.join(repoRoot, 'public/assets');

async function removeGeneratedBundles(directory) {
  for (const filename of await readdir(directory)) {
    if (generatedAssets.test(filename)) await rm(path.join(directory, filename), { force: true });
  }
}

await removeGeneratedBundles(storefrontAssets);

await new Promise((resolve, reject) => {
  const child = spawn('pnpm', ['exec', 'vite', 'build', '--config', 'vite.config.ts'], {
    cwd: storefrontRoot,
    stdio: 'inherit',
  });
  child.once('error', reject);
  child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Vite build exited with status ${code}`)));
});

const distRoot = path.join(storefrontRoot, 'dist');
const distAssets = path.join(distRoot, 'assets');
await removeGeneratedBundles(publishedAssets);
for (const filename of await readdir(distAssets)) {
  if (!generatedAssets.test(filename)) continue;
  await copyFile(path.join(distAssets, filename), path.join(storefrontAssets, filename));
  await copyFile(path.join(distAssets, filename), path.join(publishedAssets, filename));
}
await copyFile(path.join(distRoot, 'index.html'), path.join(repoRoot, 'public/index.html'));