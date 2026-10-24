import { setCookie, json } from './_lib.js';
export default function handler(req, res) {
  setCookie(res, '');
  json(res, 200, { ok: true });
}
