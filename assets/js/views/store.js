/* =========================================================================
   ZERYTHA OS — Online Store (Lüks E-Ticaret Mağazası)
   Ayrı e-ticaret deneyimi, zentral envantere bağlı.
   ========================================================================= */
(function() {
  const { STATE, fmtMoney, toast, navigate } = window.APP;

  const HERO = "assets/img/hero-knitwear.jpg";

  const storeProducts = [
    { id: "sp-1", name: "Cashmere Polo Shirt", category: "Men's Knitwear", price: 8500, color: "Ivory", sizes: ["S","M","L","XL"], stock: 42, image: "assets/img/product-1.jpg", pos: "center 40%", featured: true, collection: "2026 İlkbahar" },
    { id: "sp-2", name: "Merino Cardigan", category: "Women's Knitwear", price: 12500, color: "Champagne", sizes: ["XS","S","M","L"], stock: 18, image: "assets/img/product-2.jpg", pos: "center 50%", featured: true, collection: "2026 İlkbahar" },
    { id: "sp-3", name: "Silk Blend Sweater", category: "Sweaters", price: 14200, color: "Antique Gold", sizes: ["M","L","XL","XXL"], stock: 8, image: "assets/img/product-3.jpg", pos: "center 45%", featured: true, collection: "Limited Collection" },
    { id: "sp-4", name: "Cashmere Crew Neck", category: "Men's Knitwear", price: 11800, color: "Noir", sizes: ["S","M","L"], stock: 6, image: "assets/img/product-4.jpg", pos: "center 40%", featured: false, collection: "2026 Sonbahar" },
    { id: "sp-5", name: "Alpaca Cardigan", category: "Women's Knitwear", price: 16500, color: "Camel", sizes: ["S","M","L","XL"], stock: 24, image: "assets/img/product-5.jpg", pos: "center 45%", featured: false, collection: "2026 Kış" },
    { id: "sp-6", name: "Technical Knit Pullover", category: "Cardigans", price: 9800, color: "Graphite", sizes: ["XS","S","M","L"], stock: 31, image: "assets/img/product-6.jpg", pos: "center 50%", featured: false, collection: "2026 İlkbahar" }
  ];

  const categories = ["Tümü", "Men's Knitwear", "Women's Knitwear", "Cardigans", "Sweaters", "Limited Collections"];
  let cart = [];
  let activeCategory = "Tümü";

  function esc(t) {
    return String(t === null || t === undefined ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function cartCount() {
    return cart.reduce((a, i) => a + i.qty, 0);
  }
  function cartTotal() {
    return cart.reduce((a, i) => a + i.price * i.qty, 0);
  }

  function qualities(p) {
    if (p.stock <= 0) {
      return `<button class="btn btn-secondary btn-sm" disabled style="padding:0.4rem 0.9rem;font-size:0.75rem;opacity:0.45;cursor:not-allowed;">Tükendi</button>`;
    }
    return `<button class="btn btn-secondary btn-sm" onclick="APP_STORE.addToCart('${p.id}')" style="padding:0.4rem 0.9rem;font-size:0.75rem;">Sepete Ekle</button>`;
  }

  function render() {
    const shown = storeProducts.filter(p => activeCategory === "Tümü" || p.category === activeCategory);
    return `
<div class="store-shell">
  <header class="store-header">
    <div class="store-brand" style="display:flex;align-items:center;gap:0.75rem;font-family:var(--font-serif);font-size:1.5rem;font-weight:600;letter-spacing:0.04em;color:var(--color-text-main);">
      <img src="assets/img/brand-mark.png" alt="Zerytha" style="height:56px;width:auto;object-fit:contain;">
      ZERYTHA
    </div>
    <div class="store-nav" style="display:flex;align-items:center;gap:1.5rem;">
      <button type="button" onclick="APP_STORE.openCart()" class="btn btn-ghost btn-sm" style="display:flex;align-items:center;gap:0.5rem;color:var(--color-text-secondary);font-size:0.8125rem;padding:0.35rem 0.5rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${cartCount()}</span> ürün
      </button>
      <div style="width:1px;height:20px;background:#242724;"></div>
      <button type="button" onclick="window.APP.navigate('/b2b')" style="font-size:0.75rem;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.1em;background:transparent;border:0;cursor:pointer;">Hesabım</button>
    </div>
  </header>

  <div class="store-hero">
    <div style="font-family:var(--font-serif);font-size:3.5rem;font-weight:600;line-height:1.1;letter-spacing:-0.02em;color:var(--color-text-main);max-width:600px;">Koleksiyon 2026</div>
    <div style="margin-top:1rem;font-size:1.125rem;color:var(--color-text-secondary);max-width:520px;line-height:1.6;">Sınırlı serideki lüks triko parçaları. Zentrale envanterden doğrudan temin.</div>
    <button class="btn btn-primary" onclick="APP_STORE.explore()" style="margin-top:1.5rem;padding:0.875rem 1.75rem;font-size:0.875rem;">Koleksiyonu Keşfet</button>
  </div>

  <nav class="store-categories" id="store-categories" style="padding:1.5rem 0;border-bottom:1px solid var(--color-border);">
    <div style="display:flex;gap:0.75rem;overflow-x:auto;padding-bottom:0.5rem;">
      ${categories.map(cat => `
      <button class="store-cat-btn ${activeCategory===cat?'active':''}" onclick="APP_STORE.setCategory('${cat.replace(/'/g, "\\'")}')" style="padding:0.5rem 1rem;border-radius:4px;border:1px solid ${activeCategory===cat?'var(--color-gold)':'#242724'};color:${activeCategory===cat?'var(--color-gold)':'var(--color-text-secondary)'};font-size:0.8125rem;background:transparent;cursor:pointer;white-space:nowrap;">${cat}</button>
      `).join("")}
    </div>
  </nav>

  <div class="store-grid" id="store-grid" style="padding:2rem 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.5rem;">
    ${shown.map(p => `
    <div class="store-card" style="background:var(--color-card);border:1px solid var(--color-border);border-radius:var(--radius-md);overflow:hidden;display:flex;flex-direction:column;">
      <div style="aspect-ratio:1/1;background:#1F221F;border-bottom:1px solid var(--color-border);position:relative;overflow:hidden;">
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:${p.pos};display:block;">
        ${p.featured?`<div style="position:absolute;top:12px;left:12px;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-gold);background:rgba(9,11,11,0.85);padding:4px 8px;border-radius:2px;">Öne Çıkan</div>`:""}
      </div>
      <div style="padding:1rem;display:flex;flex-direction:column;gap:0.5rem;flex:1;">
        <div style="font-size:0.7rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.08em;">${esc(p.collection)}</div>
        <div style="font-family:var(--font-serif);font-weight:600;font-size:1rem;color:var(--color-text-main);">${esc(p.name)}</div>
        <div style="font-size:0.8125rem;color:var(--color-text-secondary);">${esc(p.color)} · ${esc(p.sizes.join(" / "))}</div>
        <div style="font-size:0.7rem;color:${p.stock <= 8 ? "var(--color-error)" : "var(--color-text-muted)"};">${p.stock > 0 ? "Stokta " + p.stock + " adet" : "Stokta yok"}</div>
        <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
          <div style="font-family:var(--font-numeric);font-weight:600;color:var(--color-text-main);">${fmtMoney(p.price)}</div>
          ${qualities(p)}
        </div>
      </div>
    </div>
    `).join("")}
  </div>

  <div style="padding:2.5rem 0 3rem;border-top:1px solid var(--color-border);text-align:center;color:var(--color-text-muted);font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;">
    ZERYTHA · TRIKO, BİR YAŞAM TARZIDIR.
  </div>
</div>
`;
  }

  function rerender() {
    const host = document.getElementById("content-area");
    if (!host) return;
    host.innerHTML = render();
    window.APP_STORE.bind();
  }

  function openCart() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const rows = () => cart.map(item => `
      <div class="cart-row" data-id="${item.id}">
        <img src="${item.image}" alt="${esc(item.name)}" style="width:54px;height:64px;object-fit:cover;object-position:${item.pos};border-radius:3px;flex-shrink:0;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.85rem;font-weight:600;color:var(--color-text-main);">${esc(item.name)}</div>
          <div style="font-size:0.72rem;color:var(--color-text-muted);">${esc(item.color)} · ${item.qty} adet</div>
          <div style="font-family:var(--font-numeric);font-size:0.8rem;color:var(--color-gold-champagne);margin-top:0.15rem;">${fmtMoney(item.price * item.qty)}</div>
        </div>
        <button type="button" class="cart-remove" data-remove="${item.id}" aria-label="Kaldır" title="Kaldır">×</button>
      </div>`).join("");

    const paint = () => {
      const body = overlay.querySelector("[data-cart-body]");
      const foot = overlay.querySelector("[data-cart-foot]");
      if (!cart.length) {
        body.innerHTML = `<div style="padding:2rem 0;text-align:center;color:var(--color-text-muted);font-size:0.85rem;">Sepetiniz boş.</div>`;
        foot.innerHTML = `<button type="button" class="btn btn-secondary" data-close>Kapat</button>`;
      } else {
        body.innerHTML = rows();
        foot.innerHTML = `
          <div style="display:flex;align-items:baseline;justify-content:space-between;width:100%;margin-bottom:0.9rem;">
            <span style="font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-text-muted);">Toplam</span>
            <span style="font-family:var(--font-numeric);font-size:1.35rem;font-weight:600;color:var(--color-text-main);">${fmtMoney(cartTotal())}</span>
          </div>
          <div style="display:flex;gap:0.6rem;justify-content:flex-end;width:100%;">
            <button type="button" class="btn btn-secondary" data-close>Devam Et</button>
            <button type="button" class="btn btn-primary" data-checkout>Siparişi Tamamla</button>
          </div>`;
      }
      body.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
          cart = cart.filter(i => i.id !== btn.dataset.remove);
          paint();
          const lbl = document.querySelector(".store-nav .btn-ghost span");
          if (lbl) lbl.textContent = cartCount();
        });
      });
      const checkout = foot.querySelector("[data-checkout]");
      if (checkout) checkout.addEventListener("click", () => {
        const total = cartTotal();
        const count = cartCount();
        cart = [];
        overlay.classList.remove("open");
        setTimeout(() => overlay.remove(), 260);
        toast(`Sipariş talebiniz alındı — ${count} ürün, ${fmtMoney(total)}.`);
        rerender();
      });
      foot.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", close));
    };

    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Sepet" style="max-width:520px;">
        <div class="modal-header">
          <div class="modal-title">Sepet</div>
          <button type="button" class="modal-close" data-close aria-label="Kapat">×</button>
        </div>
        <div class="modal-body">
          <div data-cart-body style="display:flex;flex-direction:column;gap:0.75rem;"></div>
          <div data-cart-foot style="border-top:1px solid var(--color-border);margin-top:1.25rem;padding-top:1rem;display:flex;flex-direction:column;align-items:flex-end;"></div>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    void overlay.offsetWidth;
    overlay.classList.add("open");

    function close() {
      overlay.classList.remove("open");
      setTimeout(() => overlay.remove(), 260);
    }
    overlay.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", close));
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    paint();
  }

  function mount() {
    window.APP_STORE = {
      bind() {
        // kategori ve sepet butonları inline onclick ile bağlı
      },
      explore() {
        activeCategory = "Tümü";
        rerender();
        const grid = document.getElementById("store-categories");
        if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
        toast("Koleksiyonun tamamı gösteriliyor.");
      },
      setCategory(cat) {
        activeCategory = cat;
        rerender();
      },
      addToCart(id) {
        const p = storeProducts.find(x => x.id === id);
        if (!p || p.stock <= 0) return;
        const existing = cart.find(i => i.id === id);
        if (existing) existing.qty += 1;
        else cart.push({ id: p.id, name: p.name, price: p.price, color: p.color, image: p.image, pos: p.pos, qty: 1 });
        p.stock = Math.max(0, p.stock - 1);
        const lbl = document.querySelector(".store-nav .btn-ghost span");
        if (lbl) lbl.textContent = cartCount();
        toast("Sepete eklendi: " + p.name);
        // stok göstergesini tazele
        if (p.stock <= 0) rerender();
      },
      openCart
    };
  }

  window.VIEWS.store = { render, mount };
})();
