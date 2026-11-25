import { auth } from './fb.js';
import { PAY_URL } from './pay-config.js';
// Click on any button[data-pay]: ask the payments Worker for a signed PayHere form, then send the browser to PayHere.
document.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-pay]'); if (!b || !PAY_URL) return;
  const old = b.textContent; b.disabled = true; b.textContent = 'Opening PayHere…';
  try {
    const tok = await auth.currentUser.getIdToken();
    const r = await fetch(PAY_URL.replace(/\/$/, '') + '/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }, body: JSON.stringify({ invoiceId: b.dataset.pay }) });
    const j = await r.json(); if (!r.ok) throw new Error(j.error || 'failed');
    const f = document.createElement('form'); f.method = 'POST'; f.action = j.action;
    Object.entries(j.fields).forEach(([k, v]) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; f.appendChild(i) });
    document.body.appendChild(f); f.submit();
  } catch (err) { b.disabled = false; b.textContent = old; alert('Could not start the payment: ' + err.message) }
});
