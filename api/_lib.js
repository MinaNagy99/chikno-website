// Shared helpers for the admin API (Vercel serverless functions).
import crypto from 'node:crypto';
import { put, list, del } from '@vercel/blob';

const COOKIE = 'chk_admin';
const WEEK = 7 * 24 * 3600;

export const env = () => ({
  email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || '',
  blob: !!process.env.BLOB_READ_WRITE_TOKEN,
});

function secret() {
  const e = env();
  return process.env.SESSION_SECRET ||
    crypto.createHash('sha256').update('chikno|' + e.email + '|' + e.password + '|' + (process.env.BLOB_READ_WRITE_TOKEN || '')).digest('hex');
}
const b64u = (s) => Buffer.from(s).toString('base64url');
const sign = (p) => crypto.createHmac('sha256', secret()).update(p).digest('base64url');

export function safeEqual(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

export function makeToken(email) {
  const p = b64u(JSON.stringify({ e: email, x: Math.floor(Date.now() / 1000) + WEEK }));
  return p + '.' + sign(p);
}

export function readToken(req) {
  const raw = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return null;
  const [p, s] = raw.slice(COOKIE.length + 1).split('.');
  if (!p || !s || !safeEqual(sign(p), s)) return null;
  try {
    const d = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (d.x < Date.now() / 1000 || d.e !== env().email) return null;
    return d;
  } catch { return null; }
}

export const setCookie = (res, token) => res.setHeader('Set-Cookie',
  `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${token ? WEEK : 0}`);

export function json(res, code, data) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Admin-only guard. Mutating requests must also carry the X-Chk header (blocks cross-site form posts).
export function requireAdmin(req, res) {
  if (!env().email || !env().password) { json(res, 503, { error: 'not_configured' }); return false; }
  if (!readToken(req)) { json(res, 401, { error: 'unauthorized' }); return false; }
  if (req.method !== 'GET' && req.headers['x-chk'] !== '1') { json(res, 403, { error: 'forbidden' }); return false; }
  return true;
}

export async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const chunks = []; for await (const c of req) chunks.push(c);
  const s = Buffer.concat(chunks).toString(); return s ? JSON.parse(s) : {};
}

// ---- menu storage: every save is a new file (data/menu-<time>.json); the newest one is live; last 10 kept as history.
const PREFIX = 'data/menu-';
async function menuBlobs() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  return blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}
export async function readMenu() {
  if (!env().blob) return null;
  const blobs = await menuBlobs();
  if (!blobs.length) return null;
  const r = await fetch(blobs[0].url, { cache: 'no-store' });
  if (!r.ok) throw new Error('blob_read_' + r.status);
  return r.json();
}
export async function writeMenu(menu) {
  const body = JSON.stringify(menu);
  const name = PREFIX + Date.now() + '.json';
  await put(name, body, { access: 'public', contentType: 'application/json', addRandomSuffix: true, cacheControlMaxAge: 60 });
  const old = (await menuBlobs()).slice(10).map((b) => b.url);
  if (old.length) await del(old).catch(() => {});
}
export async function saveImage(buf, type) {
  const ext = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }[type] || 'jpg';
  const r = await put(`img/dish-${Date.now()}.${ext}`, buf, { access: 'public', contentType: type, addRandomSuffix: true });
  return r.url;
}

// ---- validation: keep the exact array format the site uses.
const FLAGS = /^[pbfsxh]*$/;
const str = (v, n) => String(v ?? '').slice(0, n);
export function cleanMenu(m) {
  if (!m || !Array.isArray(m.cats) || !Array.isArray(m.items)) throw new Error('bad_menu');
  const cats = m.cats.slice(0, 60).map((c) => {
    const id = str(c[0], 40).replace(/[^\w-]/g, '');
    if (!id) throw new Error('bad_cat');
    return [id, str(c[1], 30).replace(/[^\w-]/g, '') || 'f-chicken', str(c[2], 80), str(c[3], 80)];
  });
  const catIds = new Set(cats.map((c) => c[0]));
  const seen = new Set();
  const items = m.items.slice(0, 1000).map((i) => {
    const id = str(i[0], 40).replace(/[^\w-]/g, '');
    if (!id || seen.has(id)) throw new Error('bad_item'); seen.add(id);
    const cat = str(i[1], 40); if (!catIds.has(cat)) throw new Error('bad_item_cat');
    const price = Math.max(0, Math.min(100000, Math.round(Number(i[2]) * 100) / 100 || 0));
    const img = str(i[3], 400);
    const mock = process.env.MOCK_BLOB_BASE; // local tests only
    if (img && !/^\d{1,12}$/.test(img) && !/^https:\/\/[\w.-]+\.public\.blob\.vercel-storage\.com\//.test(img) && !(mock && img.startsWith(mock))) throw new Error('bad_img');
    const flags = str(i[4], 10); if (!FLAGS.test(flags)) throw new Error('bad_flags');
    return [id, cat, price, img, flags, str(i[5], 120), str(i[6], 120), str(i[7], 400), str(i[8], 400)];
  });
  return { v: 1, cats, items, savedAt: new Date().toISOString() };
}
