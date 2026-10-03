import { appendSiteStoreValue, readSiteStoreValue, writeSiteStoreValue } from '@workspace/db';
import { isTrustedOrigin, verifyAdminSession } from '../lib/api/admin-session';

const keys = new Set(['nexhse-shop-products', 'nexhse-blog-posts', 'nexhse-shop-orders', 'nexhse-service-tickets']);
const publicReadKeys = new Set(['nexhse-shop-products', 'nexhse-blog-posts']);
const privateKeys = new Set(['nexhse-shop-orders', 'nexhse-service-tickets']);

function validNewOrder(order: any) {
  return order && typeof order === 'object'
    && Array.isArray(order.items) && order.items.length > 0 && order.items.length <= 50
    && order.delivery && typeof order.delivery.name === 'string' && order.delivery.name.trim().length > 0
    && typeof order.delivery.email === 'string' && order.delivery.email.includes('@')
    && typeof order.delivery.phone === 'string' && typeof order.delivery.address === 'string'
    && Number.isFinite(order.subtotal) && Number.isFinite(order.deliveryFee) && Number.isFinite(order.total)
    && ['M-Pesa', 'Card', 'Bank transfer', 'Pay on delivery'].includes(order.paymentMethod);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const key = String(req.query?.key ?? '');
      if (!keys.has(key)) return res.status(400).json({ error: 'Unknown store key' });
      if (!publicReadKeys.has(key) && !verifyAdminSession(req)) return res.status(401).json({ error: 'Admin session required' });
      const value = await readSiteStoreValue(key);
      return res.status(200).json({ value });
    }

    if (req.method === 'POST') {
      if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });
      if (req.body?.key !== 'nexhse-shop-orders' || !validNewOrder(req.body?.order)) return res.status(400).json({ error: 'Invalid order' });
      const now = new Date();
      const order = { ...req.body.order, id: `NX-${now.getTime().toString(36).toUpperCase()}`, createdAt: now.toISOString(), paymentStatus: req.body.order.paymentMethod === 'Pay on delivery' ? 'pending' : 'awaiting confirmation', orderStatus: 'received' };
      await appendSiteStoreValue('nexhse-shop-orders', order);
      return res.status(201).json({ order });
    }

    if (req.method === 'PUT') {
      if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });
      if (!verifyAdminSession(req)) return res.status(401).json({ error: 'Admin session required' });
      const { key, value } = req.body ?? {};
      if (!keys.has(key) || value === undefined) return res.status(400).json({ error: 'Invalid store update' });
      const serialized = JSON.stringify(value);
      if (serialized.length > 2_000_000) return res.status(413).json({ error: 'Store value is too large' });
      await writeSiteStoreValue(key, value);
      return res.status(200).json({ saved: true, updatedAt: new Date().toISOString() });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('site-store API failed', error);
    return res.status(process.env.DATABASE_URL ? 500 : 503).json({ error: 'Shared persistence is unavailable' });
  }
}
