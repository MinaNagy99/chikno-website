// Admin menu API. GET: current saved menu (null = still using the built-in menu). PUT: save the whole menu.
import { requireAdmin, json, readBody, readMenu, writeMenu, cleanMenu, env } from './_lib.js';
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') return json(res, 200, { menu: await readMenu() });
    if (req.method === 'PUT') {
      if (!env().blob) return json(res, 503, { error: 'no_storage' });
      const menu = cleanMenu(await readBody(req));
      await writeMenu(menu);
      return json(res, 200, { ok: true, savedAt: menu.savedAt });
    }
    return json(res, 405, { error: 'method' });
  } catch (err) {
    return json(res, String(err.message).startsWith('bad_') ? 400 : 500, { error: String(err.message || err) });
  }
}
