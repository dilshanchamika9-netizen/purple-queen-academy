// Coach: fees. Create charges for students, record payments, print receipts, send reminders.
import { db, F, esc, today, money } from './fb.js';
import { invStat, invPill, toCsv, download, waLink, feeText } from './lms.js';
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initFees(ctx) {
  const { box, getStudents, coach, queueEmail } = ctx;
  let invs = [], filter = 'open', q = '';
  box.innerHTML = `
    <div class="acc-stats" id="fStats"></div>
    <form class="acc-card" id="feeForm"><h3>Create fees</h3>
      <div class="row2"><label for="fTitle">What is it for?<input id="fTitle" required placeholder="e.g. November 2026 class fee"></label>
        <label for="fAmt">Amount (LKR)<input id="fAmt" type="number" min="1" step="0.01" required placeholder="e.g. 5000"></label></div>
      <div class="row2"><label for="fDue">Due date<input id="fDue" type="date" required></label>
        <label for="fWho">Charge<select id="fWho"><option value="all">All students</option><option value="level">One level</option><option value="batch">One batch</option><option value="pick">Chosen students</option></select></label></div>
      <label for="fWhoVal" id="fWhoWrap" hidden><span id="fWhoLab"></span><select id="fWhoVal"></select></label>
      <div class="pickbox" id="fPick" hidden></div>
      <label class="chk" for="fMail"><input type="checkbox" id="fMail"> Email the parents (only those with an email saved)</label>
      <button class="btn btn-primary btn-sm" type="submit">Create fees</button><p class="pmsg2" id="fMsg"></p></form>
    <section class="acc-card"><div class="tbl-head"><h3>Fees</h3><div class="tools">
      <select id="fFilter" aria-label="Filter fees"><option value="open">Unpaid</option><option value="overdue">Overdue</option><option value="paid">Paid</option><option value="all">All</option></select>
      <input id="fSearch" type="search" placeholder="Search student or fee" aria-label="Search fees"><button type="button" class="btn btn-ghost btn-sm" id="fCsv">Download CSV</button></div></div>
      <div class="tw"><table class="stu" id="fTable"><thead><tr><th>Student</th><th>Fee</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody><tr><td colspan="8" class="muted">Loading…</td></tr></tbody></table></div></section>`;
  const $ = (s) => box.querySelector(s);
  const LEVELS = { 1: 'Level 1', 2: 'Level 2', 3: 'Level 3' };
  const who = () => {
    const w = $('#fWho').value, val = $('#fWhoVal'), st = getStudents();
    $('#fWhoWrap').hidden = !(w === 'level' || w === 'batch'); $('#fPick').hidden = w !== 'pick';
    if (w === 'level') { $('#fWhoLab').textContent = 'Level'; val.innerHTML = [1, 2, 3].map(l => `<option value="${l}">${LEVELS[l]}</option>`).join('') }
    if (w === 'batch') { $('#fWhoLab').textContent = 'Batch'; const b = [...new Set(st.map(s => s.batch).filter(Boolean))]; val.innerHTML = b.length ? b.map(x => `<option>${esc(x)}</option>`).join('') : '<option value="">No batches yet</option>' }
    if (w === 'pick') $('#fPick').innerHTML = st.map(s => `<label><input type="checkbox" value="${s.uid}"> ${esc(s.sid)} ${esc(s.name)}</label>`).join('') || '<p class="muted">No students yet.</p>';
  };
  $('#fWho').onchange = who;

  async function load() {
    const s = await F.getDocs(F.query(F.collection(db, 'invoices'), F.orderBy('due', 'desc'), F.limit(800)));
    invs = s.docs.map(d => ({ id: d.id, ...d.data() })); paint();
  }
  function paintStats() {
    const open = invs.map(i => ({ i, st: invStat(i) })).filter(x => x.st.bal > 0);
    const month = today().slice(0, 7);
    const got = invs.reduce((n, i) => n + (i.payments || []).filter(p => (p.date || '').startsWith(month)).reduce((a, p) => a + p.amount, 0), 0);
    const late = open.filter(x => x.st.state === 'overdue');
    $('#fStats').innerHTML = `<div><b>${money(open.reduce((n, x) => n + x.st.bal, 0))}</b><span>Outstanding</span></div><div><b>${money(late.reduce((n, x) => n + x.st.bal, 0))}</b><span>Overdue · ${late.length} fees</span></div><div><b>${money(got)}</b><span>Collected this month</span></div><div><b>${invs.length}</b><span>Fees created</span></div>`;
  }
  function paint() {
    paintStats();
    const st = getStudents(), byUid = Object.fromEntries(st.map(s => [s.uid, s]));
    const rows = invs.filter(i => { const x = invStat(i); return (filter === 'all' || (filter === 'open' && x.bal > 0) || (filter === 'overdue' && x.state === 'overdue') || (filter === 'paid' && x.state === 'paid')) && (!q || (i.name + ' ' + i.sid + ' ' + i.title).toLowerCase().includes(q)) });
    $('#fTable tbody').innerHTML = rows.length ? rows.map(i => { const x = invStat(i), s = byUid[i.uid] || {}, wa = waLink(s.parentPhone, feeText(i, x));
      return `<tr data-id="${i.id}"><td><b>${esc(i.sid)}</b> ${esc(i.name)}</td><td>${esc(i.title)}</td><td>${money(i.amount, i.currency)}</td><td>${money(x.paid, i.currency)}</td><td>${money(x.bal, i.currency)}</td><td>${i.due}</td><td>${invPill(x.state)}</td>
      <td class="acts">${x.bal > 0 ? '<button type="button" class="mini" data-f="pay">Record payment</button>' : ''}${(i.payments || []).map((p, k) => `<a class="mini" href="receipt.html?i=${i.id}&p=${k}" target="_blank" rel="noopener">Receipt ${k + 1}</a>`).join('')}${x.bal > 0 && wa ? `<a class="mini" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>` : ''}${x.bal > 0 && s.parentEmail ? '<button type="button" class="mini" data-f="mail">Email</button>' : ''}<button type="button" class="mini danger" data-f="del">Delete</button></td></tr>` }).join('')
      : `<tr><td colspan="8" class="muted">${invs.length ? 'Nothing matches.' : 'No fees yet. Create the first one above.'}</td></tr>`;
  }
  $('#fFilter').onchange = (e) => { filter = e.target.value; paint() };
  $('#fSearch').oninput = (e) => { q = e.target.value.trim().toLowerCase(); paint() };
  $('#fCsv').onclick = () => download('purple-queen-fees-' + today() + '.csv', toCsv([['Student ID', 'Name', 'Fee', 'Amount', 'Paid', 'Balance', 'Due', 'Status', 'Payments'], ...invs.map(i => { const x = invStat(i); return [i.sid, i.name, i.title, i.amount, x.paid, x.bal, i.due, x.state, (i.payments || []).map(p => p.date + ' ' + p.amount + ' ' + p.method + (p.ref ? ' ' + p.ref : '')).join('; ')] })]));

  $('#feeForm').onsubmit = async (e) => {
    e.preventDefault(); const m = $('#fMsg'); m.className = 'pmsg2';
    const title = $('#fTitle').value.trim(), amount = Math.round(parseFloat($('#fAmt').value) * 100) / 100, due = $('#fDue').value, w = $('#fWho').value, st = getStudents();
    let list = st;
    if (w === 'level') list = st.filter(s => +s.level === +$('#fWhoVal').value);
    if (w === 'batch') list = st.filter(s => s.batch === $('#fWhoVal').value);
    if (w === 'pick') { const ids = $$('#fPick input:checked', box).map(c => c.value); list = st.filter(s => ids.includes(s.uid)) }
    if (!title || !(amount > 0) || !due) { m.className = 'pmsg2 err'; m.textContent = 'Enter what it is for, an amount and a due date.'; return }
    if (!list.length) { m.className = 'pmsg2 err'; m.textContent = 'No student matches this choice.'; return }
    m.textContent = 'Creating…';
    try {
      for (let k = 0; k < list.length; k += 400) {
        const b = F.writeBatch(db);
        list.slice(k, k + 400).forEach(s => { const ref = F.doc(F.collection(db, 'invoices')); const data = { uid: s.uid, sid: s.sid, name: s.name, title, amount, currency: 'LKR', due, paid: 0, open: true, payments: [], createdBy: coach.user.email, createdAt: F.serverTimestamp() }; b.set(ref, data); invs.push({ id: ref.id, ...data }) });
        await b.commit();
      }
      let mails = 0;
      if ($('#fMail').checked) for (const s of list) if (s.parentEmail) { await queueEmail({ to: s.parentEmail, subject: `Fee: ${title}`, text: `Hello,\n\nA new fee has been added for ${s.name}: ${title}, ${money(amount)}, due ${due}.\nYou can see it and pay it after signing in at the academy website (parent login).\n\nPurple Queen Chess Academy`, kind: 'fee' }); mails++ }
      e.target.reset(); who(); invs.sort((a, b) => (b.due || '').localeCompare(a.due || '')); paint();
      m.className = 'pmsg2 ok'; m.textContent = `Fees created for ${list.length} student${list.length > 1 ? 's' : ''}.` + (mails ? ` ${mails} email${mails > 1 ? 's' : ''} queued.` : '');
    } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not create the fees: ' + (err.code || err.message) }
  };

  box.addEventListener('click', async (e) => {
    const b = e.target.closest('button[data-f]'); if (!b) return; const tr = b.closest('tr'), i = invs.find(x => x.id === tr.dataset.id); if (!i) return;
    if (b.dataset.f === 'del') {
      if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Press again to delete'; setTimeout(() => { b.dataset.sure = ''; b.textContent = 'Delete' }, 4000); return }
      try { await F.deleteDoc(F.doc(db, 'invoices', i.id)); invs = invs.filter(x => x.id !== i.id); paint() } catch { b.textContent = 'Could not delete' } return;
    }
    if (b.dataset.f === 'mail') {
      const s = getStudents().find(x => x.uid === i.uid), x = invStat(i); b.disabled = true;
      try { await queueEmail({ to: s.parentEmail, subject: `Fee reminder: ${i.title}`, text: `Hello,\n\n${feeText(i, x)}\n\nPurple Queen Chess Academy`, kind: 'fee' }); b.textContent = 'Queued' } catch { b.disabled = false; b.textContent = 'Failed' } return;
    }
    if (b.dataset.f === 'pay') {
      const x = invStat(i);
      tr.insertAdjacentHTML('afterend', `<tr class="payrow"><td colspan="8"><form class="payf"><label>Amount<input name="a" type="number" step="0.01" min="0.01" max="${x.bal}" value="${x.bal}" required></label>
        <label>Method<select name="m"><option value="cash">Cash</option><option value="bank">Bank transfer</option><option value="other">Other</option></select></label>
        <label>Reference<input name="r" placeholder="optional"></label><label>Date<input name="d" type="date" value="${today()}" max="${today()}" required></label>
        <button class="btn btn-primary btn-sm" type="submit">Save payment</button><button class="btn btn-ghost btn-sm" type="button" data-cancel>Cancel</button><span class="pmsg2"></span></form></td></tr>`);
      b.disabled = true;
    }
  });
  box.addEventListener('click', (e) => { if (e.target.matches('[data-cancel]')) { const r = e.target.closest('tr.payrow'); r.previousElementSibling.querySelector('button[data-f="pay"]').disabled = false; r.remove() } });
  box.addEventListener('submit', async (e) => {
    const f = e.target.closest('.payf'); if (!f) return; e.preventDefault();
    const tr = f.closest('tr.payrow').previousElementSibling, i = invs.find(x => x.id === tr.dataset.id), msg = f.querySelector('.pmsg2'), x = invStat(i);
    const amt = Math.round(parseFloat(f.a.value) * 100) / 100;
    if (!(amt > 0) || amt > x.bal + 0.001) { msg.className = 'pmsg2 err'; msg.textContent = 'Amount must be between 0.01 and the balance.'; return }
    const pay = { id: 'p' + Date.now().toString(36), amount: amt, method: f.m.value, ref: f.r.value.trim(), date: f.d.value, by: coach.user.email };
    const payments = (i.payments || []).concat(pay), paid = Math.round(payments.reduce((n, p) => n + p.amount, 0) * 100) / 100;
    try { const open = (i.amount - paid) > 0.001; await F.updateDoc(F.doc(db, 'invoices', i.id), { payments, paid, open }); i.payments = payments; i.paid = paid; i.open = open; paint() }
    catch (err) { msg.className = 'pmsg2 err'; msg.textContent = 'Could not save: ' + (err.code || err.message) }
  });
  load();
  return { reload: load, refreshStudents: () => { who(); paint() } };
}
