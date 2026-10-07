import { readOrderPaymentStatus } from '../../lib/api/payments';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    const orderId = Array.isArray(req.query?.orderId) ? req.query.orderId[0] : req.query?.orderId;
    const token = Array.isArray(req.query?.token) ? req.query.token[0] : req.query?.token;
    return res.status(200).json(await readOrderPaymentStatus(String(orderId ?? ''), String(token ?? '')));
  } catch (error) {
    const issue = error as { statusCode?: number; message?: string };
    return res.status(issue.statusCode ?? 502).json({ error: issue.message ?? 'Payment status could not be read.' });
  }
}