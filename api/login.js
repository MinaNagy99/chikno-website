import { env, safeEqual, makeToken, setCookie, json, readBody } from './_lib.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  const e = env();
  if (!e.email || !e.password) return json(res, 503, { error: 'not_configured' });
  let b = {}; try { b = await readBody(req); } catch { return json(res, 400, { error: 'bad_request' }); }
  const okEmail = safeEqual(String(b.email || '').trim().toLowerCase(), e.email);
  const okPass = safeEqual(String(b.password || ''), e.password);
  if (!(okEmail && okPass)) { await new Promise((r) => setTimeout(r, 600)); return json(res, 401, { error: 'wrong' }); }
  setCookie(res, makeToken(e.email));
  return json(res, 200, { ok: true, email: e.email });
}
