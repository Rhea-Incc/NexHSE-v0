import { getPublicSupabaseConfig } from '../../lib/api/supabase';

export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const config = getPublicSupabaseConfig();
  if (!config) return res.status(503).json({ error: 'Supabase public configuration is unavailable' });
  return res.status(200).json(config);
}