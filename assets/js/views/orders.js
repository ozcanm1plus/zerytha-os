/* =========================================================================
   ZERYTHA OS — Orders View
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtMoney, fmtNumber, pct, toast, $, $$ } = window.APP;

  const STATUS_COLORS = {
    Quotation: "badge-quotation",
    "Awaiting Approval": "badge-approval",
    "Material Planning": "badge-planning",
    Production: "badge-production",
    "Quality Control": "badge-quality",
    Packaging: "badge-packaging",
    "Ready to Ship": "badge-ship",
    Completed: "badge-completed"
  };

  const PAYMENT_COLORS = {
    Paid: "badge-quality",
    Partial: "badge-approval",
    Pending: "badge-delayed"
  };

  function statusBadge(status) {
    const cls = STATUS_COLORS[status] || "badge-quotation";
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function paymentBadge(p) {
    const cls = PAYMENT_COLORS[p] || "badge-quotation";
    return `<span class="badge ${cls}">${p}</span>`;
  }

  function filterOrders(orders, q, statusFilter) {
    return orders.filter(o => {
      const matchQ = !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.model.toLowerCase().includes(q);
      const matchS = !statusFilter || o.status === statusFilter;
      return matchQ && matchS;
    });
  }

  function renderTable(orders) {
    return `
<table>
  <thead>
    <tr>
      <th style="width:14%;">Sipariş No</th>
      <th style="width:16%;">Müşteri / Marka</th>
      <th style="width:18%;">Model</th>
      <th style="width:8%;">Adet</th>
      <th style="width:10%;">Renk / Beden</th>
      <th style="width:10%;">Sipariş Tarihi</th>
      <th style="width:10%;">Teslim Tarihi</th>
      <th style="width:10%;">Değer</th>
      <th style="width:9%;">Ödeme</th>
      <th style="width:13%;">Durum</th>
    </tr>
  </thead>
  <tbody>
    ${orders.map(o => `
    <tr data-id="${o.id}">
      <td>
        <div style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${o.id}</div>
      </td>
      <td>
        <div style="font-weight:600;color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.customer}</div>
      </td>
      <td style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.model}</td>
      <td style="font-family:var(--font-numeric);">${fmtNumber(o.qty)}</td>
      <td>
        <div style="font-size:0.8125rem;color:var(--color-text-secondary);">${o.color}</div>
        <div style="font-size:0.75rem;color:var(--color-text-muted);">${o.size}</div>
      </td>
      <td>${fmtDate(o.date)}</td>
      <td style="font-weight:600;color:${new Date(o.deadline) < new Date() ? 'var(--color-error)' : 'var(--color-text-main)'};">${fmtDate(o.deadline)}</td>
      <td style="font-family:var(--font-numeric);font-weight:600;">${fmtMoney(o.value)}</td>
      <td>${paymentBadge(o.payment)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>
    `).join("")}
  </tbody>
</table>`;
  }

  function render() {
    const q = ""; // search state
    const filtered = filterOrders(STATE.orders, q, null);

    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Sipariş Yönetimi</h1>
    <p class="page-subtitle">Tüm siparişlerin durumu, değeri ve teslim takibi</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" id="order-filter-reset" title="Filtreleri sıfırla" aria-label="Filtreleri sıfırla">Sıfırla</button>
    <button class="btn btn-primary btn-sm" onclick="APP_ORDERS.newOrder()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Yeni Sipariş</button>
  </div>
</div>

<!-- Filters -->
<div class="card" style="margin-bottom:1.5rem;">
  <div class="card-body" style="padding:1rem 1.5rem;">
    <div class="form-row" style="grid-template-columns: 220px 220px 160px auto;">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Arama</label>
        <input type="text" id="order-search" class="form-input" placeholder="Sipariş no, müşteri, model...">
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Durum</label>
        <select class="form-select" id="order-status">
          <option value="">Tüm durumlar</option>
          <option value="Quotation">Teklif</option>
          <option value="Awaiting Approval">Onay Bekliyor</option>
          <option value="Material Planning">Malzeme Planlama</option>
          <option value="Production">Üretimde</option>
          <option value="Quality Control">Kalite Kontrol</option>
          <option value="Packaging">Paketleme</option>
          <option value="Ready to Ship">Teslim Hazır</option>
          <option value="Completed">Tamamlandı</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0;display:flex;align-items:end;">
        <button class="btn btn-secondary" id="order-filter-apply">Uygula</button>
      </div>
    </div>
  </div>
</div>

<!-- Orders table -->
<div class="card">
  <div class="card-header">
    <div>
      <div class="card-title">Sipariş Listesi</div>
      <div class="card-subtitle">${filtered.length} kayıt</div>
    </div>
  </div>
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">${renderTable(filtered)}</div>
  </div>
</div>
`;
  }

  function mount() {
    const searchInput = $("#order-search");
    const statusSelect = $("#order-status");
    const applyBtn = $("#order-filter-apply");
    const resetBtn = $("#order-filter-reset");

    function apply() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : "";
      const s = statusSelect ? statusSelect.value : "";
      const filtered = filterOrders(STATE.orders, q, s);
      const table = renderTable(filtered);
      const wrap = $(".table-wrap");
      if (wrap) wrap.innerHTML = table;
      const subtitle = $(".card-subtitle");
      if (subtitle) subtitle.textContent = `${filtered.length} kayıt`;
      // re-bind row clicks
      bindRows();
    }

    if (searchInput) searchInput.addEventListener("input", apply);
    if (statusSelect) statusSelect.addEventListener("change", apply);
    if (applyBtn) applyBtn.addEventListener("click", apply);
    if (resetBtn) resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (statusSelect) statusSelect.value = "";
      apply();
    });

    window.APP_ORDERS = {
      newOrder() {
        const today = new Date().toISOString().split("T")[0];
        const plus14 = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
        window.APP.openFormModal({
          title: "Yeni Sipariş",
          submitLabel: "Siparişi Oluştur",
          fields: [
            { name: "customer", label: "Müşteri / Marka", type: "select", required: true, full: true,
              options: STATE.customers.map(c => ({ value: c.company, label: c.company + " (" + c.id + ")" })) },
            { name: "model", label: "Model", required: true, placeholder: "Ör. MK-9021 Cashmere Polo" },
            { name: "qty", label: "Adet", type: "number", min: 1, required: true, value: 100 },
            { name: "color", label: "Renk", required: true, placeholder: "Ivory" },
            { name: "size", label: "Beden Aralığı", required: true, placeholder: "S–XL" },
            { name: "date", label: "Sipariş Tarihi", type: "date", required: true, value: today },
            { name: "deadline", label: "Teslim Tarihi", type: "date", required: true, value: plus14 },
            { name: "value", label: "Sipariş Değeri (TRY)", type: "number", min: 0, required: true, value: 50000 },
            { name: "payment", label: "Ödeme", type: "select", required: true, options: [
              { value: "Pending", label: "Ödeme Bekliyor" },
              { value: "Partial", label: "Kısmi Ödendi" },
              { value: "Paid", label: "Ödendi" }
            ]},
            { name: "status", label: "Durum", type: "select", required: true, options: [
              { value: "Quotation", label: "Teklif" },
              { value: "Awaiting Approval", label: "Onay Bekliyor" },
              { value: "Material Planning", label: "Malzeme Planlama" },
              { value: "Production", label: "Üretimde" },
              { value: "Quality Control", label: "Kalite Kontrol" },
              { value: "Packaging", label: "Paketleme" },
              { value: "Ready to Ship", label: "Teslim Hazır" },
              { value: "Completed", label: "Tamamlandı" }
            ]}
          ],
          onSubmit(data) {
            const maxNo = STATE.orders.reduce((m, o) => {
              const n = parseInt(String(o.id).split("-")[2], 10);
              return isNaN(n) ? m : Math.max(m, n);
            }, 0);
            const order = {
              id: "ZR-2026-" + String(maxNo + 1).padStart(4, "0"),
              customer: data.customer,
              model: data.model,
              qty: Math.max(1, Number(data.qty) || 1),
              color: data.color,
              size: data.size,
              date: data.date,
              deadline: data.deadline,
              value: Math.max(0, Number(data.value) || 0),
              status: data.status,
              payment: data.payment,
              image: null
            };
            STATE.orders.unshift(order);

            const customer = STATE.customers.find(c => c.company === data.customer);
            if (customer) {
              customer.orders += 1;
              customer.lastOrder = data.date;
            }

            // Siparişi iş emri akışına da bağla
            if (window.WORK_DATA) {
              const D = window.WORK_DATA;
              const maxWo = D.workOrders.reduce((m, w) => {
                const n = parseInt(String(w.id).split("-")[2], 10);
                return isNaN(n) ? m : Math.max(m, n);
              }, 1000);
              D.workOrders.unshift({
                id: "WO-2026-" + (maxWo + 1),
                custId: customer ? customer.id.replace("C-", "cust-") : "cust-001",
                season: "2026 Sonbahar",
                model: data.model.split(" ")[0].toUpperCase(),
                modelName: data.model,
                yarnId: D.yarnTypes && D.yarnTypes.length ? D.yarnTypes[0].id : "manual",
                yarnManual: D.yarnTypes && D.yarnTypes.length ? "" : "Elle girildi",
                gauge: "12 GG",
                qty: order.qty,
                deadline: order.deadline,
                image: null,
                status: order.status === "Completed" ? "Tamamlandı" : "Açık",
                created: order.date,
                pieces: [],
                yarnUsage: []
              });
            }

            toast("Sipariş oluşturuldu: " + order.id);
            window.APP.refresh();
          }
        });
      }
    };

    bindRows();
  }

  function bindRows() {
    $$("tr[data-id]").forEach(row => {
      row.style.cursor = "pointer";
      row.onclick = (e) => {
        if (e.target.tagName === "BUTTON") return;
        const id = row.getAttribute("data-id");
        window.APP.navigate("/order-detail?id=" + id);
      };
    });
  }

  window.VIEWS.orders = { render, mount };
})();
