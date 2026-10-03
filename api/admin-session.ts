import { clearAdminSessionCookie, getActiveAdminSession, isTrustedOrigin, setAdminSessionCookie, verifyAdminKey, verifyAdminPassword, verifyHashedAdminPassword } from '../lib/api/admin-session';
import { findAdminUserByEmail } from '@workspace/db';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const session = await getActiveAdminSession(req);
    return res.status(200).json({ authenticated: Boolean(session), user: session ? { id: session.userId, email: session.email, role: session.role } : null });
  }
  if (req.method === 'DELETE') {
    if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });
    clearAdminSessionCookie(res);
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body?.password ?? req.body?.credential ?? req.body?.key;

  if (email && typeof password === 'string') {
    const user = await findAdminUserByEmail(email);
    if (!user || !user.active || !verifyHashedAdminPassword(password, user.passwordHash)) return res.status(401).json({ error: 'Invalid admin credential' });
    setAdminSessionCookie(res, { userId: user.id, email: user.email, role: user.role });
    return res.status(200).json({ authenticated: true, user: { id: user.id, email: user.email, role: user.role } });
  }

  if (!process.env.ADMIN_API_KEY && !process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin access is not configured' });
  if (!verifyAdminKey(password) && !verifyAdminPassword(password)) return res.status(401).json({ error: 'Invalid admin credential' });
  const owner = { userId: 'owner', email: process.env.ADMIN_EMAIL ?? 'owner', role: 'owner' };
  setAdminSessionCookie(res, owner);
  return res.status(200).json({ authenticated: true, user: { id: owner.userId, email: owner.email, role: owner.role } });
}
