import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = 'nexhse_admin_session';
const sessionDurationSeconds = 60 * 60 * 12;
const trustedOrigins = new Set(['https://nexhse.co.ke', 'https://www.nexhse.co.ke', 'https://shop.nexhse.co.ke', 'https://admin.nexhse.co.ke']);

export function isTrustedOrigin(req: any) {
  const origin = String(req.headers?.origin ?? '');
  if (!origin) return process.env.NODE_ENV !== 'production';
  const configuredOrigins = (process.env.SITE_ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean);
  return trustedOrigins.has(origin) || configuredOrigins.includes(origin);
}

function secret() {
  return process.env.ADMIN_API_KEY ?? '';
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function readCookie(req: any) {
  const header = String(req.headers?.cookie ?? '');
  const pair = header.split(';').map((value: string) => value.trim()).find((value: string) => value.startsWith(`${cookieName}=`));
  return pair ? decodeURIComponent(pair.slice(cookieName.length + 1)) : '';
}

export function verifyAdminSession(req: any) {
  if (!secret()) return false;
  const token = readCookie(req);
  const [expiresText, suppliedSignature] = token.split('.');
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000) || !suppliedSignature) return false;
  const expected = sign(expiresText);
  const supplied = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expected);
  return supplied.length === expectedBuffer.length && timingSafeEqual(supplied, expectedBuffer);
}

export function verifyAdminKey(candidate: unknown) {
  const configured = secret();
  if (!configured || typeof candidate !== 'string') return false;
  const expected = Buffer.from(configured);
  const supplied = Buffer.from(candidate);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export function setAdminSessionCookie(res: any) {
  const expires = Math.floor(Date.now() / 1000) + sessionDurationSeconds;
  const token = `${expires}.${sign(String(expires))}`;
  const isProduction = process.env.NODE_ENV === 'production';
  const cookie = `${cookieName}=${encodeURIComponent(token)}; Path=/; Max-Age=${sessionDurationSeconds}; HttpOnly; SameSite=Lax${isProduction ? '; Secure; Domain=.nexhse.co.ke' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}

export function clearAdminSessionCookie(res: any) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProduction ? '; Secure; Domain=.nexhse.co.ke' : ''}`);
}
