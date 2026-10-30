/* =========================================================================
   ZERYTHA OS — Suppliers (Tedarikçi Yönetimi)
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtMoney, fmtNumber, toast, $, $$, navigate } = window.APP;

  function render() {
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Tedarikçiler</h1>
    <p class="page-subtitle">İplik, yün ve kimyasal malzeme tedarikçi kartları</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary btn-sm" onclick="APP_SUP.newSupplier()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Yeni Tedarikçi</button>
  </div>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:22%;">Tedarikçi</th>
            <th style="width:16%;">Yetkili</th>
            <th style="width:18%;">E-posta</th>
            <th style="width:12%;">Şehir</th>
            <th style="width:14%;">Kategori</th>
            <th style="width:10%;">Değerlendirme</th>
            <th style="width:8%;">Durum</th>
          </tr>
        </thead>
        <tbody>
          ${STATE.suppliers.map(s => `
          <tr>
            <td style="font-weight:600;color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.name}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${s.contact}</td>
            <td style="color:var(--color-text-secondary);font-size:0.8125rem;">${s.email}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${s.city}</td>
            <td style="color:var(--color-text-secondary);font-size:0.8125rem;text-transform:uppercase;letter-spacing:0.04em;font-size:0.7rem;">${s.category}</td>
            <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${s.rating}</td>
            <td><span class="badge badge-quality">Aktif</span></td>
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
    window.APP_SUP = {
      newSupplier() {
        window.APP.openFormModal({
          title: "Yeni Tedarikçi",
          submitLabel: "Tedarikçiyi Kaydet",
          fields: [
            { name: "name", label: "Tedarikçi Adı", required: true, placeholder: "Ör. Ege İplik" },
            { name: "contact", label: "Yetkili Kişi", required: true, placeholder: "Ad Soyad" },
            { name: "email", label: "E-posta", type: "email", required: true, placeholder: "ad@firma.com" },
            { name: "city", label: "Şehir", required: true, placeholder: "Bursa" },
            { name: "category", label: "Kategori", type: "select", required: true, options: ["İplik", "Yün", "Kimyasal", "Aksesuar", "Ambalaj"] },
            { name: "rating", label: "Değerlendirme (0–5)", type: "number", min: 0, max: 5, step: 0.1, value: 4.5 }
          ],
          onSubmit(data) {
            const next = STATE.suppliers.length + 1;
            const supplier = {
              id: "S-" + String(next).padStart(3, "0"),
              name: data.name,
              contact: data.contact,
              email: data.email,
              city: data.city,
              category: data.category,
              rating: Math.max(0, Math.min(5, Number(data.rating) || 0))
            };
            STATE.suppliers.push(supplier);
            toast("Tedarikçi eklendi: " + supplier.name);
            window.APP.refresh();
          }
        });
      }
    };
  }

  window.VIEWS.suppliers = { render, mount };
})();
