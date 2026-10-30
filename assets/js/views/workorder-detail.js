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
  function custName(id) { const c = cust(id); return c ? c.name : "-"; }
  function custCode(id) { const c = cust(id); return c ? c.code : "-"; }
  function yarnName(id) {
    if (id === "manual") return "Elle girilen iplik";
    const y = D.yarnTypes.find(x => x.id === id);
    return y ? y.name : "-";
  }

  function statusBadge(status) {
    const open = status === "Açık";
    return `<span class="badge ${open ? "badge-production" : "badge-completed"}">${esc(status)}</span>`;
  }

  function persistWo(w) {
    if (!w) return;
    try {
      localStorage.setItem("wo_" + w.id, JSON.stringify({
        status: w.status,
        pieces: w.pieces || [],
        yarnUsage: w.yarnUsage || []
      }));
    } catch (e) {}
    if (window.FIREBASE && w) {
      try {
        window.FIREBASE.ref("workOrders/" + w.id).set({
          status: w.status,
          pieces: w.pieces || [],
          yarnUsage: w.yarnUsage || []
        });
      } catch (e) {}
    }
  }

  function qrPayload(wo) {
    const base = (window.APP.STATE.company && window.APP.STATE.company.qrBaseUrl || "").trim().replace(/\/+$/, "");
    if (base) {
      return base + "/?v=workorder-detail&id=" + encodeURIComponent(wo.id)
        + "&m=" + encodeURIComponent(wo.modelName || wo.model)
        + "&q=" + wo.qty
        + "&g=" + encodeURIComponent(wo.gauge)
        + "&d=" + encodeURIComponent(wo.deadline)
        + "&c=" + encodeURIComponent(wo.custId)
        + "&s=" + encodeURIComponent(wo.status);
    }
    const host = location.hostname;
    const isPublicHttp = /^https?:$/i.test(location.protocol) && host && host !== "localhost" && host !== "127.0.0.1";
    if (isPublicHttp) {
      const origin = location.origin + location.pathname.replace(/[^/]*$/, "");
      return origin + "?v=workorder-detail&id=" + encodeURIComponent(wo.id)
        + "&m=" + encodeURIComponent(wo.modelName || wo.model)
        + "&q=" + wo.qty
        + "&g=" + encodeURIComponent(wo.gauge)
        + "&d=" + encodeURIComponent(wo.deadline)
        + "&c=" + encodeURIComponent(wo.custId)
        + "&s=" + encodeURIComponent(wo.status);
    }
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
        custId: q.cust || q.c || "cust-001",
        season: q.season || q.sn || "2026",
        model: (q.model || q.m || q.id).split(" ")[0],
        modelName: q.model || q.m || q.id,
        yarnId: "manual",
        yarnManual: q.yarn || q.y || "",
        gauge: q.gg || q.g || "12 GG",
        qty: parseInt(q.qty || q.q, 10) || 0,
        deadline: q.due || q.d || new Date().toISOString().split("T")[0],
        image: null,
        status: q.status || q.s || "Açık",
        created: new Date().toISOString().split("T")[0],
        pieces: [],
        yarnUsage: []
      };
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

    // Firebase'dan veri yükle (varsa)
    if (window.FIREBASE && wo && window.__WO_FB_LOADED_ID !== wo.id) {
      window.__WO_FB_LOADED_ID = wo.id;
      window.FIREBASE.ref("workOrders/" + wo.id).once("value").then(snap => {
        const d = snap.val();
        if (d) {
          if (Array.isArray(d.pieces)) wo.pieces = d.pieces;
          if (Array.isArray(d.yarnUsage)) wo.yarnUsage = d.yarnUsage;
          if (d.status) wo.status = d.status;
          persistWo(wo);
          window.APP.refresh();
        }
      }).catch(() => {});
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      A4 Yazdır
    </button>
    <button class="btn btn-secondary btn-sm" onclick="APP_WO.exportData('${wo.id}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      Verileri İndir
    </button>
  </div>
</div>

<div class="wo-detail-grid">
  <div class="card">
    <div class="card-body">
      <div class="section-title">İş Emri Bilgileri</div>
      <div class="wo-spec-grid">
        <div><div class="form-label">Müşteri</div><div class="wo-spec-value">${esc(custName(wo.custId))}</div></div>
        <div><div class="form-label">Sezon</div><div class="wo-spec-value">${esc(wo.season)}</div></div>
        <div><div class="form-label">Model Kodu</div><div class="wo-spec-value">${esc(wo.model)}</div></div>
        <div><div class="form-label">Model Adı</div><div class="wo-spec-value">${esc(wo.modelName || wo.model)}</div></div>
        <div><div class="form-label">İplik</div><div class="wo-spec-value">${esc(yarnName(wo.yarnId))}${wo.yarnManual ? " · " + esc(wo.yarnManual) : ""}</div></div>
        <div><div class="form-label">Makine GG</div><div class="wo-spec-value">${esc(wo.gauge)}</div></div>
        <div><div class="form-label">Miktar</div><div class="wo-spec-value">${fmtNumber(wo.qty)} adet</div></div>
        <div><div class="form-label">Termin</div><div class="wo-spec-value">${fmtDate(wo.deadline)}${late ? ' <span class="badge" style="background:rgba(142,75,75,0.12);color:var(--color-error);border-color:rgba(142,75,75,0.4);">Gecikti</span>' : ""}</div></div>
        <div><div class="form-label">Durum</div><div class="wo-spec-value">${statusBadge(wo.status)}</div></div>
        <div><div class="form-label">Oluşturulma</div><div class="wo-spec-value">${fmtDate(wo.created)}</div></div>
      </div>
      ${wo.image ? `<div style="margin-top:1rem;"><img src="${wo.image}" alt="Model" style="max-width:100%;border-radius:var(--radius-md);border:1px solid var(--color-border);"></div>` : ""}
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="wo-qr-wrap">
        <div id="wo-qr" class="wo-qr"></div>
        <div class="wo-qr-label">Makineci QR Tarama</div>
        <div style="font-size:0.62rem;color:var(--color-text-muted);margin-top:0.35rem;text-align:center;max-width:120px;line-height:1.3;">
          Telefonla okutunca iş emri açılır; dakika/gramaj girilip kaydedilir.
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card" style="margin-top:1.25rem;">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">Parça Kayıtları (Dakika)</div>
    <button class="btn btn-secondary btn-sm" onclick="APP_WO.addPiece('${wo.id}')">+ Parça Ekle</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Parça Adı</th><th style="text-align:right;">Dakika</th><th style="text-align:right;">Ham Boy (cm)</th><th>Kaydeden</th><th>Tarih</th><th style="width:60px;"></th></tr></thead>
      <tbody>
        ${(wo.pieces || []).map((p, i) => `<tr>
          <td style="font-weight:600;color:var(--color-text-main);">${esc(p.name)}</td>
          <td class="num" style="text-align:right;font-family:var(--font-numeric);">${fmtNumber(p.min)}</td>
          <td class="num" style="text-align:right;font-family:var(--font-numeric);color:var(--color-text-secondary);">${fmtNumber(p.len)}</td>
          <td style="font-size:0.8rem;color:var(--color-text-secondary);">${esc(p.user)}</td>
          <td style="font-size:0.75rem;color:var(--color-text-muted);">${fmtDate(p.ts ? p.ts.split("T")[0] : "")}</td>
          <td style="text-align:center;"><button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="APP_WO.removePiece('${wo.id}',${i})">Sil</button></td>
        </tr>`).join("") || `<tr><td colspan="6" style="padding:1.5rem;text-align:center;color:var(--color-text-muted);">Henüz parça kaydı yok</td></tr>`}
      </tbody>
    </table>
  </div>
</div>

<div class="card" style="margin-top:1.25rem;">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div class="panel-title">İplik Kullanımı (Gramaj)</div>
    <button class="btn btn-secondary btn-sm" onclick="APP_WO.addYarn('${wo.id}')">+ İplik Girişi</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>İplik Türü / Karışım</th><th style="text-align:right;">Gramaj (g)</th><th style="text-align:right;">Kon Adedi</th><th>Tarih</th><th style="width:60px;"></th></tr></thead>
      <tbody>
        ${(wo.yarnUsage || []).map((y, i) => `<tr>
          <td style="font-weight:600;color:var(--color-text-main);">${esc(y.type)}</td>
          <td class="num" style="text-align:right;font-family:var(--font-numeric);">${fmtNumber(y.gram)}</td>
          <td class="num" style="text-align:right;font-family:var(--font-numeric);color:var(--color-text-secondary);">${fmtNumber(y.cones)}</td>
          <td style="font-size:0.75rem;color:var(--color-text-muted);">${fmtDate(y.ts ? y.ts.split("T")[0] : "")}</td>
          <td style="text-align:center;"><button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="APP_WO.removeYarn('${wo.id}',${i})">Sil</button></td>
        </tr>`).join("") || `<tr><td colspan="5" style="padding:1.5rem;text-align:center;color:var(--color-text-muted);">Henüz iplik kullanımı kaydı yok</td></tr>`}
      </tbody>
    </table>
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

    // Firebase bulut senkronizasyonu (varsa)
    if (window.FIREBASE && window.__WO_FB_ATTACHED_ID !== wo.id) {
      window.__WO_FB_ATTACHED_ID = wo.id;
      const ref = window.FIREBASE.ref("workOrders/" + wo.id);
      ref.on("value", snap => {
        const d = snap.val();
        if (d) {
          if (Array.isArray(d.pieces)) wo.pieces = d.pieces;
          if (Array.isArray(d.yarnUsage)) wo.yarnUsage = d.yarnUsage;
          if (d.status) wo.status = d.status;
          persistWo(wo);
          window.APP.refresh();
        }
      });
    }

    // Firebase'dan veri yükle (varsa)
    if (window.FIREBASE && window.__WO_FB_LOADED_ID !== wo.id) {
      window.__WO_FB_LOADED_ID = wo.id;
      window.FIREBASE.ref("workOrders/" + wo.id).once("value").then(snap => {
        const d = snap.val();
        if (d) {
          if (Array.isArray(d.pieces)) wo.pieces = d.pieces;
          if (Array.isArray(d.yarnUsage)) wo.yarnUsage = d.yarnUsage;
          if (d.status) wo.status = d.status;
          persistWo(wo);
          window.APP.refresh();
        }
      }).catch(() => {});
    }

    const qrEl = document.getElementById("wo-qr");
    if (qrEl && window.QRCode) {
      qrEl.innerHTML = "";
      new QRCode(qrEl, {
        text: qrPayload(wo),
        width: 160,
        height: 160,
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

    window.APP_WO.exportData = function (id) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w) return;
      const rows = [];
      rows.push("Is Emri," + w.id);
      rows.push("Model," + (w.modelName || w.model));
      rows.push("Miktar," + w.qty);
      rows.push("GG," + w.gauge);
      rows.push("Termin," + w.deadline);
      rows.push("Durum," + w.status);
      rows.push("");
      rows.push("PARCA KAYITLARI");
      rows.push("Parca Adi,Dakika (dk),Ham Boy (cm),Kaydeden,Tarih");
      (w.pieces || []).forEach(p => rows.push([p.name, p.min, p.len, p.user, p.ts].map(v => '"' + String(v === null || v === undefined ? "" : v).replace(/"/g, '""') + '"').join(",")));
      rows.push("");
      rows.push("IPLIK KULLANIMI");
      rows.push("Iplik Turu,Gramaj (g),Kon Adedi,Tarih");
      (w.yarnUsage || []).forEach(y => rows.push([y.type, y.gram, y.cones, y.ts].map(v => '"' + String(v === null || v === undefined ? "" : v).replace(/"/g, '""') + '"').join(",")));
      const csv = "\uFEFF" + rows.join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "is-emri-" + w.id + ".csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast("Veriler indirildi: " + w.id);
      if (navigator.share) {
        try {
          const file = new File([blob], "is-emri-" + w.id + ".csv", { type: "text/csv" });
          navigator.share({ title: "Is Emri " + w.id, files: [file] }).catch(() => {});
        } catch (e) {}
      }
    };

    window.APP_WO.printWo = function (id) {
      const w = D.workOrders.find(x => x.id === id);
      if (!w) return;

      const qr = window.__WO_QR;
      const qrBlock = qr
        ? `<img src="${qr}" alt="QR" style="width:66px;height:66px;display:block;">`
        : `<div style="width:66px;height:66px;border:1px solid #242724;display:grid;place-items:center;font-size:7pt;">${esc(w.id)}</div>`;

      const pieceRows = (w.pieces || []).map(p =>
        `<tr><td>${esc(p.name)}</td><td style="text-align:right;">${fmtNumber(p.min)}</td><td style="text-align:right;">${fmtNumber(p.len)}</td><td>${esc(p.user)}</td><td>${fmtDate(p.ts ? p.ts.split("T")[0] : "")}</td></tr>`
      ).join("");
      const yarnRows = (w.yarnUsage || []).map(y =>
        `<tr><td>${esc(y.type)}</td><td style="text-align:right;">${fmtNumber(y.gram)}</td><td style="text-align:right;">${fmtNumber(y.cones)}</td><td>${fmtDate(y.ts ? y.ts.split("T")[0] : "")}</td></tr>`
      ).join("");

      const win = window.open("", "_blank", "width=900,height=1100");
      if (!win) { toast("Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin."); return; }
      win.document.write(`<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>${esc(w.id)} — ZERYTHA OS</title>
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
  th, td { border:1px solid #CFC9BD; padding:2mm 2.5mm; text-align:left; vertical-align:top; }
  th { background:#F1EEE7; font-weight:600; width:24%; }
  .muted { color:#6B6D67; font-size:8pt; }
  .print-btn { position:fixed; right:18px; bottom:18px; background:#B9955D; color:#090B0B; border:0; padding:10px 18px; font-weight:700; border-radius:4px; cursor:pointer; }
  @media print { .print-btn { display:none; } body { padding:0; } }
</style></head><body>
  <div class="head">
    <div><div class="brand">ZERYTHA</div><div class="sub">TRIKO, BİR YAŞAM TARZIDIR.</div></div>
    <div class="muted" style="text-align:right;">İş Emri<br>${esc(w.id)}<br>${fmtDate(new Date().toISOString().split("T")[0])}</div>
  </div>
  <h1>${esc(w.modelName || w.model)}</h1>
  <div class="muted">${esc(custName(w.custId))} · ${esc(w.season)} · ${esc(w.id)}</div>
  <table>
    <tr><th>Müşteri</th><td>${esc(custName(w.custId))}</td><th>İş Emri No</th><td>${esc(w.id)}</td></tr>
    <tr><th>Model Kodu</th><td>${esc(w.model)}</td><th>Model Adı</th><td>${esc(w.modelName || w.model)}</td></tr>
    <tr><th>Makine GG</th><td>${esc(w.gauge)}</td><th>İplik</th><td>${esc(yarnName(w.yarnId))}${w.yarnManual ? " · " + esc(w.yarnManual) : ""}</td></tr>
    <tr><th>Miktar</th><td>${fmtNumber(w.qty)} adet</td><th>Termin</th><td>${fmtDate(w.deadline)}</td></tr>
    <tr><th>Durum</th><td>${esc(w.status)}</td><th>Oluşturulma</th><td>${fmtDate(w.created)}</td></tr>
  </table>
  ${qr ? `<div style="margin-top:6mm;display:flex;align-items:center;gap:4mm;"><img src="${qr}" alt="QR" style="width:32mm;height:32mm;"><div class="muted">Makineci, QR kodu okutarak parça ve iplik kayıtlarını sisteme girer. Bu çıktı A4 olarak yazdırılabilir.</div></div>` : ""}
  ${pieceRows ? `<h2>Parça Kayıtları (Dakika)</h2><table><thead><tr><th>Parça Adı</th><th style="text-align:right;">Dakika</th><th style="text-align:right;">Ham Boy (cm)</th><th>Kaydeden</th><th>Tarih</th></tr></thead><tbody>${pieceRows}</tbody></table>` : ""}
  ${yarnRows ? `<h2>İplik Kullanımı (Gramaj)</h2><table><thead><tr><th>İplik Türü</th><th style="text-align:right;">Gramaj (g)</th><th style="text-align:right;">Kon Adedi</th><th>Tarih</th></tr></thead><tbody>${yarnRows}</tbody></table>` : ""}
  <p class="muted" style="margin-top:6mm;">Makineci, QR kodu okutarak parça ve iplik kayıtlarını sisteme girer. Bu çıktı A4 olarak yazdırılabilir.</p>
  <button class="print-btn" onclick="window.print()">Yazdır</button>
</body></html>`);
      win.document.close();
    };
  }

  window.VIEWS["workorder-detail"] = { render, mount };
})();