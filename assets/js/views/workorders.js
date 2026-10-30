/* =========================================================================
   ZERYTHA OS — İş Emirleri (Work Orders)
   Mağaza tarzı görsel klasör yapısı: Müşteri → Sezon → Model → İş Emri
   ========================================================================= */
(function () {
  const { fmtDate, fmtNumber, toast } = window.APP;
  const D = window.WORK_DATA;

  window.APP_WO = window.APP_WO || {};

  function esc(t) {
    if (t === null || t === undefined) return "";
    return String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function custName(id) {
    const c = D.customers.find(x => x.id === id);
    return c ? c.name : "—";
  }

  function statusBadge(status) {
    const open = status === "Açık";
    return `<span class="badge ${open ? "badge-production" : "badge-completed"}">${esc(status)}</span>`;
  }

  // ---- Gezinme durumu (mağaza tarzı drill-down) ----
  let level = "customers"; // customers | seasons | models | orders
  let selCustomer = null;
  let selSeason = null;
  let selModel = null;

  const HERO_POS = ["10%", "28%", "46%", "64%", "82%"];
  const MODEL_IMG = ["product-1.jpg", "product-2.jpg", "product-3.jpg", "product-4.jpg", "product-5.jpg", "product-6.jpg"];

  function modelImage(code) {
    let h = 0;
    for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
    return "assets/img/" + MODEL_IMG[h % MODEL_IMG.length];
  }

  function goCustomers() {
    level = "customers"; selCustomer = null; selSeason = null; selModel = null;
    window.APP.refresh();
  }
  function goSeasons() {
    level = "seasons"; selSeason = null; selModel = null;
    window.APP.refresh();
  }
  function goModels() {
    level = "models"; selModel = null;
    window.APP.refresh();
  }
  function openCustomer(id) {
    selCustomer = id; level = "seasons"; selSeason = null; selModel = null;
    window.APP.refresh();
  }
  function openSeason(season) {
    selSeason = season; level = "models"; selModel = null;
    window.APP.refresh();
  }
  function openModel(model) {
    selModel = model; level = "orders";
    window.APP.refresh();
  }

  function groupsForCustomer(custId) {
    return D.workOrders.filter(w => w.custId === custId);
  }

  function renderCustomers() {
    const groups = D.customers
      .map(c => ({ customer: c, wos: D.workOrders.filter(w => w.custId === c.id) }))
      .filter(g => g.wos.length)
      .sort((a, b) => b.wos.length - a.wos.length);

    if (!groups.length) {
      return `<div class="empty-state" style="padding:2.5rem 1rem;">
        <div class="empty-title">Henüz iş emri yok</div>
        <div class="empty-desc">Yeni iş emri oluşturarak müşteri klasörlerini açın.</div>
      </div>`;
    }

    return `
      <div class="wo-visual-grid">
        ${groups.map((g, i) => {
          const openCount = g.wos.filter(w => w.status === "Açık").length;
          return `
          <div class="wo-folder-card" onclick="APP_WO.openCustomer('${g.customer.id}')" role="button" tabindex="0">
            <div class="wo-folder-thumb" style="background: url('assets/img/hero-knitwear.jpg') center ${HERO_POS[i % HERO_POS.length]} / cover no-repeat;">
              <div class="wo-folder-overlay"></div>
              <span class="wo-folder-badge">${g.wos.length} iş emri</span>
            </div>
            <div class="wo-folder-body">
              <div class="wo-folder-title">${esc(g.customer.name)}</div>
              <div class="wo-folder-sub">${esc(g.customer.code)} · ${openCount} açık</div>
            </div>
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderSeasons() {
    const wos = groupsForCustomer(selCustomer);
    const seasons = [...new Set(wos.map(w => w.season))].sort();
    const customer = D.customers.find(c => c.id === selCustomer);

    return `
      <div class="wo-breadcrumb">
        <button onclick="APP_WO.goCustomers()">Müşteriler</button>
        <span class="sep">/</span>
        <span>${esc(customer ? customer.name : selCustomer)}</span>
      </div>
      <div class="wo-visual-grid">
        ${seasons.map((season, i) => {
          const sw = wos.filter(w => w.season === season);
          const openCount = sw.filter(w => w.status === "Açık").length;
          return `
          <div class="wo-folder-card" onclick="APP_WO.openSeason('${esc(season).replace(/'/g, "\\'")}')" role="button" tabindex="0">
            <div class="wo-folder-thumb" style="background: url('assets/img/hero-knitwear.jpg') center ${HERO_POS[(i + 2) % HERO_POS.length]} / cover no-repeat;">
              <div class="wo-folder-overlay"></div>
              <span class="wo-folder-badge">${sw.length}</span>
            </div>
            <div class="wo-folder-body">
              <div class="wo-folder-title">${esc(season)}</div>
              <div class="wo-folder-sub">${sw.length} iş emri · ${openCount} açık</div>
            </div>
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderModels() {
    const wos = groupsForCustomer(selCustomer).filter(w => w.season === selSeason);
    const models = [...new Set(wos.map(w => w.model))].sort();
    const customer = D.customers.find(c => c.id === selCustomer);

    return `
      <div class="wo-breadcrumb">
        <button onclick="APP_WO.goCustomers()">Müşteriler</button>
        <span class="sep">/</span>
        <button onclick="APP_WO.goSeasons()">${esc(customer ? customer.name : selCustomer)}</button>
        <span class="sep">/</span>
        <span>${esc(selSeason)}</span>
      </div>
      <div class="wo-visual-grid">
        ${models.map(model => {
          const mw = wos.filter(w => w.model === model);
          const openCount = mw.filter(w => w.status === "Açık").length;
          const modelName = (mw[0] && (mw[0].modelName || mw[0].model)) || model;
          return `
          <div class="wo-folder-card" onclick="APP_WO.openModel('${esc(model).replace(/'/g, "\\'")}')" role="button" tabindex="0">
            <div class="wo-folder-thumb" style="background: url('${modelImage(model)}') center / cover no-repeat;">
              <div class="wo-folder-overlay"></div>
              <span class="wo-folder-badge">${mw.length}</span>
            </div>
            <div class="wo-folder-body">
              <div class="wo-folder-title">${esc(model)}</div>
              <div class="wo-folder-sub">${esc(modelName)} · ${openCount} açık</div>
            </div>
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderOrders() {
    const wos = groupsForCustomer(selCustomer)
      .filter(w => w.season === selSeason && w.model === selModel)
      .sort((a, b) => (a.status === "Açık" ? 0 : 1) - (b.status === "Açık" ? 0 : 1));
    const customer = D.customers.find(c => c.id === selCustomer);
    const openCount = wos.filter(w => w.status === "Açık").length;

    return `
      <div class="wo-breadcrumb">
        <button onclick="APP_WO.goCustomers()">Müşteriler</button>
        <span class="sep">/</span>
        <button onclick="APP_WO.goSeasons()">${esc(customer ? customer.name : selCustomer)}</button>
        <span class="sep">/</span>
        <button onclick="APP_WO.goModels()">${esc(selSeason)}</button>
        <span class="sep">/</span>
        <span>${esc(selModel)}</span>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap;">
        <div>
          <div style="font-family:var(--font-serif);font-size:1.35rem;font-weight:600;color:var(--color-text-main);">${esc(selModel)}</div>
          <div style="font-size:0.8rem;color:var(--color-text-muted);margin-top:0.2rem;">${wos.length} iş emri · ${openCount} açık</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="APP_WO.newWorkOrder()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Yeni İş Emri
        </button>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        ${wos.map(wo => `
          <div class="wo-order-card" onclick="APP_WO.openDetail('${wo.id}')" role="button" tabindex="0">
            <div class="wo-id">${esc(wo.id)}</div>
            <div class="wo-info" style="flex:1;min-width:0;">
              <div class="wo-model-name">${esc(wo.modelName || wo.model)}</div>
              <div class="wo-meta">${fmtNumber(wo.qty)} adet · ${esc(wo.gauge)} · Termin ${fmtDate(wo.deadline)}</div>
            </div>
            ${statusBadge(wo.status)}
            <svg class="wo-row-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
          </div>`).join("") || `<div class="empty-state" style="padding:2rem 1rem;"><div class="empty-title">Bu model için iş emri yok</div></div>`}
      </div>`;
  }

  function renderTree() {
    if (level === "customers") return renderCustomers();
    if (level === "seasons") return renderSeasons();
    if (level === "models") return renderModels();
    return renderOrders();
  }

  function render() {
    const total = D.workOrders.length;
    const open = D.workOrders.filter(w => w.status === "Açık").length;
    const done = total - open;
    const models = new Set(D.workOrders.map(w => w.model)).size;
    const now = new Date();
    const late = D.workOrders.filter(w => w.status === "Açık" && new Date(w.deadline) < now).length;

    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">İş Emirleri</h1>
    <p class="page-subtitle">Müşteri → Sezon → Model → İş Emri · görsel klasör yapısı</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('/orders')">← Siparişlere Dön</button>
    <button class="btn btn-primary btn-sm" onclick="APP_WO.newWorkOrder()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Yeni İş Emri
    </button>
  </div>
</div>

<div class="wo-stats">
  <div class="wo-stat"><span>Toplam İş Emri</span><strong>${fmtNumber(total)}</strong></div>
  <div class="wo-stat"><span>Açık</span><strong>${fmtNumber(open)}</strong></div>
  <div class="wo-stat"><span>Tamamlanan</span><strong>${fmtNumber(done)}</strong></div>
  <div class="wo-stat ${late ? "is-risk" : ""}"><span>Termin Geçmiş</span><strong>${fmtNumber(late)}</strong></div>
</div>

<div class="card">
  <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.35rem;border-bottom:1px solid var(--color-border);">
    <div>
      <div class="panel-title">İş Emri Klasörleri</div>
      <div style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.2rem;">${models} model · ${D.customers.length} müşteri</div>
    </div>
    <div style="font-size:0.72rem;color:var(--color-text-muted);letter-spacing:0.08em;text-transform:uppercase;">${level === "customers" ? "Müşteri seçin" : level === "seasons" ? "Sezon seçin" : level === "models" ? "Model seçin" : "İş emirleri"}</div>
  </div>
  <div class="card-body" style="padding:1.25rem;">
    ${renderTree()}
  </div>
</div>
`;
  }

  function mount() {
    window.APP_WO.newWorkOrder = function () {
      window.APP.navigate("/workorder-new");
    };
    window.APP_WO.openDetail = function (id) {
      if (!id) { toast("İş emri bulunamadı."); return; }
      window.APP.navigate("/workorder-detail?id=" + encodeURIComponent(id));
    };
    window.APP_WO.openCustomer = openCustomer;
    window.APP_WO.openSeason = openSeason;
    window.APP_WO.openModel = openModel;
    window.APP_WO.goCustomers = goCustomers;
    window.APP_WO.goSeasons = goSeasons;
    window.APP_WO.goModels = goModels;
  }

  window.VIEWS.workorders = { render, mount };
})();
