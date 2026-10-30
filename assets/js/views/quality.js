/* =========================================================================
   ZERYTHA OS — Quality Control (Kalite Kontrol)
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtNumber, toast, $, $$, navigate } = window.APP;

  const qualityItems = [
    { id: "QC-001", order: "ZR-2026-0143", model: "LP-4401 Merino Cardigan", customer: "Loro Piana", qty: 210, checked: 185, status: "Bekliyor", result: "-", date: "2026-10-24" },
    { id: "QC-002", order: "ZR-2026-0146", model: "ZE-6605 Wool Blend", customer: "Zegna", qty: 260, checked: 260, status: "Onaylandı", result: "Geçti", date: "2026-10-20" },
    { id: "QC-003", order: "ZR-2026-0142", model: "MK-9021 Cashmere Polo", customer: "Armani Knitwear", qty: 350, checked: 0, status: "Bekliyor", result: "-", date: "2026-10-28" },
    { id: "QC-004", order: "ZR-2026-0145", model: "H-7703 Cashmere Crew", customer: "Hermès", qty: 95, checked: 95, status: "Onaylandı", result: "Geçti", date: "2026-10-15" },
    { id: "QC-005", order: "ZR-2026-0147", model: "MM-5508 Alpaca Cardigan", customer: "Max Mara", qty: 320, checked: 120, status: "Revizyon", result: "Değişiklik İste", date: "2026-10-26" }
  ];

  function render() {
    const pending = qualityItems.filter(q=>q.status==="Bekliyor").length;
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Kalite Kontrol</h1>
    <p class="page-subtitle">Üretim aşamalarındaki kalite incelemeleri ve onay akışı</p>
  </div>
  <div class="page-actions">
    <span class="badge ${pending>0?'badge-delayed':'badge-quality'}" style="font-size:0.75rem;padding:0.35rem 0.8rem;">${pending} Bekleyen Onay</span>
    <button class="btn btn-primary btn-sm" onclick="APP_QC.newInspection()">Yeni İnceleme</button>
  </div>
</div>

<div class="kpi-grid" style="margin-bottom:1.5rem;">
  <div class="kpi-card top-gold">
    <div class="kpi-label">Toplam İnceleme</div>
    <div class="kpi-value text-numeric">${qualityItems.length}</div>
    <div class="kpi-delta pos">Bu ay</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Onaylanan</div>
    <div class="kpi-value text-numeric">${qualityItems.filter(q=>q.status==="Onaylandı").length}</div>
    <div class="kpi-delta pos">%${Math.round(qualityItems.filter(q=>q.status==="Onaylandı").length/qualityItems.length*100)}</div>
  </div>
  <div class="kpi-card top-red">
    <div class="kpi-label">Bekleyen</div>
    <div class="kpi-value text-numeric">${pending}</div>
    <div class="kpi-delta neg">Müşteri onayı</div>
  </div>
</div>

<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:12%;">Kontrol No</th>
            <th style="width:16%;">Sipariş</th>
            <th style="width:18%;">Model</th>
            <th style="width:14%;">Müşteri</th>
            <th style="width:10%;">Miktar</th>
            <th style="width:10%;">Kontrol Edilen</th>
            <th style="width:10%;">Sonuç</th>
            <th style="width:10%;">Tarih</th>
          </tr>
        </thead>
        <tbody>
          ${qualityItems.map(q => `
          <tr style="cursor:pointer;" onclick="window.APP.navigate('/order-detail?id=${encodeURIComponent(q.order)}')">
            <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${q.id}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${q.order}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${q.model}</td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${q.customer}</td>
            <td style="font-family:var(--font-numeric);">${fmtNumber(q.qty)}</td>
            <td style="font-family:var(--font-numeric);">${fmtNumber(q.checked)}</td>
            <td><span class="badge ${q.status==='Onaylandı'?'badge-quality':q.status==='Bekliyor'?'badge-approval':'badge-delayed'}">${q.status}</span></td>
            <td style="color:var(--color-text-main);font-size:0.8125rem;">${fmtDate(q.date)}</td>
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
    window.APP_QC = {
      newInspection() {
        window.APP.openFormModal({
          title: "Yeni Kalite İncelemesi",
          submitLabel: "İncelemeyi Kaydet",
          fields: [
            { name: "order", label: "Sipariş", type: "select", required: true, full: true,
              options: STATE.orders.map(o => ({ value: o.id, label: o.id + " — " + o.customer + " / " + o.model })) },
            { name: "checked", label: "Kontrol Edilen Adet", type: "number", min: 0, value: 0 },
            { name: "status", label: "Sonuç", type: "select", required: true, options: ["Bekliyor", "Onaylandı", "Revizyon"] },
            { name: "date", label: "İnceleme Tarihi", type: "date", required: true, value: new Date().toISOString().split("T")[0] }
          ],
          onSubmit(data) {
            const order = STATE.orders.find(o => o.id === data.order);
            if (!order) { toast("Sipariş bulunamadı."); return false; }
            const next = qualityItems.length + 1;
            qualityItems.push({
              id: "QC-" + String(next).padStart(3, "0"),
              order: order.id,
              model: order.model,
              customer: order.customer,
              qty: order.qty,
              checked: Math.max(0, Math.min(order.qty, Number(data.checked) || 0)),
              status: data.status,
              result: data.status === "Onaylandı" ? "Geçti" : data.status === "Revizyon" ? "Değişiklik İste" : "-",
              date: data.date
            });
            toast("Kalite incelemesi oluşturuldu: " + order.id);
            window.APP.refresh();
          }
        });
      }
    };
  }

  window.VIEWS.quality = { render, mount };
})();
