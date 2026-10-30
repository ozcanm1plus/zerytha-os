/* =========================================================================
   ZERYTHA OS — B2B Portal Detayı (müşteri gözünden portal önizlemesi)
   ========================================================================= */
(function () {
  const { STATE, fmtDate, fmtMoney, fmtNumber } = window.APP;

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

  function progress(status) {
    const order = ["Quotation", "Awaiting Approval", "Material Planning", "Production", "Quality Control", "Packaging", "Ready to Ship", "Completed"];
    const idx = order.indexOf(status);
    return idx === -1 ? 0 : Math.round(((idx + 1) / order.length) * 100);
  }

  function render() {
    const q = window.APP.getQuery();
    const c = STATE.customers.find(x => x.id === q.id) || STATE.customers[0];
    const custKey = c.id.replace("C-", "cust-");
    const orders = STATE.orders.filter(o => o.customer === c.company);
    const wos = (window.WORK_DATA.workOrders || []).filter(w => w.custId === custKey);
    const openWo = wos.filter(w => w.status === "Açık").length;
    const value = orders.reduce((a, o) => a + o.value, 0);

    return `
<div class="page-header">
  <div>
    <button class="btn btn-ghost btn-sm" onclick="window.APP.navigate('/b2b')" style="margin-bottom:0.5rem;padding-left:0;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      B2B Portal
    </button>
    <h1 class="page-title text-brand">${esc(c.company)}</h1>
    <p class="page-subtitle">Müşteri portal önizlemesi · ${esc(c.contact)}</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('/customer-detail?id=${encodeURIComponent(c.id)}')">Müşteri Kartı</button>
    <button class="btn btn-primary btn-sm" onclick="window.APP.navigate('/workorder-new')">Yeni İş Emri</button>
  </div>
</div>

<div class="hero" style="min-height:190px;padding:1.75rem 2rem;margin-bottom:1.5rem;">
  <div class="hero-content">
    <div class="hero-eyebrow">B2B Portal · Önizleme</div>
    <div class="hero-title" style="font-size:2.1rem;">${esc(c.company)}</div>
    <div class="hero-tagline">TRIKO, BİR YAŞAM TARZIDIR.</div>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <span class="hero-meta-label">Hesap</span>
        <span class="hero-meta-value">${esc(c.id)}</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Açık İş Emri</span>
        <span class="hero-meta-value">${fmtNumber(openWo)}</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Sipariş Değeri</span>
        <span class="hero-meta-value">${fmtMoney(value)}</span>
      </div>
    </div>
  </div>
</div>

<div class="wo-stats">
  <div class="wo-stat"><span>Sipariş</span><strong>${fmtNumber(c.orders)}</strong></div>
  <div class="wo-stat"><span>Aktif Sipariş</span><strong>${fmtNumber(orders.filter(o => o.status !== "Completed").length)}</strong></div>
  <div class="wo-stat"><span>İş Emri</span><strong>${fmtNumber(wos.length)}</strong></div>
  <div class="wo-stat"><span>Son Sipariş</span><strong>${fmtDate(c.lastOrder)}</strong></div>
</div>

<div class="card" style="margin-bottom:1.25rem;">
  <div class="card-head" style="padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">Şirket Profili</div>
  </div>
  <div class="card-body">
    <div class="wo-spec-grid" style="margin-top:0;padding-top:0;border-top:0;grid-template-columns:repeat(4,minmax(0,1fr));">
      <div><div class="form-label">Yetkili</div><div class="wo-spec-value">${esc(c.contact)}</div></div>
      <div><div class="form-label">E-posta</div><div class="wo-spec-value">${esc(c.email)}</div></div>
      <div><div class="form-label">Telefon</div><div class="wo-spec-value">${esc(c.phone)}</div></div>
      <div><div class="form-label">Ülke / Şehir</div><div class="wo-spec-value">${esc(c.address)}</div></div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom:1.25rem;">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">Siparişlerim</div>
    <span style="font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted);">Salt okunur görünüm</span>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Sipariş</th><th>Model</th><th>Renk / Beden</th><th style="text-align:right;">Adet</th><th>Termin</th><th>Aşama</th><th style="width:160px;">İlerleme</th></tr></thead>
      <tbody>
        ${orders.map(o => `<tr>
          <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-gold-champagne);">${esc(o.id)}</td>
          <td>${esc(o.model)}</td>
          <td style="color:var(--color-text-secondary);font-size:0.8rem;">${esc(o.color)} / ${esc(o.size)}</td>
          <td class="num" style="text-align:right;">${fmtNumber(o.qty)}</td>
          <td style="font-size:0.8rem;">${fmtDate(o.deadline)}</td>
          <td><span class="badge ${o.status === "Completed" ? "badge-completed" : "badge-production"}">${STATUS_LABEL[o.status] || o.status}</span></td>
          <td>
            <div class="mini-progress">
              <div class="progress-bar"><div class="progress-fill" style="width:${progress(o.status)}%;"></div></div>
              <span>${progress(o.status)}%</span>
            </div>
          </td>
        </tr>`).join("") || `<tr><td colspan="7" style="padding:1.5rem;text-align:center;color:var(--color-text-muted);">Sipariş bulunmuyor</td></tr>`}
      </tbody>
    </table>
  </div>
</div>

<div class="card">
  <div class="card-head" style="padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">Üretim Şeffaflığı — İş Emirleri</div>
  </div>
  <div class="card-body">
    ${wos.map(w => `
      <div style="padding:0.85rem 0;border-bottom:1px solid var(--color-border);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:0.5rem;">
          <div style="min-width:0;">
            <div class="row-main">${esc(w.modelName || w.model)}</div>
            <div class="row-sub">${esc(w.id)} · ${esc(w.season)} · ${esc(w.gauge)}</div>
          </div>
          <span class="badge ${w.status === "Açık" ? "badge-production" : "badge-completed"}">${esc(w.status)}</span>
        </div>
        <div class="mini-progress">
          <div class="progress-bar"><div class="progress-fill" style="width:${w.status === "Açık" ? 55 : 100}%;"></div></div>
          <span>${w.status === "Açık" ? 55 : 100}%</span>
        </div>
      </div>
    `).join("") || `<div style="padding:1rem;text-align:center;color:var(--color-text-muted);font-size:0.85rem;">Bu hesap için iş emri bulunmuyor</div>`}
  </div>
</div>
`;
  }

  function mount() {}

  window.VIEWS["b2b-detail"] = { render, mount };
})();
