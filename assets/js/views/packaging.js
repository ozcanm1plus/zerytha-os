/* =========================================================================
   ZERYTHA OS — Packaging & Shipping (Paketleme & Kargo)
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtNumber, toast, $, $$, navigate } = window.APP;

  const shipments = [
    { id: "SH-2026-001", order: "ZR-2026-0145", customer: "Hermès", model: "H-7703 Cashmere Crew", qty: 95, status: "Shipped", carrier: "DHL Express", tracking: "DHL123456789", date: "2026-10-25", delivery: "2026-10-28" },
    { id: "SH-2026-002", order: "ZR-2026-0146", customer: "Zegna", model: "ZE-6605 Wool Blend", qty: 260, status: "Packed", carrier: "UPS", tracking: "1Z999AA10123456784", date: "2026-10-26", delivery: "2026-10-30" },
    { id: "SH-2026-003", order: "ZR-2026-0142", customer: "Armani Knitwear", model: "MK-9021 Cashmere Polo", qty: 350, status: "Pending", carrier: "FedEx", tracking: "—", date: "2026-10-28", delivery: "2026-11-05" },
    { id: "SH-2026-004", order: "ZR-2026-0143", customer: "Loro Piana", model: "LP-4401 Merino Cardigan", qty: 210, status: "Prepared", carrier: "TNT", tracking: "—", date: "2026-10-27", delivery: "2026-10-30" }
  ];

  function statusBadge(s) {
    const cls = s === "Shipped" ? "badge-quality" : s === "Packed" ? "badge-approval" : s === "Prepared" ? "badge-planning" : "badge-delayed";
    return `<span class="badge ${cls}">${s}</span>`;
  }

  function render() {
    const pending = shipments.filter(s=>s.status!=="Shipped").length;
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Paketleme &amp; Kargo</h1>
    <p class="page-subtitle">Hazırlanan gönderiler, kargo takibi ve teslim durumu</p>
  </div>
  <div class="page-actions">
    <span class="badge ${pending>0?'badge-delayed':'badge-quality'}" style="font-size:0.75rem;padding:0.35rem 0.8rem;">${pending} Bekleyen Gönderi</span>
    <button class="btn btn-primary btn-sm" onclick="APP_SHP.newShipment()">Yeni Gönderi</button>
  </div>
</div>

<div class="kpi-grid" style="margin-bottom:1.5rem;">
  <div class="kpi-card top-gold">
    <div class="kpi-label">Toplam Gönderi</div>
    <div class="kpi-value text-numeric">${shipments.length}</div>
    <div class="kpi-delta pos">Bu ay</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Teslim Edilen</div>
    <div class="kpi-value text-numeric">${shipments.filter(s=>s.status==="Shipped").length}</div>
    <div class="kpi-delta pos">Gönderildi</div>
  </div>
  <div class="kpi-card top-red">
    <div class="kpi-label">Bekleyen</div>
    <div class="kpi-value text-numeric">${pending}</div>
    <div class="kpi-delta neg">Paketleme / Kargoda</div>
  </div>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:13%;">Gönderi No</th>
            <th style="width:14%;">Sipariş</th>
            <th style="width:16%;">Müşteri</th>
            <th style="width:16%;">Model</th>
            <th style="width:8%;">Adet</th>
            <th style="width:10%;">Kargo Firma</th>
            <th style="width:12%;">Takip No</th>
            <th style="width:11%;">Teslim Tarihi</th>
          </tr>
        </thead>
        <tbody>
          ${shipments.map(s => `
          <tr style="cursor:pointer;" onclick="window.APP.navigate('/order-detail?id=${encodeURIComponent(s.order)}')">
            <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${s.id}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.order}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${s.customer}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.model}</td>
            <td style="font-family:var(--font-numeric);">${fmtNumber(s.qty)}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${s.carrier}</td>
            <td style="color:var(--color-text-secondary);font-family:var(--font-numeric);font-size:0.8125rem;">${s.tracking}</td>
            <td style="color:var(--color-text-main);font-weight:600;font-size:0.8125rem;">${fmtDate(s.delivery)}</td>
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
    window.APP_SHP = {
      newShipment() {
        window.APP.openFormModal({
          title: "Yeni Gönderi",
          submitLabel: "Gönderiyi Kaydet",
          fields: [
            { name: "order", label: "Sipariş", type: "select", required: true, full: true,
              options: STATE.orders.map(o => ({ value: o.id, label: o.id + " — " + o.customer + " / " + o.model })) },
            { name: "carrier", label: "Kargo Firması", type: "select", required: true, options: ["DHL Express", "UPS", "FedEx", "TNT", "Aras Kargo"] },
            { name: "tracking", label: "Takip No", placeholder: "Opsiyonel" },
            { name: "delivery", label: "Teslim Tarihi", type: "date", required: true, value: new Date().toISOString().split("T")[0] }
          ],
          onSubmit(data) {
            const order = STATE.orders.find(o => o.id === data.order);
            if (!order) { toast("Sipariş bulunamadı."); return false; }
            const next = shipments.length + 1;
            shipments.push({
              id: "SH-2026-" + String(next).padStart(3, "0"),
              order: order.id,
              customer: order.customer,
              model: order.model,
              qty: order.qty,
              status: "Prepared",
              carrier: data.carrier,
              tracking: data.tracking || "—",
              date: new Date().toISOString().split("T")[0],
              delivery: data.delivery
            });
            toast("Gönderi oluşturuldu: " + order.id);
            window.APP.refresh();
          }
        });
      }
    };
  }

  window.VIEWS.packaging = { render, mount };
})();
