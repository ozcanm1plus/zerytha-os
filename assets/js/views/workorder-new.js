/* =========================================================================
   ZERYTHA OS — Yeni / Düzenle İş Emri
   ========================================================================= */
(function () {
  const { fmtNumber, toast } = window.APP;
  const D = window.WORK_DATA;

  let selectedImage = null;
  let editingId = null;

  function esc(t) {
    if (t === null || t === undefined) return "";
    return String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function render() {
    const q = window.APP.getQuery();
    const editing = q.id ? D.workOrders.find(w => w.id === q.id) : null;
    editingId = editing ? editing.id : null;

    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">${editing ? "İş Emri Düzenle" : "Yeni İş Emri"}</h1>
    <p class="page-subtitle">${editing ? editing.id + " numaralı iş emrini güncelleyin" : "Müşteri, sezon ve model bilgileriyle iş emri oluşturun"}</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('${editing ? "/workorder-detail?id=" + encodeURIComponent(editing.id) : "/workorders"}')">← Vazgeç</button>
  </div>
</div>

<div class="card" style="max-width:880px;margin:0 auto;">
  <div class="card-body" style="padding:1.6rem 2rem 2rem;">
    <form id="wo-form" novalidate>
      <div class="section-title" style="margin-bottom:1.25rem;">1. Müşteri &amp; Sezon</div>
      <div class="form-row wo-form-row">
        <div class="form-group">
          <label class="form-label" for="wo-customer">Müşteri / Marka</label>
          <select class="form-select" id="wo-customer" required>
            <option value="">Müşteri seçin</option>
            ${D.customers.map(c => `<option value="${c.id}" ${editing && editing.custId === c.id ? "selected" : ""}>${esc(c.name)} (${esc(c.code)})</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="wo-season">Sezon</label>
          <select class="form-select" id="wo-season" required>
            <option value="">Sezon seçin</option>
            ${D.seasons.map(s => `<option value="${esc(s)}" ${editing && editing.season === s ? "selected" : ""}>${esc(s)}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="wo-model">Model Kodu</label>
          <input type="text" class="form-input" id="wo-model" placeholder="Örn. MK-9021" value="${editing ? esc(editing.model) : ""}" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="wo-modelname">Model Adı</label>
          <input type="text" class="form-input" id="wo-modelname" placeholder="Örn. Cashmere Polo" value="${editing ? esc(editing.modelName) : ""}" required>
        </div>
      </div>

      <div class="section-title" style="margin:2rem 0 1.25rem;">2. Teknik Özellikler</div>
      <div class="form-row wo-form-row">
        <div class="form-group">
          <label class="form-label" for="wo-yarn">İplik Türü</label>
          <select class="form-select" id="wo-yarn" required>
            <option value="">Depodan iplik seçin</option>
            ${D.yarnTypes.map(y => `<option value="${y.id}" ${editing && editing.yarnId === y.id ? "selected" : ""}>${esc(y.name)} — ${esc(y.stock)} (${esc(y.location)})</option>`).join("")}
            <option value="manual" ${editing && editing.yarnId === "manual" ? "selected" : ""}>Elle gir / dış kaynaklı</option>
          </select>
          <div class="form-hint">Depo stoğundan seçebilir veya elle girebilirsiniz.</div>
        </div>
        <div class="form-group" id="wo-yarn-manual-wrap" style="display:${editing && editing.yarnId === "manual" ? "block" : "none"};">
          <label class="form-label" for="wo-yarn-manual">İplik Cinsi (Elle)</label>
          <input type="text" class="form-input" id="wo-yarn-manual" placeholder="Örn. %100 Pamuk Nm 2/28" value="${editing ? esc(editing.yarnManual) : ""}">
        </div>
        <div class="form-group">
          <label class="form-label" for="wo-gauge">Makine GG</label>
          <select class="form-select" id="wo-gauge" required>
            <option value="">GG seçin</option>
            ${D.gauges.map(g => `<option value="${g}" ${editing && editing.gauge === g ? "selected" : ""}>${g}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="wo-qty">Miktar (adet)</label>
          <input type="number" class="form-input" id="wo-qty" min="1" step="1" value="${editing ? editing.qty : 100}" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="wo-deadline">Termin Tarihi</label>
          <input type="date" class="form-input" id="wo-deadline" value="${editing ? esc(editing.deadline) : ""}" required>
        </div>
      </div>

      <div class="section-title" style="margin:2rem 0 1.25rem;">3. Model Görseli</div>
      <div class="form-row wo-form-row">
        <div class="form-group" style="min-width:260px;">
          <label class="form-label">Görsel Yükle</label>
          <div id="wo-img-preview" class="wo-upload-preview">
            ${editing && editing.image ? `<img src="${esc(editing.image)}" alt="">` : `<span>Yok</span>`}
          </div>
          <div style="display:flex;align-items:center;gap:0.9rem;flex-wrap:wrap;">
            <label class="wo-upload-label">
              <input type="file" id="wo-image" accept="image/*" style="display:none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Dosya seç
            </label>
            <button type="button" class="btn btn-ghost btn-sm" id="wo-img-clear" style="color:var(--color-text-muted);">Görseli kaldır</button>
          </div>
          <div class="form-hint">JPG veya PNG. Görsel iş emri çıktısında da görünür.</div>
        </div>
      </div>

      <div style="margin-top:2.25rem;display:flex;gap:0.75rem;justify-content:flex-end;border-top:1px solid var(--color-border);padding-top:1.25rem;">
        <button type="button" class="btn btn-secondary" onclick="window.APP.navigate('${editing ? "/workorder-detail?id=" + encodeURIComponent(editing.id) : "/workorders"}')">İptal</button>
        <button type="submit" class="btn btn-primary">${editing ? "Değişiklikleri Kaydet" : "İş Emri Oluştur"}</button>
      </div>
    </form>
  </div>
</div>
`;
  }

  function mount() {
    const editing = editingId ? D.workOrders.find(w => w.id === editingId) : null;
    selectedImage = editing && editing.image ? editing.image : null;

    const form = document.getElementById("wo-form");
    const yarnSelect = document.getElementById("wo-yarn");
    const manualWrap = document.getElementById("wo-yarn-manual-wrap");
    const manualInput = document.getElementById("wo-yarn-manual");
    const imgInput = document.getElementById("wo-image");
    const imgPreview = document.getElementById("wo-img-preview");
    const imgClear = document.getElementById("wo-img-clear");
    const deadline = document.getElementById("wo-deadline");
    if (!form || !yarnSelect || !manualWrap || !manualInput || !imgInput || !imgPreview || !deadline) return;

    if (!deadline.value) {
      const plus10 = new Date(Date.now() + 10 * 86400000);
      deadline.value = plus10.toISOString().split("T")[0];
    }

    function paintPreview(src) {
      if (src) {
        imgPreview.innerHTML = `<img src="${src}" alt="">`;
        imgPreview.classList.add("has-image");
      } else {
        imgPreview.innerHTML = `<span>Yok</span>`;
        imgPreview.classList.remove("has-image");
      }
    }

    yarnSelect.addEventListener("change", () => {
      const manual = yarnSelect.value === "manual";
      manualWrap.style.display = manual ? "block" : "none";
      if (!manual) manualInput.value = "";
    });

    imgInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) { toast("Lütfen bir görsel dosyası seçin."); return; }
      if (file.size > 4 * 1024 * 1024) { toast("Görsel 4 MB'dan küçük olmalı."); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        selectedImage = ev.target.result;
        paintPreview(selectedImage);
      };
      reader.readAsDataURL(file);
    });

    if (imgClear) {
      imgClear.addEventListener("click", () => {
        selectedImage = null;
        imgInput.value = "";
        paintPreview(null);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const customerId = document.getElementById("wo-customer").value;
      const season = document.getElementById("wo-season").value;
      const model = document.getElementById("wo-model").value.trim();
      const modelName = document.getElementById("wo-modelname").value.trim();
      const yarnId = yarnSelect.value;
      const yarnManual = manualInput.value.trim();
      const gauge = document.getElementById("wo-gauge").value;
      const qty = parseInt(document.getElementById("wo-qty").value, 10) || 0;
      const due = deadline.value;

      if (!customerId || !season || !model || !modelName || !yarnId || !gauge || !due) {
        toast("Lütfen zorunlu alanları doldurun.");
        return;
      }
      if (qty < 1) { toast("Miktar en az 1 adet olmalı."); return; }
      if (yarnId === "manual" && !yarnManual) { toast("Lütfen iplik cinsini girin."); return; }

      if (editing) {
        editing.custId = customerId;
        editing.season = season;
        editing.model = model;
        editing.modelName = modelName;
        editing.yarnId = yarnId;
        editing.yarnManual = yarnId === "manual" ? yarnManual : "";
        editing.gauge = gauge;
        editing.qty = qty;
        editing.deadline = due;
        editing.image = selectedImage;
        toast("İş emri güncellendi: " + editing.id);
        window.APP.navigate("/workorder-detail?id=" + encodeURIComponent(editing.id));
        return;
      }

      const year = new Date().getFullYear();
      let code = "WO-" + year + "-" + String(Math.floor(1000 + Math.random() * 9000));
      while (D.workOrders.some(w => w.id === code)) {
        code = "WO-" + year + "-" + String(Math.floor(1000 + Math.random() * 9000));
      }

      const wo = {
        id: code,
        custId: customerId,
        season,
        model,
        modelName,
        yarnId,
        yarnManual: yarnId === "manual" ? yarnManual : "",
        gauge,
        qty,
        deadline: due,
        image: selectedImage,
        status: "Açık",
        created: new Date().toISOString().split("T")[0],
        pieces: [],
        yarnUsage: []
      };

      D.workOrders.unshift(wo);
      toast("İş emri oluşturuldu: " + code);
      window.APP.navigate("/workorder-detail?id=" + encodeURIComponent(code));
    });
  }

  window.VIEWS["workorder-new"] = { render, mount };
})();
