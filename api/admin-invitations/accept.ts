import { createHash } from 'node:crypto';
import { acceptAdminInvitation } from '@workspace/db';
import { hashAdminPassword, isTrustedOrigin, setAdminSessionCookie } from '../../lib/api/admin-session';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isTrustedOrigin(req)) return res.status(403).json({ error: 'Untrusted origin' });

  const { token, password } = req.body ?? {};
  if (typeof token !== 'string' || token.length < 32 || typeof password !== 'string' || password.length < 12) {
    return res.status(400).json({ error: 'A valid invite and password of at least 12 characters are required' });
  }

  try {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const user = await acceptAdminInvitation(tokenHash, hashAdminPassword(password));
    if (!user) return res.status(400).json({ error: 'This invitation is invalid, expired, or already accepted' });
    setAdminSessionCookie(res, { userId: user.id, email: user.email, role: user.role });
    return res.status(201).json({ authenticated: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('admin invitation acceptance failed', error);
    return res.status(500).json({ error: 'Unable to accept this invitation' });
  }
}
