/* =========================================================================
   ZERYTHA OS — B2B Customer Portal (B2B Müşteri Portalı)
   Her marka müşterisi sadece kendi bilgilerine erişir.
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtMoney, fmtNumber, toast, $, $$, navigate } = window.APP;

  function render() {
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">B2B Müşteri Portalı</h1>
    <p class="page-subtitle">Marka müşterilerine özel özel müşteri deneyimi — her müşteri sadece kendi bilgilerine erişir</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('/customers')">Müşteri Kartları</button>
    <button class="btn btn-primary btn-sm" onclick="window.APP.navigate('/customers')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Yeni Müşteri Hesabı</button>
  </div>
</div>

<div class="kpi-grid" style="margin-bottom:1.5rem;">
  <div class="kpi-card top-gold">
    <div class="kpi-label">Toplam B2B Müşteri</div>
    <div class="kpi-value text-numeric">${STATE.customers.length}</div>
    <div class="kpi-delta pos">Aktif hesap</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Toplam Sipariş</div>
    <div class="kpi-value text-numeric">${STATE.customers.reduce((a,b)=>a+b.orders,0)}</div>
    <div class="kpi-delta pos">Tüm hesaplar</div>
  </div>
  <div class="kpi-card top-red">
    <div class="kpi-label">Bekleyen Teklif</div>
    <div class="kpi-value text-numeric">2</div>
    <div class="kpi-delta neg">Onay bekliyor</div>
  </div>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:20%;">Şirket / Marka</th>
            <th style="width:14%;">Yetkili</th>
            <th style="width:14%;">E-posta</th>
            <th style="width:10%;">Şehir</th>
            <th style="width:10%;">Sipariş Sayısı</th>
            <th style="width:12%;">Son Sipariş</th>
            <th style="width:10%;">Portal Erişimi</th>
            <th style="width:10%;">İşlem</th>
          </tr>
        </thead>
        <tbody>
          ${STATE.customers.map(c => `
          <tr style="cursor:pointer;" onclick="window.APP.navigate('/b2b-detail?id=${c.id}')">
            <td style="font-weight:600;color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.company}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${c.contact}</td>
            <td style="color:var(--color-text-secondary);font-size:0.8125rem;">${c.email}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${c.address}</td>
            <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${c.orders}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${fmtDate(c.lastOrder)}</td>
            <td><span class="badge badge-quality">Erişilebilir</span></td>
            <td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();window.APP.navigate('/b2b-detail?id=${encodeURIComponent(c.id)}')">Portalı Aç</button></td>
          </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>
</div>

<div class="card" style="margin-top:1.5rem;">
  <div class="card-body">
    <div class="section-title">Portal Özellikleri</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:1rem;">
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Şirket Profili</div>
        <div style="color:var(--color-text-main);font-size:0.8125rem;">Marka müşterisi kendi şirket profilini görüntüler ve düzenler.</div>
      </div>
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Teklifler &amp; Siparişler</div>
        <div style="color:var(--color-text-main);font-size:0.8125rem;">Teklif talebi oluşturma ve sipariş geçmişine erişim.</div>
      </div>
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Teknik Specifikasyon</div>
        <div style="color:var(--color-text-main);font-size:0.8125rem;">Ürün teknik specifikasyon sayfaları ve örnek onayları.</div>
      </div>
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Faturalar &amp; Ödeme</div>
        <div style="color:var(--color-text-main);font-size:0.8125rem;">Fatura takibi ve ödeme durumu görüntüleme.</div>
      </div>
    </div>
  </div>
</div>
`;
  }

  function mount() {}

  window.VIEWS.b2b = { render, mount };
})();
