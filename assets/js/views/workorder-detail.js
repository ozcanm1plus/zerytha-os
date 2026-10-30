/* =========================================================================
   ZERYTHA OS — İş Emri Detayı (Work Order Detail)
   Gerçek QR kod + A4 yazdırma + parça / iplik kaydı
   ========================================================================= */
(function () {
  const { fmtDate, fmtNumber, toast } = window.APP;
  const D = window.WORK_DATA;

  function esc(t) {
    if (t === null || t === undefined) return "";
    return String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function cust(id) { return D.customers.find(x => x.id === id); }
  function custName(id) { const c = cust(id); return c ? c.name : '-'; }
  function persistWo(w) {
    if (!w) return;
    try {
      localStorage.setItem("wo_" + w.id, JSON.stringify({
        status: w.status,
        pieces: w.pieces || [],
        yarnUsage: w.yarnUsage || []
      }));
    } catch (e) {}
  }
  function custCode(id) { const c = cust(id); return c ? c.code : "—"; }
  function yarnName(id) {
    if (id === "manual") return "Elle girilen iplik";
    const y = D.yarnTypes.find(x => x.id === id);
    return y ? y.name : "—";
  }

  function statusBadge(status) {
    const open = status === "Açık";
    return `<span class="badge ${open ? "badge-production" : "badge-completed"}">${esc(status)}</span>`;
  }

  function qrPayload(wo) {
    const base = (window.APP.STATE.company && window.APP.STATE.company.qrBaseUrl || "").trim().replace(/\/+$/, "");
    if (base) {
      return base + "/?view=workorder-detail&id=" + encodeURIComponent(wo.id)
        + "&model=" + encodeURIComponent(wo.modelName || wo.model)
        + "&qty=" + wo.qty
        + "&gg=" + encodeURIComponent(wo.gauge)
        + "&due=" + encodeURIComponent(wo.deadline)
        + "&cust=" + encodeURIComponent(wo.custId)
        + "&status=" + encodeURIComponent(wo.status);
    }
    const host = location.hostname;
    const isPublicHttp = /^https?:$/i.test(location.protocol) && host && host !== "localhost" && host !== "127.0.0.1";
    if (isPublicHttp) {
      const origin = location.origin + location.pathname.replace(/[^/]*$/, "");
      return origin + "?view=workorder-detail&id=" + encodeURIComponent(wo.id)
        + "&model=" + encodeURIComponent(wo.modelName || wo.model)
        + "&qty=" + wo.qty
        + "&gg=" + encodeURIComponent(wo.gauge)
        + "&due=" + encodeURIComponent(wo.deadline)
        + "&cust=" + encodeURIComponent(wo.custId)
        + "&status=" + encodeURIComponent(wo.status);
    }
    // Ag erisimi yokken: metin (sistem baglantisi icin Ayarlar'dan sunucu adresi girilmeli)
    return "ZERYTHA WO | ID: " + wo.id +
      " | MODEL: " + (wo.modelName || wo.model) +
      " | QTY: " + wo.qty +
      " | DUE: " + wo.deadline +
      " | STATUS: " + (wo.status === "Açık" ? "OPEN" : "DONE");
  }

  function render() {
    const q = window.APP.getQuery();
    let wo = D.workOrders.find(w => w.id === q.id);

    // QR'dan gelen veriyle iş emrini yeniden oluştur (statik listede yoksa)
    if (!wo && q.id) {
      wo = {
        id: q.id,
        custId: q.cust || "cust-001",
        season: q.season || "2026",
        model: (q.model || q.id).split(" ")[0],
        modelName: q.model || q.id,
        yarnId: "manual",
        yarnManual: q.yarn || "",
        gauge: q.gg || "12 GG",
        qty: parseInt(q.qty, 10) || 0,
        deadline: q.due || new Date().toISOString().split("T")[0],
        image: null,
        status: q.status || "Açık",
        created: new Date().toISOString().split("T")[0],
        pieces: [],
        yarnUsage: []
      };
      // telefon hafızasından parça/iplik kayıtlarını geri yükle
      try {
        const saved = localStorage.getItem("wo_" + wo.id);
        if (saved) {
          const d = JSON.parse(saved);
          if (Array.isArray(d.pieces)) wo.pieces = d.pieces;
          if (Array.isArray(d.yarnUsage)) wo.yarnUsage = d.yarnUsage;
          if (d.status) wo.status = d.status;
        }
      } catch (e) {}
      D.workOrders.push(wo);
    }

    if (!wo) {
      return `<div class="page-header"><div><h1 class="page-title text-brand">İş Emri Bulunamadı</h1><p class="page-subtitle">Kayıt silinmiş veya bağlantı geçersiz olabilir.</p></div></div>
      <div class="card"><div class="card-body" style="padding:3rem;text-align:center;">
        <button class="btn btn-primary" onclick="window.APP.navigate('/workorders')">İş Emirlerine Dön</button>
      </div></div>`;
    }

    const late = new Date(wo.deadline) < new Date() && wo.status === "Açık";

    return `
<div class="page-header">
  <div>
    <button class="btn btn-ghost btn-sm" onclick="window.APP.navigate('/workorders')" style="margin-bottom:0.5rem;padding-left:0;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      İş Emirleri
    </button>
    <h1 class="page-title text-brand">${esc(wo.modelName || wo.model)}</h1>
    <p class="page-subtitle">${esc(wo.id)} · ${esc(custName(wo.custId))} · ${esc(wo.season)}</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('/workorder-new?id=${encodeURIComponent(wo.id)}')">Düzenle</button>
    <button class="btn btn-secondary btn-sm" onclick="APP_WO.toggleStatus('${wo.id}')">${wo.status === "Açık" ? "Üretimi Tamamla" : "Yeniden Aç"}</button>
    <button class="btn btn-primary btn-sm" onclick="APP_WO.printWo('${wo.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline><path d="M6 21V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"></path></svg>
      A4 Yazdır
    </button>
  </div>
</div>

<div class="wo-detail-grid">
  <div class="card">
    <div class="card-body">
      <div style="display:flex;gap:1.5rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;">
        <div style="min-width:0;">
          <div class="form-label">İş Emri No</div>
          <div class="wo-code">${esc(wo.id)}</div>
          <div style="font-size:0.75rem;color:var(--color-text-secondary);margin-top:0.35rem;">Oluşturma: ${fmtDate(wo.created)}</div>
          <div style="margin-top:0.85rem;display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            ${statusBadge(wo.status)}
            ${late ? `<span class="badge" style="background:rgba(142,75,75,0.12);color:var(--color-error);border-color:rgba(142,75,75,0.4);">Termin Geçti</span>` : ""}
          </div>
        </div>
        <div class="wo-qr-wrap">
          <div id="wo-qr" class="wo-qr"></div>
          <div class="wo-qr-label">Makineci QR Tarama</div>
          <div style="font-size:0.62rem;color:var(--color-text-muted);margin-top:0.35rem;text-align:center;max-width:120px;line-height:1.3;">
            Telefonla okutunca iş emri açılır; dakika/gramaj girilip kaydedilir.
          </div>
        </div>
      </div>

      <div class="wo-spec-grid">
        <div><div class="form-label">Müşteri</div><div class="wo-spec-value">${esc(custName(wo.custId))} <span style="color:var(--color-gold);font-size:0.75rem;">(${esc(custCode(wo.custId))})</span></div></div>
        <div><div class="form-label">Sezon</div><div class="wo-spec-value">${esc(wo.season)}</div></div>
        <div><div class="form-label">Model Kodu</div><div class="wo-spec-value">${esc(wo.model)}</div></div>
        <div><div class="form-label">Makine GG</div><div class="wo-spec-value">${esc(wo.gauge)}</div></div>
        <div><div class="form-label">İplik Türü</div><div class="wo-spec-value">${esc(yarnName(wo.yarnId))}${wo.yarnManual ? " — " + esc(wo.yarnManual) : ""}</div></div>
        <div><div class="form-label">Miktar</div><div class="wo-spec-value">${fmtNumber(wo.qty)} adet</div></div>
        <div><div class="form-label">Termin Tarihi</div><div class="wo-spec-value" style="color:${late ? "var(--color-error)" : "var(--color-text-main)"};">${fmtDate(wo.deadline)}</div></div>
        <div><div class="form-label">Parça / İplik Kaydı</div><div class="wo-spec-value">${(wo.pieces || []).length} parça · ${(wo.yarnUsage || []).length} iplik</div></div>
      </div>

      <div class="wo-model-image-row">
        <div class="form-label">Model Görseli</div>
        <div class="wo-model-image">
          ${wo.image ? `<img src="${esc(wo.image)}" alt="${esc(wo.modelName)}">` : `<span>Görsel yok</span>`}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wo-instruction">
  <div class="wo-instruction-title">Makineci Talimatı</div>
  <div class="wo-instruction-text">
    İş emrindeki <b>QR kodu</b> cep telefonuyla okutun. Dokunan her parçanın adını, işleme süresini (dakika) ve ham boyunu (cm) girin.
    Kullanılan ipliğin gramajını ve kon adedini kaydedin. Kayıtlar bu iş emrinde saklanır.
  </div>
</div>

<div class="card" style="margin-bottom:1rem;">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">Dokunan Parçalar &amp; İplik Kullanımı</div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <button class="btn btn-secondary btn-sm" onclick="APP_WO.addPiece('${wo.id}')">+ Parça Ekle</button>
      <button class="btn btn-secondary btn-sm" onclick="APP_WO.addYarn('${wo.id}')">+ İplik Girişi</button>
    </div>
  </div>
  <div class="card-body">
    <div class="wo-table-label">Parça Kayıtları</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Parça Adı</th><th>Dakika</th><th style="text-align:right;">Ham Boy (cm)</th><th>Kullanıcı</th><th style="text-align:center;">İşlem</th></tr></thead>
        <tbody>
          ${(wo.pieces || []).map((p, i) => `<tr>
            <td>${esc(p.name)}</td>
            <td class="num">${esc(p.min)}</td>
            <td class="num" style="text-align:right;">${esc(p.len)}</td>
            <td style="font-size:0.75rem;color:var(--color-text-secondary);">${esc(p.user)}</td>
            <td style="text-align:center;"><button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="APP_WO.removePiece('${wo.id}',${i})">Sil</button></td>
          </tr>`).join("") || `<tr><td colspan="5" style="padding:1.25rem;color:var(--color-text-muted);text-align:center;">Henüz parça kaydı yok</td></tr>`}
        </tbody>
      </table>
    </div>

    <div class="wo-table-label" style="margin-top:1.25rem;">İplik Kullanımı (gramaj)</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>İplik</th><th style="text-align:right;">Gramaj (g)</th><th style="text-align:right;">Kon</th><th style="text-align:center;">İşlem</th></tr></thead>
        <tbody>
          ${(wo.yarnUsage || []).map((y, i) => `<tr>
            <td>${esc(y.type)}</td>
            <td class="num" style="text-align:right;">${esc(y.gram)}</td>
            <td class="num" style="text-align:right;">${esc(y.cones)}</td>
            <td style="text-align:center;"><button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="APP_WO.removeYarn('${wo.id}',${i})">Sil</button></td>
          </tr>`).join("") || `<tr><td colspan="4" style="padding:1.25rem;color:var(--color-text-muted);text-align:center;">Henüz iplik kaydı yok</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>
</div>
`;
  }

  function mount() {
    window.APP_WO = window.APP_WO || {};
    window.APP_WO.qrText = function (id) {
      const wo = D.workOrders.find(w => w.id === id);
      return wo ? qrPayload(wo) : null;
    };
    const q = window.APP.getQuery();
    const wo = D.workOrders.find(w => w.id === q.id);
    if (!wo) return;

    const qrEl = document.getElementById("wo-qr");
    if (qrEl && window.QRCode) {
      qrEl.innerHTML = "";
      new QRCode(qrEl, {
        text: qrPayload(wo),
        width: 132,
        height: 132,
        colorDark: "#0B0D0C",
        colorLight: "#F1EEE7",
        correctLevel: QRCode.CorrectLevel.L
      });
      const canvas = qrEl.querySelector("canvas");
      if (canvas) {
        try { window.__WO_QR = canvas.toDataURL("image/png"); } catch (e) { window.__WO_QR = null; }
      }
    } else if (qrEl) {
      qrEl.innerHTML = `<div style="font-size:0.65rem;color:var(--color-text-muted);text-align:center;padding:0.5rem;">QR kütüphanesi yüklenemedi</div>`;
    }

    window.APP_WO = window.APP_WO || {};

    window.APP_WO.toggleStatus = function (id) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w) return;
      w.status = w.status === "Açık" ? "Tamamlandı" : "Açık";
      persistWo(w);
      toast("İş emri durumu: " + w.status);
      window.APP.refresh();
    };

    window.APP_WO.addPiece = function (id) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w) return;
      window.APP.openFormModal({
        title: "Parça Kaydı Ekle",
        submitLabel: "Parçayı Kaydet",
        fields: [
          { name: "name", label: "Parça Adı", required: true, placeholder: "Ör. Ön gövde, Kol, Yaka", full: true },
          { name: "min", label: "İşleme Süresi (dakika)", type: "number", min: 0, placeholder: "45" },
          { name: "len", label: "Ham Boy (cm)", type: "number", min: 0, placeholder: "62" }
        ],
        onSubmit(data) {
          w.pieces = w.pieces || [];
          w.pieces.push({ name: data.name, min: data.min, len: data.len, user: window.APP.STATE.user.name, ts: new Date().toISOString() });
          persistWo(w);
          toast("Parça kaydedildi: " + data.name);
          window.APP.refresh();
        }
      });
    };

    window.APP_WO.removePiece = function (id, i) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w || !w.pieces) return;
      w.pieces.splice(i, 1);
      persistWo(w);
      toast("Parça kaydı kaldırıldı");
      window.APP.refresh();
    };

    window.APP_WO.addYarn = function (id) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w) return;
      window.APP.openFormModal({
        title: "İplik Kullanımı Ekle",
        submitLabel: "İpliği Kaydet",
        fields: [
          { name: "type", label: "İplik Türü / Karışım", required: true, placeholder: "Ör. %70 Pamuk %30 Polyamid", full: true },
          { name: "gram", label: "Kullanılan Gramaj (g)", type: "number", min: 0, placeholder: "320" },
          { name: "cones", label: "Kullanılan Kon Adedi", type: "number", min: 0, placeholder: "4" }
        ],
        onSubmit(data) {
          w.yarnUsage = w.yarnUsage || [];
          w.yarnUsage.push({ type: data.type, gram: data.gram, cones: data.cones, ts: new Date().toISOString() });
          persistWo(w);

          toast("İplik kullanımı kaydedildi: " + data.type);
          window.APP.refresh();
        }
      });
    };

    window.APP_WO.removeYarn = function (id, i) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w || !w.yarnUsage) return;
      w.yarnUsage.splice(i, 1);
      persistWo(w);

      toast("İplik kaydı kaldırıldı");
      window.APP.refresh();
    };

    window.APP_WO.printWo = function (id) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w) return;

      const qr = window.__WO_QR;
      const qrBlock = qr
        ? `<img src="${qr}" alt="QR" style="width:66px;height:66px;display:block;">`
        : `<div style="width:66px;height:66px;border:1px solid #242724;display:grid;place-items:center;font-size:7pt;">${esc(w.id)}</div>`;

      const pieces = (w.pieces || []).map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${esc(p.min)}</td><td>${esc(p.len)}</td><td>${esc(p.user)}</td></tr>`).join("");
      const yarns = (w.yarnUsage || []).map((y, i) => `<tr><td>${i + 1}</td><td>${esc(y.type)}</td><td>${esc(y.gram)}</td><td>${esc(y.cones)}</td></tr>`).join("");

      const win = window.open("", "_blank", "width=900,height=1000");
      if (!win) { toast("Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin."); return; }

      win.document.write(`<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>${esc(w.id)} — ZERYTHA OS</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; background:#fff; color:#090B0B; margin:0; padding:6mm; }
  .brand { font-family: Georgia, 'Times New Roman', serif; color:#8F7343; font-size:20pt; letter-spacing:0.08em; }
  .sub { color:#6B6D67; font-size:8pt; letter-spacing:0.14em; text-transform:uppercase; margin-top:1mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size:16pt; margin:6mm 0 1mm; font-weight:500; }
  h2 { font-size:9pt; letter-spacing:0.12em; text-transform:uppercase; color:#6B6D67; margin:7mm 0 2mm; border-bottom:1px solid #D8D3C8; padding-bottom:1.5mm; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #B9955D; padding-bottom:4mm; }
  .qr { text-align:center; font-size:7pt; color:#6B6D67; }
  table { width:100%; border-collapse:collapse; font-size:8.5pt; }
  th, td { border:1px solid #CFC9BD; padding:2.2mm 2.5mm; text-align:left; vertical-align:top; }
  th { background:#F1EEE7; font-weight:600; width:22%; }
  .sheet th { width:auto; background:#171A18; color:#F1EEE7; font-size:7.5pt; letter-spacing:0.04em; }
  .sheet td { font-size:8pt; }
  .muted { color:#6B6D67; font-size:7.5pt; }
  .print-btn { position:fixed; right:18px; bottom:18px; background:#B9955D; color:#090B0B; border:0; padding:10px 18px; font-weight:700; border-radius:4px; cursor:pointer; }
  @media print { .print-btn { display:none; } body { padding:0; } }
</style></head>
<body>
  <div class="head">
    <div>
      <div class="brand">ZERYTHA</div>
      <div class="sub">TRIKO, BİR YAŞAM TARZIDIR.</div>
    </div>
    <div class="qr">${qrBlock}<div style="margin-top:1mm;">${esc(w.id)}</div></div>
  </div>
  <h1>${esc(w.modelName || w.model)}</h1>
  <div class="muted">İş Emri: ${esc(w.id)} · ${esc(w.season)} · ${esc(custName(w.custId))}</div>

  <h2>İş Emri Bilgileri</h2>
  <table>
    <tr><th>Müşteri</th><td>${esc(custName(w.custId))} (${esc(custCode(w.custId))})</td><th>Sezon</th><td>${esc(w.season)}</td></tr>
    <tr><th>Model Kodu</th><td>${esc(w.model)}</td><th>Makine GG</th><td>${esc(w.gauge)}</td></tr>
    <tr><th>İplik</th><td>${esc(yarnName(w.yarnId))}${w.yarnManual ? " — " + esc(w.yarnManual) : ""}</td><th>Termin</th><td>${fmtDate(w.deadline)}</td></tr>
    <tr><th>Miktar</th><td>${fmtNumber(w.qty)} adet</td><th>Durum</th><td>${esc(w.status)}</td></tr>
  </table>

  <h2>Dokunan Parçalar</h2>
  <table class="sheet">
    <thead><tr><th>#</th><th>Parça Adı</th><th>Dakika</th><th>Ham Boy (cm)</th><th>Kullanıcı</th></tr></thead>
    <tbody>${pieces || `<tr><td colspan="5" class="muted">Kayıt yok</td></tr>`}</tbody>
  </table>

  <h2>İplik Kullanımı</h2>
  <table class="sheet">
    <thead><tr><th>#</th><th>İplik</th><th>Gramaj (g)</th><th>Kon</th></tr></thead>
    <tbody>${yarns || `<tr><td colspan="4" class="muted">Kayıt yok</td></tr>`}</tbody>
  </table>

  <p class="muted" style="margin-top:6mm;">Makineci, QR kodu okutarak parça ve iplik kayıtlarını sisteme girer. Bu çıktı A4 olarak yazdırılabilir.</p>
  <button class="print-btn" onclick="window.print()">Yazdır</button>
</body></html>`);
      win.document.close();
    };
  }

  window.VIEWS["workorder-detail"] = { render, mount };
})();
