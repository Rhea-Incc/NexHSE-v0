import { clearAdminSessionCookie, isTrustedOrigin, setAdminSessionCookie, verifyAdminKey, verifyAdminSession } from '../lib/api/admin-session';

export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ authenticated: verifyAdminSession(req) });
  if (req.method === 'DELETE') {
    if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });
    clearAdminSessionCookie(res);
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });
  if (!process.env.ADMIN_API_KEY) return res.status(503).json({ error: 'Admin access is not configured' });
  if (!verifyAdminKey(req.body?.key)) return res.status(401).json({ error: 'Invalid admin credential' });
  setAdminSessionCookie(res);
  return res.status(200).json({ authenticated: true });
}
