/* =========================================================================
   ZERYTHA OS — Subcontractors (Alt Müşavir / İş Atölyeleri)
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtMoney, fmtNumber, toast, $, $$, navigate } = window.APP;

  function render() {
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Alt Müşavirler</h1>
    <p class="page-subtitle">Örme, dikiş, yıkama, bitim ve paketleme atölye takibi</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary btn-sm" onclick="APP_SC.newWorkshop()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Yeni Atölye</button>
  </div>
</div>

<div class="kpi-grid" style="margin-bottom:1.5rem;">
  <div class="kpi-card top-gold">
    <div class="kpi-label">Toplam Atölye</div>
    <div class="kpi-value text-numeric">${STATE.subcontractors.length}</div>
    <div class="kpi-delta pos">Aktif</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Ortalama Performans</div>
    <div class="kpi-value text-numeric">${Math.round(STATE.subcontractors.reduce((a,b)=>a+b.performance,0)/STATE.subcontractors.length)}%</div>
    <div class="kpi-delta pos">Güvenilir</div>
  </div>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:20%;">Atölye / İş Hattı</th>
            <th style="width:18%;">Uzmanlık Alanı</th>
            <th style="width:16%;">Yetkili Kişi</th>
            <th style="width:14%;">Şehir</th>
            <th style="width:12%;">Performans</th>
            <th style="width:10%;">Durum</th>
          </tr>
        </thead>
        <tbody>
          ${STATE.subcontractors.map(s => `
          <tr>
            <td style="font-weight:600;color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.name}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;text-transform:uppercase;letter-spacing:0.04em;font-size:0.7rem;">${s.specialty}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${s.contact}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${s.city}</td>
            <td>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <div class="progress-bar" style="width:80px;"><div class="progress-fill" style="width:${s.performance}%;"></div></div>
                <span style="font-family:var(--font-numeric);font-weight:600;font-size:0.8125rem;color:var(--color-text-main);">${s.performance}%</span>
              </div>
            </td>
            <td><span class="badge ${s.active?'badge-quality':'badge-delayed'}">${s.active?'Aktif':'Pasif'}</span></td>
          </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>
</div>
`;
  }

  function mount() {
    window.APP_SC = {
      newWorkshop() {
        window.APP.openFormModal({
          title: "Yeni Atölye",
          submitLabel: "Atölyeyi Kaydet",
          fields: [
            { name: "name", label: "Atölye / İş Hattı", required: true, placeholder: "Ör. Atölye D" },
            { name: "specialty", label: "Uzmanlık", type: "select", required: true, options: ["Örme", "Dikiş / Linking", "Yıkama", "Ütü", "Bitim", "Paketleme"] },
            { name: "contact", label: "Yetkili Kişi", required: true, placeholder: "Ad Soyad" },
            { name: "city", label: "Şehir", required: true, placeholder: "Bursa" },
            { name: "performance", label: "Performans (%)", type: "number", min: 0, max: 100, value: 90 }
          ],
          onSubmit(data) {
            const next = STATE.subcontractors.length + 1;
            const workshop = {
              id: "SC-" + String(next).padStart(3, "0"),
              name: data.name,
              specialty: data.specialty,
              contact: data.contact,
              city: data.city,
              performance: Math.max(0, Math.min(100, Number(data.performance) || 0)),
              active: true
            };
            STATE.subcontractors.push(workshop);
            toast("Atölye eklendi: " + workshop.name);
            window.APP.refresh();
          }
        });
      }
    };
  }

  window.VIEWS.subcontractors = { render, mount };
})();
