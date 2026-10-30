/* =========================================================================
   ZERYTHA OS — Müşteri Detayı (Customer Detail)
   ========================================================================= */
(function () {
  const { STATE, fmtDate, fmtMoney, fmtNumber } = window.APP;

  const STATUS_CLASS = {
    Quotation: "badge-quotation",
    "Awaiting Approval": "badge-approval",
    "Material Planning": "badge-planning",
    Production: "badge-production",
    "Quality Control": "badge-quality",
    Packaging: "badge-packaging",
    "Ready to Ship": "badge-ship",
    Completed: "badge-completed"
  };
  const STATUS_LABEL = {
    Quotation: "Teklif",
    "Awaiting Approval": "Onay Bekliyor",
    "Material Planning": "Malzeme Planlama",
    Production: "Üretim",
    "Quality Control": "Kalite",
    Packaging: "Paketleme",
    "Ready to Ship": "Teslime Hazır",
    Completed: "Tamamlandı"
  };

  function esc(t) {
    if (t === null || t === undefined) return "";
    return String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function badge(status) {
    return `<span class="badge ${STATUS_CLASS[status] || "badge-quotation"}">${STATUS_LABEL[status] || status}</span>`;
  }

  function render() {
    const q = window.APP.getQuery();
    const c = STATE.customers.find(x => x.id === q.id) || STATE.customers[0];
    const custKey = c.id.replace("C-", "cust-");
    const orders = STATE.orders.filter(o => o.customer === c.company);
    const wos = (window.WORK_DATA.workOrders || []).filter(w => w.custId === custKey);
    const openWo = wos.filter(w => w.status === "Açık").length;
    const value = orders.reduce((a, o) => a + o.value, 0);
    const nextDeadline = orders
      .map(o => o.deadline)
      .filter(Boolean)
      .sort()[0];

    return `
<div class="page-header">
  <div>
    <button class="btn btn-ghost btn-sm" onclick="window.APP.navigate('/customers')" style="margin-bottom:0.5rem;padding-left:0;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      Müşteriler
    </button>
    <h1 class="page-title text-brand">${esc(c.company)}</h1>
    <p class="page-subtitle">${esc(c.contact)} · ${esc(c.address)} · ${esc(c.id)}</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('/b2b-detail?id=${encodeURIComponent(c.id)}')">Portal Görünümü</button>
    <button class="btn btn-primary btn-sm" onclick="window.APP.navigate('/workorder-new')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Yeni İş Emri
    </button>
  </div>
</div>

<div class="wo-stats">
  <div class="wo-stat"><span>Toplam Sipariş</span><strong>${fmtNumber(c.orders)}</strong></div>
  <div class="wo-stat"><span>İş Emri</span><strong>${fmtNumber(wos.length)}</strong></div>
  <div class="wo-stat"><span>Açık İş Emri</span><strong>${fmtNumber(openWo)}</strong></div>
  <div class="wo-stat"><span>Son Sipariş</span><strong>${fmtDate(c.lastOrder)}</strong></div>
</div>

<div class="wo-two-col" style="margin-bottom:1.25rem;">
  <div class="card">
    <div class="card-head" style="padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
      <div class="panel-title">Müşteri Kartı</div>
    </div>
    <div class="card-body">
      <div class="wo-spec-grid" style="margin-top:0;padding-top:0;border-top:0;grid-template-columns:repeat(2,minmax(0,1fr));">
        <div><div class="form-label">Yetkili Kişi</div><div class="wo-spec-value">${esc(c.contact)}</div></div>
        <div><div class="form-label">Durum</div><div class="wo-spec-value"><span class="badge badge-quality">${esc(c.status)}</span></div></div>
        <div><div class="form-label">E-posta</div><div class="wo-spec-value">${esc(c.email)}</div></div>
        <div><div class="form-label">Telefon</div><div class="wo-spec-value">${esc(c.phone)}</div></div>
        <div><div class="form-label">Adres</div><div class="wo-spec-value">${esc(c.address)}</div></div>
        <div><div class="form-label">Yaklaşan Termin</div><div class="wo-spec-value">${fmtDate(nextDeadline)}</div></div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head" style="padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
      <div class="panel-title">Sipariş Değeri</div>
    </div>
    <div class="card-body">
      <div style="font-family:var(--font-numeric);font-size:1.9rem;font-weight:600;color:var(--color-text-main);letter-spacing:-0.02em;">
        ${fmtMoney(value)}
      </div>
      <div style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.35rem;">
        ${orders.length} kayıtlı siparişin toplam değeri
      </div>
      <div style="margin-top:1.1rem;padding-top:1rem;border-top:1px solid var(--color-border);display:flex;flex-direction:column;gap:0.55rem;">
        ${orders.map(o => `<div class="island-row" style="padding:0;font-size:0.78rem;">
          <span style="color:var(--color-text-secondary);">${esc(o.model)}</span>
          <b style="font-family:var(--font-numeric);color:var(--color-text-main);">${fmtMoney(o.value)}</b>
        </div>`).join("") || `<div style="font-size:0.8rem;color:var(--color-text-muted);">Sipariş kaydı yok</div>`}
      </div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom:1.25rem;">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">Siparişler</div>
    <button class="btn btn-ghost btn-sm" onclick="window.APP.navigate('/orders')">Tüm Siparişler →</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Sipariş No</th><th>Model</th><th>Renk</th><th style="text-align:right;">Adet</th><th>Termin</th><th>Durum</th></tr></thead>
      <tbody>
        ${orders.map(o => `<tr style="cursor:pointer;" onclick="window.APP.navigate('/order-detail?id=${encodeURIComponent(o.id)}')">
          <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-gold-champagne);">${esc(o.id)}</td>
          <td>${esc(o.model)}</td>
          <td style="color:var(--color-text-secondary);">${esc(o.color)}</td>
          <td class="num" style="text-align:right;">${fmtNumber(o.qty)}</td>
          <td style="font-size:0.8rem;">${fmtDate(o.deadline)}</td>
          <td>${badge(o.status)}</td>
        </tr>`).join("") || `<tr><td colspan="6" style="padding:1.5rem;text-align:center;color:var(--color-text-muted);">Bu müşteriye ait sipariş bulunmuyor</td></tr>`}
      </tbody>
    </table>
  </div>
</div>

<div class="card">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">İş Emirleri</div>
    <button class="btn btn-ghost btn-sm" onclick="window.APP.navigate('/workorders')">İş Emri Klasörleri →</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>İş Emri</th><th>Sezon</th><th>Model</th><th>GG</th><th style="text-align:right;">Adet</th><th>Termin</th><th>Durum</th></tr></thead>
      <tbody>
        ${wos.map(w => `<tr style="cursor:pointer;" onclick="window.APP.navigate('/workorder-detail?id=${encodeURIComponent(w.id)}')">
          <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-gold-champagne);">${esc(w.id)}</td>
          <td style="font-size:0.8rem;">${esc(w.season)}</td>
          <td>${esc(w.modelName || w.model)}</td>
          <td style="font-size:0.8rem;color:var(--color-text-secondary);">${esc(w.gauge)}</td>
          <td class="num" style="text-align:right;">${fmtNumber(w.qty)}</td>
          <td style="font-size:0.8rem;">${fmtDate(w.deadline)}</td>
          <td><span class="badge ${w.status === "Açık" ? "badge-production" : "badge-completed"}">${esc(w.status)}</span></td>
        </tr>`).join("") || `<tr><td colspan="7" style="padding:1.5rem;text-align:center;color:var(--color-text-muted);">İş emri bulunmuyor</td></tr>`}
      </tbody>
    </table>
  </div>
</div>
`;
  }

  function mount() {}

  window.VIEWS["customer-detail"] = { render, mount };
})();
