import { db, F, whoAmI, esc, money } from './fb.js';
const root = document.getElementById('portalReceipt');
(async () => {
  const me = await whoAmI();
  if (!me || me.role === 'none') return (location.href = 'login.html');
  const q = new URLSearchParams(location.search), id = q.get('i'), k = +q.get('p');
  let inv = null; try { const s = await F.getDoc(F.doc(db, 'invoices', id)); if (s.exists()) inv = s.data() } catch {}
  const pay = inv && (inv.payments || [])[k];
  if (!pay) { root.innerHTML = '<p class="muted">This receipt was not found.</p>'; return }
  const before = (inv.payments || []).slice(0, k + 1).reduce((n, p) => n + p.amount, 0), bal = Math.max(0, inv.amount - before);
  const no = 'PQR-' + id.slice(0, 6).toUpperCase() + '-' + (k + 1);
  const M = { cash: 'Cash', bank: 'Bank transfer', payhere: 'Online (PayHere)', other: 'Other' };
  root.innerHTML = `<article class="receipt"><header><img src="assets/logo/pq-logo-primary-wood.svg" alt="" width="84" height="84"><div><b>Purple Queen Chess Academy</b><span>Gampaha, Sri Lanka · pqc.academy@gmail.com</span></div><h1>Payment receipt</h1></header>
    <dl><dt>Receipt no.</dt><dd>${no}</dd><dt>Date</dt><dd>${esc(pay.date)}</dd><dt>Student</dt><dd>${esc(inv.name)} (${esc(inv.sid)})</dd><dt>For</dt><dd>${esc(inv.title)}</dd>
    <dt>Amount received</dt><dd class="big">${money(pay.amount, inv.currency)}</dd><dt>Method</dt><dd>${M[pay.method] || esc(pay.method)}${pay.ref ? ' · ' + esc(pay.ref) : ''}</dd>
    <dt>Fee total</dt><dd>${money(inv.amount, inv.currency)}</dd><dt>Balance after this payment</dt><dd>${money(bal, inv.currency)}</dd></dl>
    <p class="thanks">Thank you.</p></article>
    <div class="noprint"><button type="button" class="btn btn-primary" id="prt">Print or save as PDF</button> <a class="btn btn-ghost" href="javascript:history.back()">Back</a></div>`;
  document.getElementById('prt').onclick = () => print();
})();
