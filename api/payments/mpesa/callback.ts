import { processMpesaCallback } from '../../../lib/api/payments';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const token = Array.isArray(req.query?.token) ? req.query.token[0] : req.query?.token;
    return res.status(200).json(await processMpesaCallback(token, req.body));
  } catch (error) {
    const issue = error as { statusCode?: number; message?: string };
    return res.status(issue.statusCode ?? 502).json({ error: issue.message ?? 'M-Pesa callback could not be processed.' });
  }
}