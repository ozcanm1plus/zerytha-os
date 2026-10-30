/* =========================================================================
   ZERYTHA OS — Raporlar & Analitik
   Gerçek STATE verileri, CSS grafikler, CSV dışa aktarma ve A4 rapor
   ========================================================================= */
(function () {
  const { STATE, fmtDate, fmtMoney, fmtNumber, toast } = window.APP;

  function esc(t) {
    return String(t === null || t === undefined ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function metrics() {
    const orders = STATE.orders;
    const totalValue = orders.reduce((a, o) => a + o.value, 0);
    const prodQty = STATE.production.reduce((a, p) => a + p.qty, 0);
    const prodDone = STATE.production.reduce((a, p) => a + p.done, 0);
    const efficiency = prodQty ? Math.round((prodDone / prodQty) * 100) : 0;
    const completed = orders.filter(o => o.status === "Completed").length;
    const completion = orders.length ? Math.round((completed / orders.length) * 100) : 0;
    const lowYarn = STATE.yarn.filter(y => y.available < 200).length;
    const avgPerf = STATE.subcontractors.length
      ? Math.round(STATE.subcontractors.reduce((a, s) => a + s.performance, 0) / STATE.subcontractors.length)
      : 0;
    const customerValues = STATE.customers
      .map(c => ({
        name: c.company,
        value: orders.filter(o => o.customer === c.company).reduce((a, o) => a + o.value, 0)
      }))
      .filter(c => c.value > 0)
      .sort((a, b) => b.value - a.value);
    return { orders, totalValue, prodQty, prodDone, efficiency, completed, completion, lowYarn, avgPerf, customerValues };
  }

  function render() {
    const m = metrics();
    const maxCustomer = Math.max(1, ...m.customerValues.map(c => c.value));
    const totalYarn = STATE.yarn.reduce((a, y) => a + y.available, 0);
    const maxYarn = Math.max(1, ...STATE.yarn.map(y => y.available));

    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Raporlar &amp; Analitik</h1>
    <p class="page-subtitle">Satış, üretim verimliliği, iplik tüketimi ve karlılık raporları</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="APP_REPORTS.exportCsv()">CSV Dışa Aktar</button>
    <button class="btn btn-primary btn-sm" onclick="APP_REPORTS.printReport()">Rapor Yazdır</button>
  </div>
</div>

<div class="kpi-grid" style="margin-bottom:1.5rem;">
  <div class="kpi-card top-gold">
    <div class="kpi-label">Sipariş Değeri (TRY)</div>
    <div class="kpi-value text-numeric">${fmtMoney(m.totalValue)}</div>
    <div class="kpi-delta pos">${m.orders.length} aktif kayıt</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Üretim İlerlemesi</div>
    <div class="kpi-value text-numeric">${m.efficiency}%</div>
    <div class="kpi-delta pos">${fmtNumber(m.prodDone)} / ${fmtNumber(m.prodQty)} adet</div>
  </div>
  <div class="kpi-card top-red">
    <div class="kpi-label">Kritik İplik</div>
    <div class="kpi-value text-numeric">${m.lowYarn}</div>
    <div class="kpi-delta neg">200 kg altı parti</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Tamamlanan Sipariş</div>
    <div class="kpi-value text-numeric">${m.completion}%</div>
    <div class="kpi-delta pos">${m.completed} / ${m.orders.length} sipariş</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;" class="report-two-col">
  <div class="card">
    <div class="card-body">
      <div class="section-title">Satış Performansı — Müşteri Bazlı</div>
      <div style="display:flex;flex-direction:column;gap:0.85rem;margin-top:1.1rem;">
        ${m.customerValues.map(c => `
          <div>
            <div style="display:flex;justify-content:space-between;gap:1rem;font-size:0.8rem;margin-bottom:0.3rem;">
              <span style="color:var(--color-text-main);font-weight:600;">${esc(c.name)}</span>
              <span style="font-family:var(--font-numeric);color:var(--color-text-secondary);">${fmtMoney(c.value)}</span>
            </div>
            <div class="progress-bar" style="height:5px;"><div class="progress-fill" style="width:${Math.round(c.value / maxCustomer * 100)}%;"></div></div>
          </div>
        `).join("") || `<div style="color:var(--color-text-muted);font-size:0.8rem;">Sipariş değeri bulunmuyor</div>`}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="section-title">İplik Stoğu — Parti Bazlı</div>
      <div style="display:flex;flex-direction:column;gap:0.85rem;margin-top:1.1rem;">
        ${STATE.yarn.map(y => `
          <div>
            <div style="display:flex;justify-content:space-between;gap:1rem;font-size:0.8rem;margin-bottom:0.3rem;">
              <span style="color:var(--color-text-main);font-weight:600;">${esc(y.composition)} <span style="color:var(--color-text-muted);font-weight:400;">${esc(y.dyeLot)}</span></span>
              <span style="font-family:var(--font-numeric);color:${y.available < 200 ? "var(--color-error)" : "var(--color-text-secondary)"};">${fmtNumber(y.available)} kg</span>
            </div>
            <div class="progress-bar" style="height:5px;"><div class="progress-fill ${y.available < 200 ? "delayed" : ""}" style="width:${Math.round(y.available / maxYarn * 100)}%;"></div></div>
          </div>
        `).join("")}
      </div>
      <div style="margin-top:1rem;padding-top:0.85rem;border-top:1px solid var(--color-border);font-size:0.75rem;color:var(--color-text-muted);">
        Toplam kullanılabilir: <b style="font-family:var(--font-numeric);color:var(--color-text-main);">${fmtNumber(totalYarn)} kg</b>
      </div>
    </div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;" class="report-two-col">
  <div class="card">
    <div class="card-body">
      <div class="section-title">Alt Müşavir Performansı</div>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        ${STATE.subcontractors.map(s => `
        <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1F221F;">
          <div style="min-width:0;">
            <div style="font-weight:600;color:var(--color-text-main);font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(s.name)}</div>
            <div style="font-size:0.75rem;color:var(--color-text-secondary);">${esc(s.specialty)} • ${esc(s.city)}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${s.performance}%</div>
          </div>
        </div>
        `).join("")}
      </div>
      <div style="margin-top:1rem;font-size:0.75rem;color:var(--color-text-muted);">Ortalama performans: <b style="font-family:var(--font-numeric);color:var(--color-text-main);">${m.avgPerf}%</b></div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="section-title">Müşteri Karlılığı</div>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        ${STATE.customers.slice(0,5).map(c => `
        <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1F221F;">
          <div style="min-width:0;">
            <div style="font-weight:600;color:var(--color-text-main);font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(c.company)}</div>
            <div style="font-size:0.75rem;color:var(--color-text-secondary);">${c.orders} sipariş</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${fmtMoney(c.orders * 12000)}</div>
          </div>
        </div>
        `).join("")}
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-body">
    <div class="section-title">Aylık Finansal Genel Bakış</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:1rem;">
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Toplam Gelir</div>
        <div style="font-family:var(--font-numeric);font-weight:600;font-size:1.25rem;color:var(--color-text-main);margin-top:0.25rem;">${fmtMoney(m.totalValue)}</div>
      </div>
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Tahmini Gider</div>
        <div style="font-family:var(--font-numeric);font-weight:600;font-size:1.25rem;color:var(--color-text-main);margin-top:0.25rem;">${fmtMoney(Math.round(m.totalValue * 0.62))}</div>
      </div>
      <div style="background:var(--color-panel);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1rem;">
        <div style="font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Net Kar</div>
        <div style="font-family:var(--font-numeric);font-weight:600;font-size:1.25rem;color:var(--color-success);margin-top:0.25rem;">${fmtMoney(Math.round(m.totalValue * 0.38))}</div>
      </div>
    </div>
    <div style="margin-top:1rem;font-size:0.72rem;color:var(--color-text-muted);">Net kar, %38 brüt marj varsayımıyla hesaplanır.</div>
  </div>
</div>
`;
  }

  function mount() {
    window.APP_REPORTS = {
      exportCsv() {
        const header = ["Sipariş No", "Müşteri", "Model", "Adet", "Renk", "Beden", "Sipariş Tarihi", "Teslim Tarihi", "Değer (TRY)", "Ödeme", "Durum"];
        const rows = STATE.orders.map(o => [o.id, o.customer, o.model, o.qty, o.color, o.size, o.date, o.deadline, o.value, o.payment, o.status]);
        const csv = [header, ...rows]
          .map(r => r.map(v => `"${String(v === null || v === undefined ? "" : v).replace(/"/g, '""')}"`).join(";"))
          .join("\r\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "zerytha-siparis-raporu.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        toast("CSV raporu indirildi.");
      },

      printReport() {
        const m = metrics();
        const win = window.open("", "_blank", "width=900,height=1000");
        if (!win) { toast("Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin."); return; }
        const customerRows = m.customerValues.map(c => `<tr><td>${esc(c.name)}</td><td style="text-align:right;">${fmtMoney(c.value)}</td></tr>`).join("");
        const workshopRows = STATE.subcontractors.map(s => `<tr><td>${esc(s.name)}</td><td>${esc(s.specialty)}</td><td>${esc(s.city)}</td><td style="text-align:right;">${s.performance}%</td></tr>`).join("");
        win.document.write(`<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>ZERYTHA Rapor — ${fmtDate(new Date().toISOString().split("T")[0])}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color:#141715; margin:0; padding:8mm; }
  .brand { font-family: Georgia, 'Times New Roman', serif; color:#8F7343; font-size:20pt; letter-spacing:0.08em; }
  .sub { color:#6B6D67; font-size:8pt; letter-spacing:0.14em; text-transform:uppercase; margin-top:1mm; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #B9955D; padding-bottom:4mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size:15pt; margin:7mm 0 2mm; font-weight:500; }
  h2 { font-size:9pt; letter-spacing:0.12em; text-transform:uppercase; color:#6B6D67; margin:7mm 0 2mm; border-bottom:1px solid #D8D3C8; padding-bottom:1.5mm; }
  table { width:100%; border-collapse:collapse; font-size:9pt; }
  th, td { border:1px solid #CFC9BD; padding:2mm 2.5mm; text-align:left; }
  th { background:#171A18; color:#F1EEE7; font-size:7.5pt; letter-spacing:0.04em; }
  .muted { color:#6B6D67; font-size:8pt; }
  .print-btn { position:fixed; right:18px; bottom:18px; background:#B9955D; color:#090B0B; border:0; padding:10px 18px; font-weight:700; border-radius:4px; cursor:pointer; }
  @media print { .print-btn { display:none; } body { padding:0; } }
</style></head><body>
  <div class="head">
    <div><div class="brand">ZERYTHA</div><div class="sub">TRIKO, BİR YAŞAM TARZIDIR.</div></div>
    <div class="muted" style="text-align:right;">Yönetim Raporu<br>${fmtDate(new Date().toISOString().split("T")[0])}</div>
  </div>
  <h1>Dönemsel Performans Özeti</h1>
  <table>
    <tr><th>Sipariş Değeri</th><td>${fmtMoney(m.totalValue)}</td><th>Üretim İlerlemesi</th><td>${m.efficiency}%</td></tr>
    <tr><th>Tamamlanan Sipariş</th><td>${m.completed} / ${m.orders.length}</td><th>Kritik İplik</th><td>${m.lowYarn} parti</td></tr>
  </table>
  <h2>Müşteri Bazlı Satış</h2>
  <table><thead><tr><th>Müşteri</th><th style="text-align:right;">Sipariş Değeri</th></tr></thead><tbody>${customerRows}</tbody></table>
  <h2>Alt Müşavir Performansı</h2>
  <table><thead><tr><th>Atölye</th><th>Uzmanlık</th><th>Şehir</th><th style="text-align:right;">Performans</th></tr></thead><tbody>${workshopRows}</tbody></table>
  <p class="muted" style="margin-top:7mm;">Bu rapor ZERYTHA OS tarafından canlı uygulama verilerinden üretilmiştir.</p>
  <button class="print-btn" onclick="window.print()">Yazdır</button>
</body></html>`);
        win.document.close();
      }
    };
  }

  window.VIEWS.reports = { render, mount };
})();
