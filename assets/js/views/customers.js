/* =========================================================================
   ZERYTHA OS — Customers (Müşteri Yönetimi)
   B2B wholesale customer management
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtMoney, fmtNumber, toast, $, $$, navigate } = window.APP;

  function render() {
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Müşteriler</h1>
    <p class="page-subtitle">B2B müşteri kartları, iletişim, sipariş ve fatura takibi</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary btn-sm" onclick="APP_CUST.newCustomer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Yeni Müşteri</button>
  </div>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:20%;">Şirket / Marka</th>
            <th style="width:16%;">Yetkili Kişi</th>
            <th style="width:18%;">E-posta</th>
            <th style="width:14%;">Telefon</th>
            <th style="width:12%;">Şehir</th>
            <th style="width:8%;">Sipariş</th>
            <th style="width:12%;">Son Sipariş</th>
            <th style="width:10%;">Durum</th>
          </tr>
        </thead>
        <tbody>
          ${STATE.customers.map(c => `
          <tr onclick="window.APP.navigate('/customer-detail?id=${c.id}')" style="cursor:pointer;">
            <td style="font-weight:600;color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.company}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${c.contact}</td>
            <td style="color:var(--color-text-secondary);font-size:0.8125rem;">${c.email}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${c.phone}</td>
            <td style="color:var(--color-text-secondary);font-size:0.8125rem;">${c.address}</td>
            <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${c.orders}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${fmtDate(c.lastOrder)}</td>
            <td><span class="badge badge-quality">${c.status}</span></td>
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
    window.APP_CUST = {
      newCustomer() {
        window.APP.openFormModal({
          title: "Yeni Müşteri",
          submitLabel: "Müşteriyi Kaydet",
          fields: [
            { name: "company", label: "Şirket / Marka", required: true, placeholder: "Ör. Aurélie Paris" },
            { name: "contact", label: "Yetkili Kişi", required: true, placeholder: "Ad Soyad" },
            { name: "email", label: "E-posta", type: "email", required: true, placeholder: "ad@marka.com" },
            { name: "phone", label: "Telefon", required: true, placeholder: "+90 ..." },
            { name: "address", label: "Şehir / Ülke", required: true, placeholder: "Milano, İtalya", full: true }
          ],
          onSubmit(data) {
            const next = STATE.customers.length + 1;
            const id = "C-" + String(next).padStart(3, "0");
            const customer = {
              id,
              company: data.company,
              contact: data.contact,
              email: data.email,
              phone: data.phone,
              address: data.address,
              orders: 0,
              lastOrder: new Date().toISOString().split("T")[0],
              status: "Aktif"
            };
            STATE.customers.push(customer);
            if (window.WORK_DATA) {
              window.WORK_DATA.customers.push({
                id: id.replace("C-", "cust-"),
                name: customer.company,
                code: customer.company.split(" ")[0].slice(0, 3).toUpperCase()
              });
            }
            toast("Müşteri eklendi: " + customer.company);
            window.APP.refresh();
          }
        });
      }
    };
  }

  window.VIEWS.customers = { render, mount };
})();
