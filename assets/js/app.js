/* =========================================================================
   ZERYTHA OS — Application Core
   Premium Luxury Knitwear ERP & Business Management Platform
   Single-file SPA with all modules connected to mock application data.
   ========================================================================= */

/* ---- State / Mock Data (connected to all UI) ---- */
const STATE = {
  user: {
    name: "Elif Demir",
    role: "İşletme Yöneticisi",
    initials: "ED",
    email: "elif.demir@zerytha.com",
    language: "Türkçe",
    avatar: null
  },
  company: {
    name: "ZERYTHA Tekstil A.Ş.",
    taxNo: "1234567890",
    address: "Bursa Organize Sanayi Bölgesi, 4. Cadde No:12, Bursa",
    currency: "TRY — Türk Lirası",
    qrBaseUrl: "https://precious-sherbet-df4dd9.netlify.app"
  },
  now: new Date(),
  notifications: [
    { id: 1, title: "Yeni sipariş onayı beliyor", time: "10 dk önce", read: false },
    { id: 2, title: "Kumaş teslimatı gecikti", time: "2 saat önce", read: false },
    { id: 3, title: "Kalite kontrol tamamlandı", time: "4 saat önce", read: true }
  ],
  // Dashboard KPIs
  kpis: {
    activeOrders: 42,
    workOrders: 18,
    yarnInventoryKg: 3840,
    deliveryRisks: 3
  },
  // Orders
  orders: [
    { id: "ZR-2026-0142", customer: "Armani Knitwear", model: "MK-9021 Cashmere Polo", qty: 350, color: "Ivory", size: "S–XL", date: "2026-10-20", deadline: "2026-11-05", value: 84500, status: "Production", payment: "Paid", image: null },
    { id: "ZR-2026-0143", customer: "Loro Piana", model: "LP-4401 Merino Cardigan", qty: 210, color: "Champagne", size: "XS–L", date: "2026-10-18", deadline: "2026-10-30", value: 62300, status: "Quality Control", payment: "Partial", image: null },
    { id: "ZR-2026-0144", customer: "Brunello Cucinelli", model: "BC-8812 Silk Blend Sweater", qty: 180, color: "Antique Gold", size: "M–XXL", date: "2026-10-15", deadline: "2026-11-12", value: 71200, status: "Quotation", payment: "Pending", image: null },
    { id: "ZR-2026-0145", customer: "Hermès", model: "H-7703 Cashmere Crew", qty: 95, color: "Noir", size: "S–L", date: "2026-10-12", deadline: "2026-10-28", value: 55900, status: "Packaging", payment: "Paid", image: null },
    { id: "ZR-2026-0146", customer: "Zegna", model: "ZE-6605 Wool Blend", qty: 260, color: "Navy", size: "M–XL", date: "2026-10-10", deadline: "2026-11-01", value: 48700, status: "Completed", payment: "Paid", image: null },
    { id: "ZR-2026-0147", customer: "Max Mara", model: "MM-5508 Alpaca Cardigan", qty: 320, color: "Camel", size: "S–XXL", date: "2026-10-08", deadline: "2026-10-25", value: 67400, status: "Awaiting Approval", payment: "Pending", image: null },
    { id: "ZR-2026-0148", customer: "Prada", model: "PR-3310 Technical Knit", qty: 145, color: "Graphite", size: "XS–L", date: "2026-10-05", deadline: "2026-10-20", value: 39800, status: "Material Planning", payment: "Paid", image: null }
  ],
  // Production cards (kanban columns)
  production: [
    { id: "P-001", model: "MK-9021", customer: "Armani Knitwear", thumbnail: null, qty: 350, done: 210, stage: "KNITTING", operator: "Atölye A – Mehmet Yılmaz", planned: "2026-10-28", delayed: false },
    { id: "P-002", model: "LP-4401", customer: "Loro Piana", thumbnail: null, qty: 210, done: 195, stage: "LINKING", operator: "Atölye B – Ayşe Demir", planned: "2026-10-29", delayed: false },
    { id: "P-003", model: "BC-8812", customer: "Brunello Cucinelli", thumbnail: null, qty: 180, done: 0, stage: "WASHING", operator: "Yıkama Hattı – 1", planned: "2026-11-02", delayed: true },
    { id: "P-004", model: "H-7703", customer: "Hermès", thumbnail: null, qty: 95, done: 95, stage: "IRONING", operator: "Ütü Hattı – A", planned: "2026-10-27", delayed: false },
    { id: "P-005", model: "ZE-6605", customer: "Zegna", thumbnail: null, qty: 260, done: 260, stage: "FINISHING", operator: "Bitim Hattı – 2", planned: "2026-10-30", delayed: false },
    { id: "P-006", model: "MM-5508", customer: "Max Mara", thumbnail: null, qty: 320, done: 40, stage: "PACKAGING", operator: "Paketleme – C", planned: "2026-11-01", delayed: false },
    { id: "P-007", model: "PR-3310", customer: "Prada", thumbnail: null, qty: 145, done: 60, stage: "KNITTING", operator: "Atölye A – Mehmet Yılmaz", planned: "2026-11-03", delayed: false },
    { id: "P-008", model: "MK-9021", customer: "Armani Knitwear", thumbnail: null, qty: 350, done: 140, stage: "LINKING", operator: "Atölye B – Ayşe Demir", planned: "2026-10-31", delayed: true }
  ],
  // Yarn inventory (dye lots separately traceable)
  yarn: [
    { id: "Y-001", type: "Pamuklu İplik", composition: "%100 Pamuk", count: "Nm 2/28", color: "Ivory", dyeLot: "DL-2026-A11", supplier: "İplik Atölyesi", cones: 420, gross: 840, net: 810, available: 720, reserved: 90, location: "A-Raf-12" },
    { id: "Y-002", type: "Kuşbaşı İpliği", composition: "%100 Pamuk", count: "Nm 2/28", color: "Ivory", dyeLot: "DL-2026-B04", supplier: "İplik Atölyesi", cones: 310, gross: 620, net: 595, available: 595, reserved: 0, location: "A-Raf-13" },
    { id: "Y-003", type: "Kasmiyer İpliği", composition: "%70 Pamuk %30 Polyamid", count: "Nm 2/48", color: "Champagne", dyeLot: "DL-2026-C09", supplier: "Lüks İplik Tedarik", cones: 560, gross: 1120, net: 1080, available: 610, reserved: 470, location: "B-Raf-05" },
    { id: "Y-004", type: "Kuşbaşı İpliği", composition: "%100 Merino Yün", count: "Nm 2/32", color: "Noir", dyeLot: "DL-2026-D02", supplier: "Alp Yün Üretimi", cones: 290, gross: 580, net: 560, available: 140, reserved: 420, location: "C-Raf-08" },
    { id: "Y-005", type: "İplik", composition: "%100 Pamuk", count: "Nm 1/12", color: "Antique Gold", dyeLot: "DL-2026-E11", supplier: "Altın İplik Atölyesi", cones: 180, gross: 720, net: 690, available: 30, reserved: 0, location: "A-Raf-01" },
    { id: "Y-006", type: "İplik", composition: "%80 Pamuk %20 Elastan", count: "Nm 2/40", color: "Navy", dyeLot: "DL-2026-F03", supplier: "Tekstil Kimya", cones: 450, gross: 900, net: 870, available: 870, reserved: 0, location: "B-Raf-11" }
  ],
  // Customers (B2B)
  customers: [
    { id: "C-001", company: "Armani Knitwear", contact: "Giulia Rossi", email: "g.rossi@armani.it", phone: "+39 02 1234 5678", address: "Milano, İtalya", orders: 12, lastOrder: "2026-10-20", status: "Aktif" },
    { id: "C-002", company: "Loro Piana", contact: "Marcello Loro", email: "m.loro@loropiana.com", phone: "+39 011 9876 5432", address: "Quarona, İtalya", orders: 8, lastOrder: "2026-10-18", status: "Aktif" },
    { id: "C-003", company: "Brunello Cucinelli", contact: "Chiara Cucinelli", email: "c.cucinelli@brunellocucinelli.com", phone: "+39 075 555 0123", address: "Solomeo, İtalya", orders: 6, lastOrder: "2026-10-15", status: "Aktif" },
    { id: "C-004", company: "Hermès", contact: "Axel Dumas", email: "a.dumas@hermes.com", phone: "+33 1 40 17 32 32", address: "Paris, Fransa", orders: 4, lastOrder: "2026-10-12", status: "Aktif" },
    { id: "C-005", company: "Zegna", contact: "Gildo Zegna", email: "g.zegna@zegna.com", phone: "+39 015 758 1111", address: "Trivero, İtalya", orders: 10, lastOrder: "2026-10-10", status: "Aktif" },
    { id: "C-006", company: "Max Mara", contact: "Chiara Talia", email: "c.talia@maxmara.com", phone: "+39 0522 847 111", address: "Reggio Emilia, İtalya", orders: 7, lastOrder: "2026-10-08", status: "Aktif" },
    { id: "C-007", company: "Prada", contact: "Miuccia Prada", email: "m.prada@prada.com", phone: "+39 02 5636 7111", address: "Milano, İtalya", orders: 5, lastOrder: "2026-10-05", status: "Aktif" }
  ],
  // Suppliers
  suppliers: [
    { id: "S-001", name: "İplik Atölyesi", contact: "Ahmet Kaya", email: "ahmet@ipilkatiye.com", city: "Bursa", category: "İplik", rating: 4.8 },
    { id: "S-002", name: "Lüks İplik Tedarik", contact: "Elif Özcan", email: "elif@luksiplik.com", city: "İstanbul", category: "İplik", rating: 4.9 },
    { id: "S-003", name: "Alp Yün Üretimi", contact: "Mehmet Alp", email: "mehmet@alpyun.com", city: "Bursa", category: "Yün", rating: 4.7 },
    { id: "S-004", name: "Tekstil Kimya", contact: "Selin Demir", email: "selin@tekstilkimya.com", city: "İzmir", category: "Kimyasal", rating: 4.5 }
  ],
  // Subcontractors
  subcontractors: [
    { id: "SC-001", name: "Atölye A", specialty: "Örme", contact: "Mehmet Yılmaz", city: "Bursa", performance: 96, active: true },
    { id: "SC-002", name: "Atölye B", specialty: "Dikiş / Linking", contact: "Ayşe Demir", city: "İstanbul", performance: 92, active: true },
    { id: "SC-003", name: "Yıkama Hattı 1", specialty: "Yıkama", contact: "Ali Veli", city: "Bursa", performance: 89, active: true },
    { id: "SC-004", name: "Bitim Hattı 2", specialty: "Bitim", contact: "Zeynep Koç", city: "İstanbul", performance: 94, active: true },
    { id: "SC-005", name: "Paketleme C", specialty: "Paketleme", contact: "Can Arslan", city: "Bursa", performance: 91, active: true }
  ]
};

/* ---- Helpers ---- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
};
const fmtMoney = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(n);
const fmtNumber = (n) => new Intl.NumberFormat("tr-TR").format(n);
const pct = (done, total) => total ? Math.round((done / total) * 100) : 0;

/* ---- Router ---- */
const ROUTES = {
  "/": "dashboard",
  "/dashboard": "dashboard",
  "/orders": "orders",
  "/order-detail": "order-detail",
  "/workorders": "workorders",
  "/workorder-new": "workorder-new",
  "/workorder-detail": "workorder-detail",
  "/production": "production",
  "/yarn": "yarn",
  "/customers": "customers",
  "/customer-detail": "customer-detail",
  "/suppliers": "suppliers",
  "/subcontractors": "subcontractors",
  "/quality": "quality",
  "/packaging": "packaging",
  "/b2b": "b2b",
  "/b2b-detail": "b2b-detail",
  "/store": "store",
  "/reports": "reports",
  "/settings": "settings"
};

let currentRoute = "/";
let currentView = null;

const navItems = $$(".nav-item");
const contentArea = $(".content-area");

function setActiveNav(path) {
  navItems.forEach(item => {
    const href = item.getAttribute("href");
    const active = (path === href) || (path === "/" && href === "/");
    item.classList.toggle("active", active);
    item.setAttribute("aria-current", active ? "page" : "false");
  });
}

function renderView(name, fullPath) {
  if (window.VIEWS && window.VIEWS[name]) {
    currentView = window.VIEWS[name];
    contentArea.innerHTML = window.VIEWS[name].render(fullPath);
    if (window.VIEWS[name].mount) window.VIEWS[name].mount(fullPath);
  }
}

function navigate(path) {
  currentRoute = path;
  const base = path.split("?")[0];
  currentQuery = parseQuery(path);
  // file:// protokolunde pushState guvenlik hatasi verebilir; hash'e dus
  try {
    history.pushState(null, "", path);
  } catch (e) {
    try { location.hash = path; } catch (e2) { /* yoksay */ }
  }
  setActiveNav(base);
  updateIsland(base);
  renderView(ROUTES[base] || "dashboard", path);
}

window.addEventListener("popstate", () => {
  // file:// protokolunde pathname dosya yolu olur; SPA rotasini kullan
  if (location.protocol === "file:") return;
  const base = location.pathname;
  if (!ROUTES[base]) return;
  currentRoute = base;
  setActiveNav(base);
  renderView(ROUTES[base] || "dashboard", base);
});

window.addEventListener("hashchange", () => {
  const path = (location.hash || "").replace(/^#/, "");
  if (path.charAt(0) !== "/" || path === currentRoute) return;
  const base = path.split("?")[0];
  currentRoute = path;
  currentQuery = parseQuery(path);
  setActiveNav(base);
  updateIsland(base);
  renderView(ROUTES[base] || "dashboard", path);
});

// Query string helper — file:// uyumlu (ic durumdan okur)
let currentQuery = {};
const getQueryHelper = () => currentQuery;

function parseQuery(path) {
  const qIndex = path.indexOf("?");
  const obj = {};
  if (qIndex !== -1) {
    new URLSearchParams(path.slice(qIndex + 1)).forEach((v, k) => obj[k] = v);
  }
  return obj;
}

/* ---- Dynamic Island (aktif menüye göre canlı özet) ---- */
const ISLAND_ALIAS = {
  "/order-detail": "/orders",
  "/workorder-new": "/workorders",
  "/workorder-detail": "/workorders",
  "/customer-detail": "/customers",
  "/b2b-detail": "/b2b"
};

function islandData(base) {
  const s = STATE;
  const orders = s.orders;
  const activeOrders = orders.filter(o => o.status !== "Completed");
  const running = s.production.filter(p => p.done < p.qty);
  const delayed = s.production.filter(p => p.done < p.qty && (p.delayed || new Date(p.planned) < new Date()));
  const yarnKg = s.yarn.reduce((a, y) => a + y.available, 0);
  const lowYarn = s.yarn.filter(y => y.available < 200);
  const totalValue = orders.reduce((a, o) => a + o.value, 0);
  const workOrders = (window.WORK_DATA && window.WORK_DATA.workOrders) || [];
  const openWo = workOrders.filter(w => w.status === "Açık");
  const qc = orders.filter(o => o.status === "Quality Control");
  const pack = orders.filter(o => o.status === "Packaging" || o.status === "Ready to Ship");
  const avgPerf = s.subcontractors.length
    ? Math.round(s.subcontractors.reduce((a, x) => a + x.performance, 0) / s.subcontractors.length)
    : 0;

  switch (base) {
    case "/orders":
      return {
        label: "Siparişler", metric: `<b>${activeOrders.length}</b> aktif`,
        head: "Sipariş Akışı",
        rows: [
          ["Toplam sipariş", orders.length],
          ["Üretimde", orders.filter(o => o.status === "Production").length],
          ["Termin riski", delayed.length, delayed.length ? "danger" : "ok"],
          ["Açık değer", fmtMoney(totalValue)]
        ]
      };
    case "/workorders":
      return {
        label: "İş Emirleri", metric: `<b>${openWo.length}</b> açık`,
        head: "İş Emri Durumu",
        rows: [
          ["Toplam iş emri", workOrders.length],
          ["Açık", openWo.length],
          ["Tamamlanan", workOrders.length - openWo.length, "ok"],
          ["Müşteri", s.customers.length]
        ]
      };
    case "/production":
      return {
        label: "Üretim", metric: `<b>${running.length}</b> hat`,
        head: "Üretim Hattı",
        rows: [
          ["Aktif hat", running.length],
          ["Geciken", delayed.length, delayed.length ? "danger" : "ok"],
          ["Tamamlanan", s.production.filter(p => p.done >= p.qty).length, "ok"],
          ["Toplam adet", s.production.reduce((a, p) => a + p.qty, 0)]
        ]
      };
    case "/yarn":
      return {
        label: "İplik", metric: `<b>${fmtNumber(yarnKg)}</b> kg`,
        head: "İplik Envanteri",
        rows: [
          ["Dye lot", s.yarn.length],
          ["Kritik stok", lowYarn.length, lowYarn.length ? "danger" : "ok"],
          ["Rezerve", fmtNumber(s.yarn.reduce((a, y) => a + y.reserved, 0)) + " kg"],
          ["Raf", new Set(s.yarn.map(y => y.location.split("-")[0])).size + " bölge"]
        ]
      };
    case "/customers":
      return {
        label: "Müşteriler", metric: `<b>${s.customers.length}</b> kayıt`,
        head: "Müşteri Portföyü",
        rows: [
          ["Aktif müşteri", s.customers.filter(c => c.status === "Aktif").length],
          ["Toplam sipariş", s.customers.reduce((a, c) => a + c.orders, 0)],
          ["Ülke", new Set(s.customers.map(c => c.address.split(",").pop().trim())).size],
          ["Son sipariş", fmtDate(s.customers[0] && s.customers[0].lastOrder)]
        ]
      };
    case "/suppliers":
      return {
        label: "Tedarikçiler", metric: `<b>${s.suppliers.length}</b> firma`,
        head: "Tedarik Ağı",
        rows: [
          ["İplik tedarikçisi", s.suppliers.filter(x => x.category === "İplik").length],
          ["Yün", s.suppliers.filter(x => x.category === "Yün").length],
          ["Kimyasal", s.suppliers.filter(x => x.category === "Kimyasal").length],
          ["Ortalama puan", (s.suppliers.reduce((a, x) => a + x.rating, 0) / s.suppliers.length).toFixed(1)]
        ]
      };
    case "/subcontractors":
      return {
        label: "Atölyeler", metric: `<b>${s.subcontractors.length}</b> atölye`,
        head: "Alt Müşavir Kapasitesi",
        rows: [
          ["Aktif", s.subcontractors.filter(x => x.active).length, "ok"],
          ["Ortalama performans", avgPerf + "%"],
          ["Şehir", new Set(s.subcontractors.map(x => x.city)).size],
          ["Uzmanlık", new Set(s.subcontractors.map(x => x.specialty)).size]
        ]
      };
    case "/quality":
      return {
        label: "Kalite", metric: `<b>${qc.length}</b> onay`,
        head: "Kalite Kontrol",
        rows: [
          ["Onay bekleyen", qc.length, qc.length ? "danger" : "ok"],
          ["Paketlemede", orders.filter(o => o.status === "Packaging").length],
          ["Tamamlanan", orders.filter(o => o.status === "Completed").length, "ok"],
          ["Kontrol edilen adet", qc.reduce((a, o) => a + o.qty, 0)]
        ]
      };
    case "/packaging":
      return {
        label: "Paketleme", metric: `<b>${pack.length}</b> sevkiyat`,
        head: "Paketleme & Kargo",
        rows: [
          ["Paketlemede", orders.filter(o => o.status === "Packaging").length],
          ["Teslime hazır", orders.filter(o => o.status === "Ready to Ship").length, "ok"],
          ["Toplam adet", pack.reduce((a, o) => a + o.qty, 0)],
          ["Termin riski", delayed.length, delayed.length ? "danger" : "ok"]
        ]
      };
    case "/b2b":
      return {
        label: "B2B Portal", metric: `<b>${s.customers.length}</b> hesap`,
        head: "B2B Portal",
        rows: [
          ["Aktif hesap", s.customers.filter(c => c.status === "Aktif").length, "ok"],
          ["Bekleyen sipariş", orders.filter(o => o.status === "Awaiting Approval").length],
          ["Katalog", "2026 Sonbahar"],
          ["Para birimi", "EUR / TRY"]
        ]
      };
    case "/store":
      return {
        label: "Mağaza", metric: `<b>${orders.length}</b> ürün`,
        head: "Online Mağaza",
        rows: [
          ["Yayında", orders.filter(o => o.status !== "Quotation").length, "ok"],
          ["Stok", fmtNumber(yarnKg) + " kg"],
          ["Sipariş", orders.filter(o => o.status === "Completed").length],
          ["Kanal", "zerytha.com"]
        ]
      };
    case "/reports":
      return {
        label: "Raporlar", metric: `<b>${orders.length}</b> kayıt`,
        head: "Raporlama",
        rows: [
          ["Sipariş değeri", fmtMoney(totalValue)],
          ["Üretim hattı", running.length],
          ["Teslim edilen", orders.filter(o => o.status === "Completed").length, "ok"],
          ["Dönem", "2026 / Q4"]
        ]
      };
    case "/settings":
      return {
        label: "Ayarlar", metric: "<b>sistem</b>",
        head: "Sistem Ayarları",
        rows: [
          ["Kullanıcı", s.user.name],
          ["Rol", s.user.role],
          ["Para birimi", "TRY"],
          ["Dil", "Türkçe"]
        ]
      };
    default:
      return {
        label: "Kontrol Paneli", metric: `<b>${activeOrders.length}</b> sipariş`,
        head: "Genel Durum",
        rows: [
          ["Aktif sipariş", activeOrders.length],
          ["Üretim hattı", running.length],
          ["Termin riski", delayed.length, delayed.length ? "danger" : "ok"],
          ["İplik stok", fmtNumber(yarnKg) + " kg"]
        ]
      };
  }
}

function updateIsland(base) {
  const el = $("#dynamic-island");
  if (!el) return;
  const key = ISLAND_ALIAS[base] || base;
  let d = islandData(key);

  if (base === "/workorder-detail" && currentQuery.id) {
    const w = ((window.WORK_DATA && window.WORK_DATA.workOrders) || []).find(x => x.id === currentQuery.id);
    if (w) {
      const pieceCount = (w.pieces || []).length;
      const yarnCount = (w.yarnUsage || []).length;
      d = {
        label: "İş Emri",
        metric: `<b>${w.model}</b>`,
        head: w.modelName || w.model,
        rows: [
          ["Durum", w.status, w.status === "Açık" ? "" : "ok"],
          ["Miktar", fmtNumber(w.qty) + " adet"],
          ["Parça kaydı", pieceCount],
          ["İplik kaydı", yarnCount]
        ]
      };
    }
  } else if (base === "/workorder-new" && currentQuery.id) {
    d = {
      label: "İş Emri",
      metric: "<b>düzenle</b>",
      head: "İş Emri Düzenle",
      rows: [
        ["Kayıt", currentQuery.id],
        ["Durum", "Düzenleniyor"],
        ["Kayıt yeri", "Yerel"],
        ["Sürüm", "2026 / Q4"]
      ]
    };
  }

  const label = $("#island-label", el);
  const metric = $("#island-metric", el);
  const head = $("#island-expand-head", el);
  const rows = $("#island-expand-rows", el);
  if (label) label.textContent = d.label;
  if (metric) metric.innerHTML = d.metric;
  if (head) head.textContent = d.head;
  if (rows) {
    rows.innerHTML = d.rows.map(r => {
      const cls = r[2] ? " class=\"is-" + r[2] + "\"" : "";
      return `<div class="island-row"><span>${r[0]}</span><b${cls}>${r[1]}</b></div>`;
    }).join("");
  }
}

// Expose helpers for views
window.APP = { STATE, fmtDate, fmtMoney, fmtNumber, pct, navigate, toast, $, $$, getQuery: getQueryHelper };

function syncChrome() {
  const avatar = $(".topbar-right .user-avatar");
  const name = $(".topbar-right .user-name");
  const role = $(".topbar-right .user-role");
  const initials = (STATE.user.name || "Z")
    .split(" ").filter(Boolean).map(p => p.charAt(0)).slice(0, 2).join("").toUpperCase();
  STATE.user.initials = initials || "Z";
  if (avatar) avatar.textContent = STATE.user.initials;
  if (name) name.textContent = STATE.user.name;
  if (role) role.textContent = STATE.user.role;
}
function loadSettings() {
  try {
    const raw = localStorage.getItem("zerytha_settings");
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s && s.company) Object.assign(STATE.company, s.company);
    if (s && s.user) Object.assign(STATE.user, s.user);
  } catch (e) { /* ignore */ }
}
function saveSettings() {
  try {
    localStorage.setItem("zerytha_settings", JSON.stringify({ company: STATE.company, user: STATE.user }));
  } catch (e) { /* ignore */ }
}
window.APP.syncChrome = syncChrome;
window.APP.loadSettings = loadSettings;
window.APP.saveSettings = saveSettings;

window.APP.refresh = function () {
  const base = currentRoute.split("?")[0];
  syncChrome();
  updateIsland(base);
  renderView(ROUTES[base] || "dashboard", currentRoute);
};
window.APP.refreshChrome = function () {
  syncChrome();
  updateIsland(currentRoute.split("?")[0]);
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  const initial = (location.hash || "").replace(/^#/, "");
  let startPath = initial.charAt(0) === "/" ? initial : "";
  if (!startPath) {
    const params = new URLSearchParams(location.search || "");
    const view = params.get("view");
    if (view) {
      const id = params.get("id");
      startPath = "/" + view + (id ? "?id=" + encodeURIComponent(id) : "");
    }
  }
  if (!startPath) startPath = "/";
  const startBase = startPath.split("?")[0];
  currentRoute = startPath;
  currentQuery = parseQuery(startPath);
  loadSettings();
  setActiveNav(startBase);
  syncChrome();
  updateIsland(startBase);
  renderView(ROUTES[startBase] || "dashboard", startPath);

  // Sidebar linklerini SPA yonlendirmesine bagla (file:// icin sart)
  $$(".nav-item").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var href = link.getAttribute("href");
      if (href) navigate(href);
    });
  });

  // Topbar date / time
  function tick() {
    const el = $(".topbar-date");
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
  }
  tick();
  setInterval(tick, 60000);

  // Global search — gerçek sonuç listesi
  const searchInput = $("#global-search");
  if (searchInput) {
    const wrap = searchInput.closest(".search-wrap");
    const results = document.createElement("div");
    results.className = "search-results";
    wrap.appendChild(results);

    const buildIndex = () => {
      const idx = [];
      STATE.orders.forEach(o => idx.push({
        title: o.model, sub: o.id + " · " + o.customer + " · " + fmtNumber(o.qty) + " adet",
        route: "/order-detail?id=" + encodeURIComponent(o.id), tag: "Sipariş"
      }));
      ((window.WORK_DATA && window.WORK_DATA.workOrders) || []).forEach(w => idx.push({
        title: w.modelName || w.model, sub: w.id + " · " + w.season + " · " + w.gauge,
        route: "/workorder-detail?id=" + encodeURIComponent(w.id), tag: "İş Emri"
      }));
      STATE.customers.forEach(c => idx.push({
        title: c.company, sub: c.id + " · " + c.contact + " · " + c.address,
        route: "/customer-detail?id=" + encodeURIComponent(c.id), tag: "Müşteri"
      }));
      STATE.yarn.forEach(y => idx.push({
        title: y.composition + " " + y.count, sub: y.id + " · " + y.color + " · " + y.dyeLot,
        route: "/yarn", tag: "İplik"
      }));
      return idx;
    };

    let index = buildIndex();
    const closeResults = () => { results.classList.remove("open"); results.innerHTML = ""; };

    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) { closeResults(); return; }
      index = buildIndex();
      const hits = index.filter(it => (it.title + " " + it.sub).toLowerCase().includes(q)).slice(0, 8);
      if (!hits.length) {
        results.innerHTML = `<div class="search-empty">Sonuç bulunamadı</div>`;
      } else {
        results.innerHTML = hits.map((it, i) => `
          <button type="button" class="search-result" data-i="${i}">
            <span class="search-result-main">
              <span class="search-result-title">${escAttr(it.title)}</span>
              <span class="search-result-sub">${escAttr(it.sub)}</span>
            </span>
            <span class="search-result-tag">${escAttr(it.tag)}</span>
          </button>`).join("");
        results.querySelectorAll(".search-result").forEach(btn => {
          btn.addEventListener("click", () => {
            const it = hits[Number(btn.dataset.i)];
            searchInput.value = "";
            closeResults();
            if (it) navigate(it.route);
          });
        });
      }
      results.classList.add("open");
    });

    searchInput.addEventListener("keydown", e => {
      if (e.key === "Escape") { closeResults(); searchInput.blur(); }
      if (e.key === "Enter") {
        const first = results.querySelector(".search-result");
        if (first) first.click();
      }
    });

    document.addEventListener("click", e => {
      if (!wrap.contains(e.target)) closeResults();
    });
  }

  // Bildirim paneli
  const notifBtn = $(".icon-btn.notif");
  if (notifBtn) {
    const panel = document.createElement("div");
    panel.className = "notif-panel";
    document.body.appendChild(panel);

    const renderNotif = () => {
      const unread = STATE.notifications.filter(n => !n.read).length;
      const badge = notifBtn.querySelector(".notif-badge");
      if (badge) badge.style.display = unread ? "" : "none";
      panel.innerHTML = `
        <div class="notif-head">
          <span>Bildirimler</span>
          <button type="button" class="notif-mark" ${unread ? "" : "disabled"}>Tümünü okundu işaretle</button>
        </div>
        <div class="notif-list">
          ${STATE.notifications.map(n => `
            <button type="button" class="notif-item ${n.read ? "read" : ""}" data-id="${n.id}">
              <span class="notif-dot"></span>
              <span class="notif-body">
                <span class="notif-title">${escAttr(n.title)}</span>
                <span class="notif-time">${escAttr(n.time)}</span>
              </span>
            </button>`).join("")}
        </div>
        <div class="notif-foot">ZERYTHA OS · operasyon uyarıları</div>`;
      panel.querySelectorAll(".notif-item").forEach(item => {
        item.addEventListener("click", () => {
          const n = STATE.notifications.find(x => String(x.id) === item.dataset.id);
          if (n) n.read = true;
          renderNotif();
        });
      });
      const mark = panel.querySelector(".notif-mark");
      if (mark) mark.addEventListener("click", () => {
        STATE.notifications.forEach(n => { n.read = true; });
        renderNotif();
        toast("Tüm bildirimler okundu.");
      });
    };

    renderNotif();
    notifBtn.addEventListener("click", e => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
    panel.addEventListener("click", e => e.stopPropagation());
    document.addEventListener("click", () => panel.classList.remove("open"));
  }

  syncChrome();

  // Kullanıcı kartı → sistem ayarları
  const userWrap = $(".user-wrap");
  if (userWrap) {
    userWrap.style.cursor = "pointer";
    userWrap.title = "Kullanıcı ve şirket ayarları";
    userWrap.addEventListener("click", () => navigate("/settings"));
  }

  // Mobile sidebar toggle
  const menuBtn = $(".menu-btn");
  const sidebar = $(".sidebar");
  const overlay = $(".sidebar-overlay");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      overlay.classList.toggle("open");
    });
  }
  if (overlay) overlay.addEventListener("click", () => {
    overlay.classList.remove("open");
    sidebar.classList.remove("collapsed");
  });
}

function toast(message, type = "info") {
  const container = $(".toast-container") || (() => {
    const c = document.createElement("div");
    c.className = "toast-container";
    document.body.appendChild(c);
    return c;
  })();
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<div class="toast-title">${message}</div>`;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

window.VIEWS = window.VIEWS || {};

/* ---- Generic form modal (tüm modüllerde gerçek kayıt işlemleri için) ---- */
function escAttr(v) {
  return String(v === null || v === undefined ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function openFormModal(opts) {
  const fields = opts.fields || [];
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const fieldHtml = fields.map(f => {
    const span = f.full ? ' style="grid-column:1 / -1;"' : "";
    const attrs = `name="${escAttr(f.name)}" id="fm-${escAttr(f.name)}" ${f.required ? "required" : ""}`;
    let control = "";
    if (f.type === "select") {
      control = `<select class="form-select" ${attrs}>${(f.options || []).map(o => {
        const val = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        return `<option value="${escAttr(val)}" ${String(f.value) === String(val) ? "selected" : ""}>${escAttr(label)}</option>`;
      }).join("")}</select>`;
    } else if (f.type === "textarea") {
      control = `<textarea class="form-textarea" ${attrs} placeholder="${escAttr(f.placeholder || "")}">${escAttr(f.value || "")}</textarea>`;
    } else {
      control = `<input type="${f.type || "text"}" class="form-input" ${attrs} value="${escAttr(f.value || "")}" placeholder="${escAttr(f.placeholder || "")}" ${f.min !== undefined ? `min="${f.min}"` : ""} ${f.step !== undefined ? `step="${f.step}"` : ""}>`;
    }
    return `<div class="form-group"${span}>
      <label class="form-label" for="fm-${escAttr(f.name)}">${escAttr(f.label)}</label>
      ${control}
    </div>`;
  }).join("");

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escAttr(opts.title)}">
      <div class="modal-header">
        <div class="modal-title">${escAttr(opts.title)}</div>
        <button type="button" class="modal-close" data-close aria-label="Kapat">×</button>
      </div>
      <form class="modal-body" novalidate>
        <div class="form-row" style="grid-template-columns:repeat(2,minmax(0,1fr));">${fieldHtml}</div>
        ${opts.note ? `<div class="form-hint" style="margin-top:-0.5rem;">${opts.note}</div>` : ""}
        <div class="modal-footer" style="padding:1rem 0 0;border-top:1px solid var(--color-border);margin-top:1.25rem;">
          <button type="button" class="btn btn-secondary" data-close>İptal</button>
          <button type="submit" class="btn btn-primary">${escAttr(opts.submitLabel || "Kaydet")}</button>
        </div>
      </form>
    </div>`;

  document.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.classList.add("open");

  function close() {
    overlay.classList.remove("open");
    setTimeout(() => overlay.remove(), 260);
  }

  overlay.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", close));
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  const keyHandler = e => {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", keyHandler); }
  };
  document.addEventListener("keydown", keyHandler);

  const form = overlay.querySelector("form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = {};
    fields.forEach(f => {
      const el = form.querySelector(`[name="${f.name}"]`);
      if (!el) return;
      data[f.name] = f.type === "number" ? Number(el.value) : el.value.trim();
    });
    const missing = fields.find(f => f.required && !String(data[f.name] === undefined ? "" : data[f.name]).trim());
    if (missing) { toast("Lütfen " + missing.label + " alanını doldurun."); return; }
    const result = opts.onSubmit ? opts.onSubmit(data) : undefined;
    if (result !== false) close();
  });

  const first = form.querySelector("input, select, textarea");
  if (first) setTimeout(() => first.focus(), 80);
  return { overlay, close };
}

window.APP.openFormModal = openFormModal;
window.APP.escAttr = escAttr;

// Shared Work Order data (used by workorders, workorder-new, workorder-detail)
window.WORK_DATA = {
  customers: STATE.customers.map(c => ({
    id: c.id.replace("C-", "cust-"),
    name: c.company,
    code: c.company.split(" ")[0].slice(0, 3).toUpperCase()
  })),
  seasons: ["2025 Kış", "2026 İlkbahar", "2026 Yaz", "2026 Sonbahar", "2027 Kış"],
  yarnTypes: STATE.yarn.map((y, i) => ({
    id: "yarn-" + (i + 1),
    name: y.type + " — " + y.composition + " " + y.count,
    stock: fmtNumber(y.cones) + " kon",
    location: y.location
  })),
  gauges: ["7 GG", "12 GG", "14 GG", "16 GG", "18 GG"],
  workOrders: STATE.orders.map((o, i) => ({
    id: "WO-" + (2026) + "-" + String(1000 + i),
    custId: "cust-" + String(i % STATE.customers.length + 1).padStart(3, "0"),
    season: ["2025 Kış", "2026 İlkbahar", "2026 Yaz", "2026 Sonbahar", "2027 Kış"][i % 5],
    model: o.model.split(" ")[0],
    modelName: o.model,
    yarnId: "yarn-" + ((i % STATE.yarn.length) + 1),
    yarnManual: "",
    gauge: "12 GG",
    qty: o.qty,
    deadline: o.deadline,
    image: null,
    status: o.status === "Completed" ? "Tamamlandı" : "Açık",
    created: o.date,
    pieces: [],
    yarnUsage: []
  }))
};


