import { env, readToken, json } from './_lib.js';
export default function handler(req, res) {
  const e = env();
  const t = readToken(req);
  json(res, 200, { configured: !!(e.email && e.password), storage: e.blob, signedIn: !!t, email: t ? t.e : null });
}
