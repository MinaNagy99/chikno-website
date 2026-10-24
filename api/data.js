// Public: the live menu as a script for the website. Falls back to the built-in menu when nothing is saved yet.
import { readMenu } from './_lib.js';
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  let out = '/* built-in menu */';
  try {
    const m = await readMenu();
    if (m && m.cats && m.items) {
      const items = m.items.filter((i) => !String(i[4] || '').includes('h'));
      const used = new Set(items.map((i) => i[1]));
      const cats = m.cats.filter((c) => used.has(c[0]));
      out = 'window.CHIKNO_DATA=' + JSON.stringify({ cats, items }).replace(/</g, '\\u003c') + ';';
    }
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=20, stale-while-revalidate=86400');
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    out = '/* menu unavailable: ' + String(e.message || e).replace(/\*\//g, '') + ' */';
  }
  res.statusCode = 200;
  res.end(out);
}
