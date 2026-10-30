/* =========================================================================
   ZERYTHA OS — Order Detail View
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

  function statusBadge(status) {
    const cls = STATUS_COLORS[status] || "badge-quotation";
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function render(fullPath) {
    const q = window.APP.getQuery();
    const order = STATE.orders.find(o => o.id === q.id) || STATE.orders[0];

    return `
<div class="page-header">
  <div>
    <button class="btn btn-ghost btn-icon" onclick="window.APP.navigate('/orders')" aria-label="Geri dön">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    </button>
    <h1 class="page-title text-brand">Sipariş Detayı</h1>
    <p class="page-subtitle">${order.id} — ${order.customer}</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="APP_ORDER.printOrder()">Yazdır / PDF</button>
    <button class="btn btn-primary btn-sm" onclick="APP_ORDER.editOrder()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Düzenle</button>
  </div>
</div>

<!-- Order header info -->
<div class="card" style="margin-bottom:1.5rem;">
  <div class="card-body">
    <div style="display:grid;grid-template-columns: 1fr 1fr; gap:1.5rem;">
      <div>
        <div class="form-label">Sipariş No</div>
        <div style="font-family:var(--font-numeric);font-weight:600;font-size:1.125rem;color:var(--color-text-main);">${order.id}</div>
      </div>
      <div>
        <div class="form-label">Müşteri / Marka</div>
        <div style="font-weight:600;color:var(--color-text-main);">${order.customer}</div>
      </div>
      <div>
        <div class="form-label">Model</div>
        <div style="color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${order.model}</div>
      </div>
      <div>
        <div class="form-label">Renk / Beden</div>
        <div style="color:var(--color-text-main);">${order.color} / ${order.size}</div>
      </div>
    </div>
    <div style="margin-top:1.25rem;border-top:1px solid var(--color-border);padding-top:1rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;text-align:center;">
      <div>
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Miktar</div>
        <div style="font-family:var(--font-numeric);font-weight:600;font-size:1.25rem;color:var(--color-text-main);">${fmtNumber(order.qty)}</div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Sipariş Tarihi</div>
        <div style="font-weight:600;color:var(--color-text-main);">${fmtDate(order.date)}</div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Teslim Tarihi</div>
        <div style="font-weight:600;color:${new Date(order.deadline)<new Date()?'var(--color-error)':'var(--color-text-main)'};">${fmtDate(order.deadline)}</div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Sipariş Değeri</div>
        <div style="font-family:var(--font-numeric);font-weight:600;font-size:1.25rem;color:var(--color-text-main);">${fmtMoney(order.value)}</div>
      </div>
    </div>
  </div>
</div>

<!-- Status row -->
<div style="display:grid;grid-template-columns: 1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
  <div class="card">
    <div class="card-body">
      <div class="form-label">Ödeme Durumu</div>
      <div style="font-weight:600;color:var(--color-text-main);">${order.payment}</div>
      ${paymentBadge(order.payment)}
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <div class="form-label">Üretim Durumu</div>
      <div style="font-weight:600;color:var(--color-text-main);">${order.status}</div>
      ${statusBadge(order.status)}
    </div>
  </div>
</div>

<!-- Timeline -->
<div class="card" style="margin-bottom:1.5rem;">
  <div class="card-body">
    <div class="section-title">İşlem Geçmişi</div>
    <div style="display:flex;flex-direction:column;gap:1rem;position:relative;padding-left:1.5rem;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--color-border);"></div>
      ${["Teklif Oluşturuldu","Onay Bekliyor","Malzeme Planlandı","Üretim Başladı","Kalite Kontrol","Paketleme","Teslim Hazır"].map((step, i) => {
        const done = i <= 2;
        return `
        <div style="display:flex;align-items:flex-start;gap:1rem;position:relative;">
          <div style="width:10px;height:10px;border-radius:50%;background:${done?'var(--color-gold)':'#242724'};border:1px solid ${done?'var(--color-gold)':'var(--color-border)'};flex-shrink:0;margin-top:4px;"></div>
          <div style="flex:1;">
            <div style="font-weight:600;color:var(--color-text-main);font-size:0.875rem;">${step}</div>
            <div style="font-size:0.75rem;color:var(--color-text-secondary);">${done ? 'Tamamlandı' : 'Bekliyor'}</div>
          </div>
        </div>
        `;
      }).join("")}
    </div>
  </div>
</div>

<!-- Actions -->
<div class="card">
  <div class="card-body">
    <div class="section-title">Hızlı İşlemler</div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <button class="btn btn-secondary" onclick="APP_ORDER.notifyCustomer()">Müşteriye Bildir</button>
      <button class="btn btn-secondary" onclick="APP_ORDER.invoice()">Fatura Oluştur</button>
      <button class="btn btn-secondary" onclick="APP_ORDER.toPackaging()">Kargoya Hazırla</button>
      <button class="btn btn-primary" onclick="APP_ORDER.toProduction()">Üretime Aktar</button>
    </div>
  </div>
</div>
`;
  }

  function paymentBadge(p) {
    const cls = p === "Paid" ? "badge-quality" : p === "Partial" ? "badge-approval" : "badge-delayed";
    return `<span class="badge ${cls}">${p}</span>`;
  }

  function mount() {
    const q = window.APP.getQuery();
    const order = STATE.orders.find(o => o.id === q.id) || STATE.orders[0];

    function esc(t) {
      return String(t === null || t === undefined ? "" : t)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function printWindow(title, bodyHtml) {
      const win = window.open("", "_blank", "width=900,height=1000");
      if (!win) { toast("Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin."); return; }
      win.document.write(`<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>${esc(title)} — ZERYTHA OS</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color:#141715; margin:0; padding:8mm; }
  .brand { font-family: Georgia, 'Times New Roman', serif; color:#8F7343; font-size:20pt; letter-spacing:0.08em; }
  .sub { color:#6B6D67; font-size:8pt; letter-spacing:0.14em; text-transform:uppercase; margin-top:1mm; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #B9955D; padding-bottom:4mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size:15pt; margin:7mm 0 2mm; font-weight:500; }
  table { width:100%; border-collapse:collapse; font-size:9pt; margin-top:2mm; }
  th, td { border:1px solid #CFC9BD; padding:2.4mm 3mm; text-align:left; vertical-align:top; }
  th { background:#F1EEE7; font-weight:600; width:24%; }
  .total { margin-top:5mm; font-size:11pt; font-weight:600; text-align:right; }
  .muted { color:#6B6D67; font-size:8pt; }
  .print-btn { position:fixed; right:18px; bottom:18px; background:#B9955D; color:#090B0B; border:0; padding:10px 18px; font-weight:700; border-radius:4px; cursor:pointer; }
  @media print { .print-btn { display:none; } body { padding:0; } }
</style></head><body>
  <div class="head">
    <div><div class="brand">ZERYTHA</div><div class="sub">TRIKO, BİR YAŞAM TARZIDIR.</div></div>
    <div class="muted" style="text-align:right;">${esc(title)}<br>${esc(order.id)}<br>${fmtDate(new Date().toISOString().split("T")[0])}</div>
  </div>
  ${bodyHtml}
  <button class="print-btn" onclick="window.print()">Yazdır</button>
</body></html>`);
      win.document.close();
    }

    window.APP_ORDER = {
      printOrder() {
        printWindow("Sipariş Onay Formu", `
          <h1>${esc(order.model)}</h1>
          <div class="muted">${esc(order.customer)} · ${esc(order.id)}</div>
          <table>
            <tr><th>Müşteri</th><td>${esc(order.customer)}</td><th>Sipariş No</th><td>${esc(order.id)}</td></tr>
            <tr><th>Model</th><td>${esc(order.model)}</td><th>Renk / Beden</th><td>${esc(order.color)} / ${esc(order.size)}</td></tr>
            <tr><th>Miktar</th><td>${fmtNumber(order.qty)} adet</td><th>Sipariş Tarihi</th><td>${fmtDate(order.date)}</td></tr>
            <tr><th>Teslim Tarihi</th><td>${fmtDate(order.deadline)}</td><th>Durum</th><td>${esc(order.status)}</td></tr>
            <tr><th>Ödeme</th><td>${esc(order.payment)}</td><th>Sipariş Değeri</th><td>${fmtMoney(order.value)}</td></tr>
          </table>
          <div class="total">Toplam: ${fmtMoney(order.value)}</div>
          <p class="muted" style="margin-top:8mm;">Bu belge ZERYTHA OS tarafından oluşturulmuştur. Sipariş onayı için müşteriye iletilir.</p>
        `);
      },

      invoice() {
        const vat = Math.round(order.value * 0.20);
        printWindow("Fatura", `
          <h1>Fatura</h1>
          <div class="muted">Fatura No: FTR-${esc(order.id.replace("ZR-", ""))} · ${fmtDate(new Date().toISOString().split("T")[0])}</div>
          <table>
            <tr><th>Müşteri</th><td>${esc(order.customer)}</td><th>Sipariş</th><td>${esc(order.id)}</td></tr>
            <tr><th>Ürün</th><td colspan="3">${esc(order.model)} — ${esc(order.color)} / ${esc(order.size)}</td></tr>
            <tr><th>Adet</th><td>${fmtNumber(order.qty)}</td><th>Birim Fiyat</th><td>${fmtMoney(Math.round(order.value / Math.max(1, order.qty)))}</td></tr>
            <tr><th>Ara Toplam</th><td>${fmtMoney(order.value)}</td><th>KDV (%20)</th><td>${fmtMoney(vat)}</td></tr>
          </table>
          <div class="total">Genel Toplam: ${fmtMoney(order.value + vat)}</div>
          <p class="muted" style="margin-top:8mm;">Ödeme durumu: ${esc(order.payment)}. Bu fatura örnek amaçlı üretilmiştir.</p>
        `);
      },

      editOrder() {
        window.APP.openFormModal({
          title: "Siparişi Düzenle",
          submitLabel: "Değişiklikleri Kaydet",
          fields: [
            { name: "status", label: "Durum", type: "select", required: true, full: true, value: order.status, options: [
              { value: "Quotation", label: "Teklif" },
              { value: "Awaiting Approval", label: "Onay Bekliyor" },
              { value: "Material Planning", label: "Malzeme Planlama" },
              { value: "Production", label: "Üretimde" },
              { value: "Quality Control", label: "Kalite Kontrol" },
              { value: "Packaging", label: "Paketleme" },
              { value: "Ready to Ship", label: "Teslim Hazır" },
              { value: "Completed", label: "Tamamlandı" }
            ]},
            { name: "payment", label: "Ödeme", type: "select", required: true, value: order.payment, options: [
              { value: "Pending", label: "Ödeme Bekliyor" },
              { value: "Partial", label: "Kısmi Ödendi" },
              { value: "Paid", label: "Ödendi" }
            ]},
            { name: "deadline", label: "Teslim Tarihi", type: "date", required: true, value: order.deadline },
            { name: "value", label: "Sipariş Değeri (TRY)", type: "number", min: 0, required: true, value: order.value }
          ],
          onSubmit(data) {
            order.status = data.status;
            order.payment = data.payment;
            order.deadline = data.deadline;
            order.value = Math.max(0, Number(data.value) || 0);
            toast("Sipariş güncellendi: " + order.id);
            window.APP.refresh();
          }
        });
      },

      notifyCustomer() {
        const customer = STATE.customers.find(c => c.company === order.customer);
        if (!customer) { toast("Müşteri e-posta kaydı bulunamadı."); return; }
        const subject = encodeURIComponent("Sipariş Güncellemesi — " + order.id);
        const body = encodeURIComponent("Merhaba " + customer.contact + ",\n\n" + order.id + " numaralı " + order.model + " siparişinizin güncel durumu: " + order.status + ".\nTeslim tarihi: " + fmtDate(order.deadline) + ".\n\nZERYTHA");
        window.location.href = "mailto:" + customer.email + "?subject=" + subject + "&body=" + body;
        toast("E-posta uygulaması açılıyor: " + customer.email);
      },

      toPackaging() {
        order.status = "Packaging";
        toast("Sipariş paketlemeye alındı: " + order.id);
        window.APP.refresh();
      },

      toProduction() {
        order.status = "Production";
        toast("Sipariş üretime aktarıldı: " + order.id);
        window.APP.refresh();
      }
    };
  }

  window.VIEWS["order-detail"] = { render, mount };
})();
