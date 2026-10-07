import { createStripeCheckout } from '../../../lib/api/payments';
import { isTrustedOrigin } from '../../../lib/api/admin-session';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  if (!isTrustedOrigin(req)) return res.status(403).json({ ok: false, message: 'Untrusted origin.' });
  try {
    const origin = Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin;
    return res.status(200).json(await createStripeCheckout(String(req.body?.orderId ?? ''), String(req.body?.paymentStatusToken ?? ''), String(origin ?? '')));
  } catch (error) {
    const issue = error as { statusCode?: number; message?: string };
    return res.status(issue.statusCode ?? 502).json({ ok: false, message: issue.message ?? 'Stripe checkout could not be started.' });
  }
}