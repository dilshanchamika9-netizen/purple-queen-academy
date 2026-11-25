// Purple Queen Chess Academy: PayHere payment helper (Cloudflare Worker, free plan).
// POST /checkout  signed-in student or parent asks to pay an invoice; returns the signed PayHere form fields.
// POST /notify    PayHere calls this after a payment; the signature is checked, then the payment is added to the invoice.
// Secrets (never in the website): PAYHERE_MERCHANT_ID, PAYHERE_SECRET, FIREBASE_SA (service account JSON).
// Variables: FIREBASE_API_KEY, SITE_URL, PAYHERE_SANDBOX ("1" for the sandbox), ALLOWED_ORIGIN.

/* ---------- MD5 (PayHere needs it; also runs in Node for the tests) ---------- */
export function md5(str) {
  const b = new TextEncoder().encode(str), n = b.length, w = [];
  for (let i = 0; i < n; i++) w[i >> 2] |= b[i] << ((i % 4) * 8);
  w[n >> 2] |= 0x80 << ((n % 4) * 8); const len = (((n + 8) >> 6) + 1) * 16; for (let i = 0; i < len; i++) w[i] = w[i] || 0;
  w[len - 2] = n * 8;
  const K = [], S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  const rol = (x, c) => (x << c) | (x >>> (32 - c));
  for (let o = 0; o < len; o += 16) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (B & C) | (~B & D); g = i } else if (i < 32) { f = (D & B) | (~D & C); g = (5 * i + 1) % 16 } else if (i < 48) { f = B ^ C ^ D; g = (3 * i + 5) % 16 } else { f = C ^ (B | ~D); g = (7 * i) % 16 }
      const t = D; D = C; C = B; B = (B + rol((A + f + K[i] + (w[o + g] | 0)) | 0, S[(i >> 4) * 4 + (i % 4)])) | 0; A = t;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  return [a0, b0, c0, d0].map(x => { let s = ''; for (let i = 0; i < 4; i++) s += ((x >>> (i * 8)) & 255).toString(16).padStart(2, '0'); return s }).join('');
}
const up = (s) => s.toUpperCase();
export const fmtAmount = (n) => (Math.round(n * 100) / 100).toFixed(2);
export const checkoutHash = ({ merchantId, orderId, amount, currency, secret }) => up(md5(merchantId + orderId + fmtAmount(amount) + currency + up(md5(secret))));
export const notifySig = ({ merchantId, orderId, amount, currency, statusCode, secret }) => up(md5(merchantId + orderId + amount + currency + statusCode + up(md5(secret))));

/* ---------- Firestore over REST with a service account ---------- */
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let tokenCache = null;
async function accessToken(sa) {
  if (tokenCache && tokenCache.exp > Date.now() + 60000) return tokenCache.t;
  const now = Math.floor(Date.now() / 1000), enc = (o) => b64u(new TextEncoder().encode(JSON.stringify(o)));
  const head = enc({ alg: 'RS256', typ: 'JWT' }), claim = enc({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = b64u(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head + '.' + claim)));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + head + '.' + claim + '.' + sig });
  const j = await r.json(); if (!j.access_token) throw new Error('token');
  tokenCache = { t: j.access_token, exp: Date.now() + (j.expires_in || 3000) * 1000 }; return tokenCache.t;
}
export const fromFs = (v) => {
  if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return +v.integerValue; if ('doubleValue' in v) return v.doubleValue; if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null; if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFs);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromFs(x)]));
  return null;
};
export const toFs = (x) => x === null ? { nullValue: null } : typeof x === 'string' ? { stringValue: x } : typeof x === 'boolean' ? { booleanValue: x } : typeof x === 'number' ? (Number.isInteger(x) ? { integerValue: String(x) } : { doubleValue: x })
  : Array.isArray(x) ? { arrayValue: { values: x.map(toFs) } } : { mapValue: { fields: Object.fromEntries(Object.entries(x).map(([k, v]) => [k, toFs(v)])) } };
const docUrl = (env, path) => `https://firestore.googleapis.com/v1/projects/${JSON.parse(env.FIREBASE_SA).project_id}/databases/(default)/documents/${path}`;
async function getDoc(env, path) {
  const r = await fetch(docUrl(env, path), { headers: { Authorization: 'Bearer ' + await accessToken(JSON.parse(env.FIREBASE_SA)) } });
  if (r.status === 404) return null; if (!r.ok) throw new Error('firestore ' + r.status);
  const d = await r.json(); return { data: Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, fromFs(v)])), updateTime: d.updateTime };
}
async function patchDoc(env, path, fields, updateTime) {
  const mask = Object.keys(fields).map(k => 'updateMask.fieldPaths=' + encodeURIComponent(k)).join('&');
  const r = await fetch(docUrl(env, path) + '?' + mask + '&currentDocument.updateTime=' + encodeURIComponent(updateTime), { method: 'PATCH', headers: { Authorization: 'Bearer ' + await accessToken(JSON.parse(env.FIREBASE_SA)), 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, toFs(v)])) }) });
  return r.ok;
}

/* ---------- handlers ---------- */
const cors = (env) => ({ 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' });
const json = (env, o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', ...cors(env) } });
const colombo = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });

async function whoIs(env, idToken) {
  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + env.FIREBASE_API_KEY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
  if (!r.ok) return null; const j = await r.json(); return j.users && j.users[0] ? j.users[0].localId : null;
}
export async function checkout(env, req) {
  const idToken = (req.headers.get('Authorization') || '').replace(/^Bearer /, ''); if (!idToken) return json(env, { error: 'sign in' }, 401);
  const uid = await whoIs(env, idToken); if (!uid) return json(env, { error: 'sign in' }, 401);
  const { invoiceId } = await req.json().catch(() => ({})); if (!invoiceId || /[\/]/.test(invoiceId)) return json(env, { error: 'invoice' }, 400);
  const inv = await getDoc(env, 'invoices/' + invoiceId); if (!inv) return json(env, { error: 'not found' }, 404);
  const me = await getDoc(env, 'users/' + uid), I = inv.data;
  const allowed = I.uid === uid || (me && me.data.role === 'parent' && me.data.childUid === I.uid);
  if (!allowed) return json(env, { error: 'not yours' }, 403);
  const bal = Math.round((I.amount - (I.paid || 0)) * 100) / 100; if (bal <= 0) return json(env, { error: 'already paid' }, 400);
  const kid = (await getDoc(env, 'users/' + I.uid)) || { data: {} };
  const orderId = invoiceId + '-' + Date.now().toString(36), cur = I.currency || 'LKR', site = (env.SITE_URL || '').replace(/\/?$/, '/');
  const [first, ...rest] = String(I.name || 'Student').split(' ');
  const fields = { merchant_id: env.PAYHERE_MERCHANT_ID, return_url: site + (me && me.data.role === 'parent' ? 'parent.html' : 'account.html'), cancel_url: site + (me && me.data.role === 'parent' ? 'parent.html' : 'account.html'), notify_url: new URL(req.url).origin + '/notify',
    first_name: first, last_name: rest.join(' ') || first, email: kid.data.parentEmail || 'pqc.academy@gmail.com', phone: kid.data.parentPhone || '0771691435', address: 'Gampaha', city: 'Gampaha', country: 'Sri Lanka',
    order_id: orderId, items: I.title, currency: cur, amount: fmtAmount(bal), custom_1: invoiceId, hash: checkoutHash({ merchantId: env.PAYHERE_MERCHANT_ID, orderId, amount: bal, currency: cur, secret: env.PAYHERE_SECRET }) };
  return json(env, { action: env.PAYHERE_SANDBOX === '1' ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout', fields });
}
export async function notify(env, req) {
  const f = Object.fromEntries(new URLSearchParams(await req.text()));
  const sig = notifySig({ merchantId: f.merchant_id || '', orderId: f.order_id || '', amount: f.payhere_amount || '', currency: f.payhere_currency || '', statusCode: f.status_code || '', secret: env.PAYHERE_SECRET });
  if (f.merchant_id !== env.PAYHERE_MERCHANT_ID || !f.md5sig || up(f.md5sig) !== sig) return new Response('bad signature', { status: 400 });
  if (f.status_code !== '2') return new Response('ignored', { status: 200 });
  const invoiceId = f.custom_1 || String(f.order_id).split('-')[0];
  for (let attempt = 0; attempt < 4; attempt++) {
    const inv = await getDoc(env, 'invoices/' + invoiceId); if (!inv) return new Response('no invoice', { status: 200 });
    const I = inv.data, payments = I.payments || [];
    if (payments.some(p => p.id === 'ph' + f.payment_id)) return new Response('OK', { status: 200 });
    if ((I.currency || 'LKR') !== f.payhere_currency) return new Response('currency', { status: 200 });
    const amount = Math.round(parseFloat(f.payhere_amount) * 100) / 100;
    const next = payments.concat({ id: 'ph' + f.payment_id, amount, method: 'payhere', ref: String(f.payment_id), date: colombo(), by: 'payhere' });
    const paid = Math.round(next.reduce((n, p) => n + p.amount, 0) * 100) / 100;
    if (await patchDoc(env, 'invoices/' + invoiceId, { payments: next, paid, open: I.amount - paid > 0.001 }, inv.updateTime)) return new Response('OK', { status: 200 });
  }
  return new Response('busy', { status: 503 });
}
export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });
    try {
      if (req.method === 'POST' && u.pathname === '/checkout') return await checkout(env, req);
      if (req.method === 'POST' && u.pathname === '/notify') return await notify(env, req);
    } catch (e) { return json(env, { error: 'server' }, 500) }
    return new Response('Purple Queen payments', { status: 200 });
  },
};
