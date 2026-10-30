/* =========================================================================
   ZERYTHA OS — Yarn & Inventory Management (İplik & Envanter Yönetimi)
   Farklı dye lot'lar ayrı ayrı izlenir (aynı renk kodu olsa bile).
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtNumber, toast, $, $$, navigate } = window.APP;

  let yarnList = [...STATE.yarn];

  function render() {
    const lowStock = yarnList.filter(y => y.available < 200).length;
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">İplik &amp; Envanter Yönetimi</h1>
    <p class="page-subtitle">Dye lot bazlı izlenebilirlik, stok hareketleri ve düşük stok uyarıları</p>
  </div>
  <div class="page-actions">
    <span class="badge ${lowStock>0?'badge-delayed':'badge-quality'}" style="font-size:0.75rem;padding:0.35rem 0.8rem;">
      ${lowStock} Düşük Stok Uyarısı
    </span>
    <button class="btn btn-secondary btn-sm" onclick="APP_YARN.newReceipt()">Giriş Belgesi</button>
    <button class="btn btn-primary btn-sm" onclick="APP_YARN.newYarn()">Yeni İplik Kartı</button>
  </div>
</div>

<!-- Filters -->
<div class="card" style="margin-bottom:1.5rem;">
  <div class="card-body" style="padding:1rem 1.5rem;">
    <div class="form-row">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Arama (renk, lot, tedarikçi)</label>
        <input type="text" class="form-input" id="yarn-search" placeholder="Renk kodu, dye lot, tedarikçi...">
      </div>
      <div class="form-group" style="margin-bottom:0;display:flex;align-items:end;gap:0.5rem;">
        <button class="btn btn-secondary btn-sm" id="yarn-filter-apply">Uygula</button>
        <button class="btn btn-ghost btn-sm" id="yarn-filter-clear">Temizle</button>
      </div>
    </div>
  </div>
</div>

<!-- KPI strip -->
<div class="kpi-grid" style="margin-bottom:1.5rem;">
  <div class="kpi-card top-gold">
    <div class="kpi-label">Toplu İplik Kartı</div>
    <div class="kpi-value text-numeric">${yarnList.length}</div>
    <div class="kpi-delta">Dye lot bazlı</div>
  </div>
  <div class="kpi-card top-green">
    <div class="kpi-label">Mevcut Stok (kg)</div>
    <div class="kpi-value text-numeric">${fmtNumber(yarnList.reduce((a,b)=>a+b.available,0))}</div>
    <div class="kpi-delta pos">Net ağırlık</div>
  </div>
  <div class="kpi-card top-red">
    <div class="kpi-label">Düşük Stok</div>
    <div class="kpi-value text-numeric">${lowStock}</div>
    <div class="kpi-delta neg">200 kg altı</div>
  </div>
</div>

<!-- Table -->
<div class="card">
  <div class="card-body" style="padding:0;">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:11%;">İplik Kodu</th>
            <th style="width:14%;">İplik Türü / Bileşim</th>
            <th style="width:10%;">Numara</th>
            <th style="width:9%;">Renk Kodu</th>
            <th style="width:11%;">Dye Lot</th>
            <th style="width:13%;">Tedarikçi</th>
            <th style="width:8%;">Kon</th>
            <th style="width:9%;">Brüt (kg)</th>
            <th style="width:9%;">Net (kg)</th>
            <th style="width:9%;">Mevcut</div>
            <th style="width:10%;">Depo Konumu</th>
          </tr>
        </thead>
        <tbody id="yarn-table-body"></tbody>
      </table>
    </div>
  </div>
</div>

<div class="card" style="margin-top:1.5rem;">
  <div class="card-body">
    <div class="section-title">Son Stok Hareketleri</div>
    <div style="display:flex;flex-direction:column;gap:0.6rem;">
      <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1F221F;">
        <div><div style="font-weight:600;color:var(--color-text-main);">GİR-2026-0112</div><div style="font-size:0.75rem;color:var(--color-text-secondary);">Pamuklu İplik — Ivory</div></div>
        <div style="text-align:right;"><div style="font-weight:600;color:var(--color-success);">+420 kon</div><div style="font-size:0.7rem;color:var(--color-text-muted);">20.10.2026</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1F221F;">
        <div><div style="font-weight:600;color:var(--color-text-main);">TÜK-2026-0110</div><div style="font-size:0.75rem;color:var(--color-text-secondary);">Merino Yün — Noir</div></div>
        <div style="text-align:right;"><div style="font-weight:600;color:var(--color-error);">-140 kon</div><div style="font-size:0.7rem;color:var(--color-text-muted);">19.10.2026</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;padding:0.625rem 0;">
        <div><div style="font-weight:600;color:var(--color-text-main);">RET-2026-0109</div><div style="font-size:0.75rem;color:var(--color-text-secondary);">İade — Champagne</div></div>
        <div style="text-align:right;"><div style="font-weight:600;color:var(--color-warning);">+30 kon</div><div style="font-size:0.7rem;color:var(--color-text-muted);">18.10.2026</div></div>
      </div>
    </div>
  </div>
</div>
`;
  }

  function mount() {
    renderTable();
    $("#yarn-search").addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      yarnList = STATE.yarn.filter(y =>
        y.color.toLowerCase().includes(q) ||
        y.dyeLot.toLowerCase().includes(q) ||
        y.supplier.toLowerCase().includes(q) ||
        y.type.toLowerCase().includes(q)
      );
      renderTable();
    });
    $("#yarn-filter-apply").addEventListener("click", () => {
      const q = ($("#yarn-search").value || "").toLowerCase().trim();
      yarnList = STATE.yarn.filter(y =>
        !q || y.color.toLowerCase().includes(q) ||
        y.dyeLot.toLowerCase().includes(q) ||
        y.supplier.toLowerCase().includes(q) ||
        y.type.toLowerCase().includes(q)
      );
      renderTable();
    });
    $("#yarn-filter-clear").addEventListener("click", () => {
      $("#yarn-search").value = "";
      yarnList = [...STATE.yarn];
      renderTable();
    });
  }

  function renderTable() {
    const tbody = document.getElementById("yarn-table-body");
    if (!tbody) return;
    tbody.innerHTML = yarnList.map(y => {
      const low = y.available < 200;
      return `<tr>
        <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${y.id}</td>
        <td style="color:var(--color-text-main);font-size:0.8125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${y.type} <span style="font-size:0.7rem;color:var(--color-text-muted);">(${y.composition})</span></td>
        <td style="color:var(--color-text-main);font-size:0.8125rem;">${y.count}</td>
        <td style="color:var(--color-text-main);font-size:0.8125rem;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${y.color==='Ivory'?'#F1EEE7':y.color==='Noir'?'#090B0B':y.color==='Champagne'?'#D2B47A':y.color==='Antique Gold'?'#B9955D':y.color==='Navy'?'#1F2A33':'#ccc'};border:1px solid #242724;margin-right:6px;vertical-align:middle;"></span>${y.color}</td>
        <td style="font-family:var(--font-numeric);font-weight:600;color:var(--color-gold);">${y.dyeLot}</td>
        <td style="color:var(--color-text-main);font-size:0.8125rem;">${y.supplier}</td>
        <td style="font-family:var(--font-numeric);">${fmtNumber(y.cones)}</td>
        <td style="font-family:var(--font-numeric);">${fmtNumber(y.gross)}</td>
        <td style="font-family:var(--font-numeric);">${fmtNumber(y.net)}</td>
        <td style="font-family:var(--font-numeric);font-weight:600;color:${low?'var(--color-error)':'var(--color-text-main)'};">${fmtNumber(y.available)}${low?' ⚠':''}</td>
        <td style="color:var(--color-text-secondary);font-size:0.75rem;white-space:nowrap;">${y.location}</td>
      </tr>`;
    }).join("");
  }

  window.APP_YARN = {
    newYarn() {
      window.APP.openFormModal({
        title: "Yeni İplik Kartı",
        submitLabel: "İpliği Kaydet",
        fields: [
          { name: "type", label: "İplik Türü", required: true, placeholder: "Ör. %100 Kaşmir" },
          { name: "composition", label: "Kompozisyon", required: true, placeholder: "Ör. %100 Kaşmir" },
          { name: "count", label: "Numara / Count", required: true, placeholder: "Nm 2/28" },
          { name: "color", label: "Renk", required: true, placeholder: "Ivory" },
          { name: "dyeLot", label: "Dye Lot", required: true, placeholder: "DL-2026-XXX" },
          { name: "supplier", label: "Tedarikçi", type: "select", required: true,
            options: (STATE.suppliers.length ? STATE.suppliers.map(s => ({ value: s.name, label: s.name })) : [{ value: "", label: "Tedarikçi yok" }]) },
          { name: "cones", label: "Kon Adedi", type: "number", min: 0, required: true, value: 0 },
          { name: "gross", label: "Brüt Ağırlık (kg)", type: "number", min: 0, step: 0.1, required: true, value: 0 },
          { name: "net", label: "Net Ağırlık (kg)", type: "number", min: 0, step: 0.1, required: true, value: 0 },
          { name: "available", label: "Kullanılabilir (kg)", type: "number", min: 0, step: 0.1, required: true, value: 0 },
          { name: "location", label: "Depo Konumu", required: true, placeholder: "A-Raf-01" }
        ],
        onSubmit(data) {
          if (STATE.suppliers.length && !data.supplier) { toast("Tedarikçi seçin."); return false; }
          const next = STATE.yarn.reduce((m, y) => {
            const n = parseInt(String(y.id).replace("Y-", ""), 10);
            return isNaN(n) ? m : Math.max(m, n);
          }, 0) + 1;
          const yarn = {
            id: "Y-" + String(next).padStart(3, "0"),
            type: data.type,
            composition: data.composition,
            count: data.count,
            color: data.color,
            dyeLot: data.dyeLot,
            supplier: data.supplier,
            cones: Math.max(0, Number(data.cones) || 0),
            gross: Math.max(0, Number(data.gross) || 0),
            net: Math.max(0, Number(data.net) || 0),
            available: Math.max(0, Number(data.available) || 0),
            reserved: 0,
            location: data.location
          };
          STATE.yarn.push(yarn);
          yarnList = [...STATE.yarn];
          renderTable();
          toast("İplik kartı oluşturuldu: " + yarn.id);
        }
      });
    },

    newReceipt() {
      if (!STATE.yarn.length) { toast("Önce iplik kartı oluşturun."); return; }
      window.APP.openFormModal({
        title: "İplik Giriş Belgesi",
        submitLabel: "Girişi Kaydet",
        fields: [
          { name: "yarnId", label: "İplik Kartı", type: "select", required: true, full: true,
            options: STATE.yarn.map(y => ({ value: y.id, label: y.id + " — " + y.composition + " " + y.count + " · " + y.dyeLot })) },
          { name: "cones", label: "Gelen Kon Adedi", type: "number", min: 0, required: true, value: 0 },
          { name: "gross", label: "Gelen Brüt (kg)", type: "number", min: 0, step: 0.1, required: true, value: 0 },
          { name: "net", label: "Gelen Net (kg)", type: "number", min: 0, step: 0.1, required: true, value: 0 },
          { name: "available", label: "Kullanılabilir Eklenecek (kg)", type: "number", min: 0, step: 0.1, required: true, value: 0 },
          { name: "location", label: "Depo Konumu", required: true, placeholder: "A-Raf-01" }
        ],
        onSubmit(data) {
          const yarn = STATE.yarn.find(y => y.id === data.yarnId);
          if (!yarn) { toast("İplik kartı bulunamadı."); return false; }
          yarn.cones += Math.max(0, Number(data.cones) || 0);
          yarn.gross += Math.max(0, Number(data.gross) || 0);
          yarn.net += Math.max(0, Number(data.net) || 0);
          yarn.available += Math.max(0, Number(data.available) || 0);
          yarn.location = data.location || yarn.location;
          yarnList = [...STATE.yarn];
          renderTable();
          toast("Giriş belgesi kaydedildi: " + yarn.id);
        }
      });
    }
  };

  window.VIEWS.yarn = { render, mount };
})();
