// Admin photo upload: JSON { data: <base64>, type: 'image/webp' } -> { url }
import { requireAdmin, json, readBody, saveImage, env } from './_lib.js';
const TYPES = ['image/webp', 'image/jpeg', 'image/png'];
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  if (!requireAdmin(req, res)) return;
  if (!env().blob) return json(res, 503, { error: 'no_storage' });
  try {
    const b = await readBody(req);
    if (!TYPES.includes(b.type)) return json(res, 400, { error: 'bad_type' });
    const buf = Buffer.from(String(b.data || ''), 'base64');
    if (!buf.length || buf.length > 3 * 1024 * 1024) return json(res, 400, { error: 'bad_size' });
    return json(res, 200, { url: await saveImage(buf, b.type) });
  } catch (err) {
    return json(res, 500, { error: String(err.message || err) });
  }
}
