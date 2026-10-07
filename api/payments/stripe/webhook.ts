import { processStripeWebhook } from '../../../lib/api/payments';

export const config = { api: { bodyParser: false } };

async function readRawBody(req: any): Promise<Buffer> {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const signature = Array.isArray(req.headers['stripe-signature']) ? req.headers['stripe-signature'][0] : req.headers['stripe-signature'];
    return res.status(200).json(await processStripeWebhook(await readRawBody(req), signature));
  } catch (error) {
    const issue = error as { statusCode?: number; message?: string };
    return res.status(issue.statusCode ?? 502).json({ error: issue.message ?? 'Stripe webhook could not be processed.' });
  }
}