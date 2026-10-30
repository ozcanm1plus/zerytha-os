/* =========================================================================
   ZERYTHA OS — Dashboard (Kontrol Paneli)
   ========================================================================= */
(function () {
  const { STATE, fmtDate, fmtMoney, fmtNumber, toast } = window.APP;

  const STATUS_CLASS = {
    Quotation: "badge-quotation",
    "Awaiting Approval": "badge-approval",
    "Material Planning": "badge-planning",
    Production: "badge-production",
    "Quality Control": "badge-quality",
    Packaging: "badge-packaging",
    "Ready to Ship": "badge-ship",
    Completed: "badge-completed"
  };
  const STATUS_LABEL = {
    Quotation: "Teklif",
    "Awaiting Approval": "Onay Bekliyor",
    "Material Planning": "Malzeme Planlama",
    Production: "Üretim",
    "Quality Control": "Kalite",
    Packaging: "Paketleme",
    "Ready to Ship": "Teslime Hazır",
    Completed: "Tamamlandı"
  };

  function badge(status) {
    return `<span class="badge ${STATUS_CLASS[status] || "badge-quotation"}">${STATUS_LABEL[status] || status}</span>`;
  }

  function esc(t) {
    if (t === null || t === undefined) return "";
    return String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  /* --- Hesaplanan veriler (STATE'den) --- */
  function computeData() {
    const orders = STATE.orders;

    const active = orders.filter(o => o.status !== "Completed").length;
    const inProduction = STATE.production.filter(p => p.done < p.qty).length;
    const yarnKg = STATE.yarn.reduce((s, y) => s + y.available, 0);
    const risks = STATE.production.filter(p => p.done < p.qty && (p.delayed || new Date(p.planned) < new Date())).length;
    const completedOrders = orders.filter(o => o.status === "Completed").length;
    const lowYarnCount = STATE.yarn.filter(y => y.available < 200).length;

    // Sipariş durum dağılımı
    const dist = [
      { key: "Üretimde", value: orders.filter(o => o.status === "Production").length, color: "#B9955D" },
      { key: "Tamamlandı", value: orders.filter(o => o.status === "Completed").length, color: "#5C7A5C" },
      { key: "Bekleyen", value: orders.filter(o => o.status === "Quotation" || o.status === "Awaiting Approval" || o.status === "Material Planning").length, color: "#4A4F4A" },
      { key: "Kalite/Paket", value: orders.filter(o => o.status === "Quality Control" || o.status === "Packaging" || o.status === "Ready to Ship").length, color: "#2B2E2B" }
    ];
    const distTotal = dist.reduce((s, d) => s + d.value, 0) || 1;

    // Haftalık satış (sipariş değerlerinden türetilmiş)
    const base = Math.round(orders.reduce((s, o) => s + o.value, 0) / 7) || 1;
    const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    const multipliers = [0.62, 0.78, 0.55, 0.92, 1.0, 0.44, 0.18];
    const weekly = days.map((d, i) => ({ day: d, value: Math.round(base * multipliers[i]) }));
    const maxWeekly = Math.max(...weekly.map(w => w.value));

    return { active, inProduction, yarnKg, risks, completedOrders, lowYarnCount, dist, distTotal, weekly, maxWeekly };
  }

  function render() {
    const d = computeData();

    const activeOrders = STATE.orders.filter(o => o.status !== "Completed");
    const recent = STATE.orders.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
    const lowYarn = STATE.yarn.filter(y => y.available < 200).slice(0, 4);
    const runningProd = STATE.production.slice(0, 4);
    const upcoming = activeOrders
      .slice()
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);
    const qualityPending = STATE.orders.filter(o => o.status === "Quality Control");

    const donutStops = (() => {
      let acc = 0;
      return d.dist.map(x => {
        const from = (acc / d.distTotal) * 100;
        acc += x.value;
        const to = (acc / d.distTotal) * 100;
        return `${x.color} ${from.toFixed(2)}% ${to.toFixed(2)}%`;
      }).join(", ");
    })();

    return `
<div class="hero">
  <div class="hero-content">
    <div class="hero-eyebrow">Est. 1998 · Bursa</div>
    <img src="assets/img/brand-mark.png" alt="Zerytha" style="height:120px;width:auto;object-fit:contain;margin-bottom:0.75rem;opacity:0.95;">
    <div class="hero-title">ZERYTHA</div>
    <div class="hero-tagline">TRIKO, BİR YAŞAM TARZIDIR.</div>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <div class="hero-meta-label">Aktif Sipariş</div>
        <div class="hero-meta-value">${fmtNumber(d.active)}</div>
      </div>
      <div class="hero-meta-item">
        <div class="hero-meta-label">Üretimde</div>
        <div class="hero-meta-value">${fmtNumber(d.inProduction)}</div>
      </div>
      <div class="hero-meta-item">
        <div class="hero-meta-label">Termin Riski</div>
        <div class="hero-meta-value" style="color:${d.risks ? "var(--color-error)" : "var(--color-text-main)"};">${fmtNumber(d.risks)}</div>
      </div>
    </div>
  </div>
</div>

<div class="kpi-strip">
  <div class="kpi">
    <div class="kpi-top">
      <span class="kpi-name">Aktif Sipariş</span>
      <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect></svg>
    </div>
    <div class="kpi-num">${fmtNumber(d.active)}<small> adet</small></div>
    <div class="kpi-foot">${fmtNumber(d.completedOrders)} tamamlandı · ${STATE.customers.length} müşteri</div>
  </div>

  <div class="kpi">
    <div class="kpi-top">
      <span class="kpi-name">Üretim İş Emri</span>
      <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    </div>
    <div class="kpi-num">${fmtNumber(d.inProduction)}<small> hat</small></div>
    <div class="kpi-foot">${STATE.production.length} iş emri · 6 aşama</div>
  </div>

  <div class="kpi is-good">
    <div class="kpi-top">
      <span class="kpi-name">İplik Stok</span>
      <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 1 0 18"></path><path d="M8 6c3 3 3 9 0 12"></path></svg>
    </div>
    <div class="kpi-num">${fmtNumber(d.yarnKg)}<small> kg</small></div>
    <div class="kpi-foot">${STATE.yarn.length} parti · ${d.lowYarnCount} kritik</div>
  </div>

  <div class="kpi ${d.risks ? "is-risk" : ""}">
    <div class="kpi-top">
      <span class="kpi-name">Termin Riski</span>
      <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    </div>
    <div class="kpi-num">${fmtNumber(d.risks)}<small> üretim</small></div>
    <div class="kpi-foot">${d.risks ? '<span class="down">acil müdahale</span> gerekli' : '<span class="up">takip</span> gerekmiyor'}</div>
  </div>
</div>

<div class="dash-grid-2">
  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Haftalık Satış</div>
      <div class="panel-hint">${fmtMoney(d.weekly.reduce((s, w) => s + w.value, 0))}</div>
    </div>
    <div class="panel-body">
      <div class="bars">
        ${d.weekly.map((w, i) => {
          const h = Math.max(4, Math.round((w.value / d.maxWeekly) * 100));
          const peak = w.value === d.maxWeekly;
          return `<div class="bar-col ${peak ? "is-peak" : ""}">
            <div class="bar-track"><div class="bar-fill" style="height:${h}%;"></div></div>
            <div class="bar-label">${w.day}</div>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Sipariş Durumu</div>
      <div class="panel-hint">${STATE.orders.length} sipariş</div>
    </div>
    <div class="panel-body">
      <div class="donut-wrap">
        <div class="donut" style="background: conic-gradient(${donutStops});">
          <div class="donut-center">
            <div>
              <strong>${fmtNumber(d.active)}</strong>
              <span>aktif</span>
            </div>
          </div>
        </div>
        <div class="legend">
          ${d.dist.map(x => `<div class="legend-row">
            <span class="legend-dot" style="background:${x.color};"></span>
            ${x.key}
            <b>${x.value}</b>
          </div>`).join("")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="dash-grid-3">
  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Son Hareketler</div>
      <button class="panel-link" onclick="window.APP.navigate('/orders')">Tümü</button>
    </div>
    <div class="panel-body" style="padding-top:0.5rem;">
      <div class="row-list">
        ${recent.map(o => `<div class="row-item">
          <div class="grow">
            <div class="row-main">${esc(o.customer)}</div>
            <div class="row-sub">${esc(o.model)} · ${o.qty} adet</div>
          </div>
          ${badge(o.status)}
        </div>`).join("")}
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Kritik İplik</div>
      <button class="panel-link" onclick="window.APP.navigate('/yarn')">Depo</button>
    </div>
    <div class="panel-body" style="padding-top:0.5rem;">
      <div class="row-list">
        ${lowYarn.length ? lowYarn.map(y => `<div class="row-item">
          <div class="grow">
            <div class="row-main">${esc(y.color)} · ${esc(y.count)}</div>
            <div class="row-sub">Lot ${esc(y.dyeLot)} · ${esc(y.location)}</div>
          </div>
          <div class="row-fig is-danger">${fmtNumber(y.available)} kg</div>
        </div>`).join("") : `<div class="row-item"><div class="grow"><div class="row-sub">Kritik stok yok</div></div></div>`}
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Üretim Performansı</div>
      <button class="panel-link" onclick="window.APP.navigate('/production')">Panel</button>
    </div>
    <div class="panel-body" style="padding-top:0.5rem;">
      <div class="row-list">
        ${runningProd.map(p => {
          const percentage = p.qty ? Math.round((p.done / p.qty) * 100) : 0;
          return `<div class="row-item">
            <div style="width:58px;flex-shrink:0;">
              <div class="row-main" style="font-size:0.78rem;">${esc(p.model)}</div>
              <div class="row-sub" style="font-size:0.66rem;">${esc(p.customer.split(" ")[0])}</div>
            </div>
            <div class="mini-progress">
              <div class="progress-bar"><div class="progress-fill ${p.delayed ? "delayed" : ""}" style="width:${percentage}%;"></div></div>
              <span>${percentage}%</span>
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>
</div>

<div class="dash-grid-2">
  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Yaklaşan Teslimatlar</div>
      <button class="panel-link" onclick="window.APP.navigate('/orders')">Takvim</button>
    </div>
    <div class="panel-body" style="padding-top:0.5rem;">
      <div class="row-list">
        ${upcoming.map(o => {
          const late = new Date(o.deadline) < new Date();
          return `<div class="row-item">
            <div class="grow">
              <div class="row-main">${esc(o.customer)}</div>
              <div class="row-sub">${esc(o.model)}</div>
            </div>
            <div class="row-fig ${late ? "is-danger" : ""}">${fmtDate(o.deadline)}</div>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <div class="panel-title">Kalite Onayı Bekleyen</div>
      <button class="panel-link" onclick="window.APP.navigate('/quality')">Kalite</button>
    </div>
    <div class="panel-body" style="padding-top:0.5rem;">
      <div class="row-list">
        ${qualityPending.length ? qualityPending.map(o => `<div class="row-item">
          <div class="grow">
            <div class="row-main">${esc(o.customer)}</div>
            <div class="row-sub">${esc(o.model)} · ${o.qty} adet</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.APP.navigate('/quality')">İncele</button>
        </div>`).join("") : `<div class="row-item"><div class="grow"><div class="row-sub">Bekleyen onay yok</div></div></div>`}
      </div>
    </div>
  </div>
</div>
`;
  }

  function mount() {
    // Sayısal değerler render sırasında STATE'den üretildiği için ek işlem gerekmez.
  }

  window.VIEWS.dashboard = { render, mount };
})();
