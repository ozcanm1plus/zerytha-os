/* =========================================================================
   ZERYTHA OS — System Settings (Sistem Ayarları)
   Şirket ve kullanıcı bilgileri STATE üzerinde kalıcı tutulur.
   ========================================================================= */
(function () {
  const { STATE, toast, $ } = window.APP;

  function esc(t) {
    return String(t === null || t === undefined ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function render() {
    const c = STATE.company;
    const u = STATE.user;
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Sistem Ayarları</h1>
    <p class="page-subtitle">Şirket bilgileri, kullanıcılar ve sistem tercihleri</p>
  </div>
  <div class="page-actions">
    <button class="btn btn-primary btn-sm" id="settings-save">Değişiklikleri Kaydet</button>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;" class="settings-grid">
  <div class="card">
    <div class="card-body">
      <div class="section-title">Şirket Bilgileri</div>
      <div class="form-group">
        <label class="form-label" for="set-company-name">Şirket Adı</label>
        <input class="form-input" id="set-company-name" value="${esc(c.name)}">
      </div>
      <div class="form-group">
        <label class="form-label" for="set-company-tax">Vergi No</label>
        <input class="form-input" id="set-company-tax" value="${esc(c.taxNo)}">
      </div>
      <div class="form-group">
        <label class="form-label" for="set-company-address">Adres</label>
        <textarea class="form-textarea" id="set-company-address">${esc(c.address)}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="set-company-currency">Para Birimi</label>
        <select class="form-select" id="set-company-currency">
          ${["TRY — Türk Lirası", "EUR — Euro", "USD — Amerikan Doları"].map(x =>
            `<option ${x === c.currency ? "selected" : ""}>${x}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="set-company-qr">QR Sistem Adresi (sunucu URL)</label>
        <input class="form-input" id="set-company-qr" value="${esc(c.qrBaseUrl || "")}" placeholder="Ör. http://192.168.1.10:8123">
        <div class="form-hint" style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.35rem;">Telefonla QR okutulduğunda açılacak adres. Boşsa QR iş emri bilgilerini metin olarak taşır (sistem bağlantısı için sunucu adresi gerekli).</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="section-title">Kullanıcı</div>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;">
        <div class="user-avatar" id="set-avatar" style="width:52px;height:52px;font-size:1.25rem;">${esc(u.initials)}</div>
        <div>
          <div style="font-weight:600;color:var(--color-text-main);" id="set-user-display">${esc(u.name)}</div>
          <div style="font-size:0.8125rem;color:var(--color-text-secondary);" id="set-role-display">${esc(u.role)}</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="set-user-name">Ad Soyad</label>
        <input class="form-input" id="set-user-name" value="${esc(u.name)}">
      </div>
      <div class="form-group">
        <label class="form-label" for="set-user-email">E-posta</label>
        <input class="form-input" id="set-user-email" type="email" value="${esc(u.email || "")}">
      </div>
      <div class="form-group">
        <label class="form-label" for="set-user-role">Rol</label>
        <select class="form-select" id="set-user-role">
          ${["İşletme Yöneticisi", "Üretim Sorumlusu", "Depo Sorumlusu", "Muhasebe"].map(x =>
            `<option ${x === u.role ? "selected" : ""}>${x}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="set-user-language">Dil</label>
        <select class="form-select" id="set-user-language">
          ${["Türkçe", "English", "Italiano"].map(x =>
            `<option ${x === (u.language || "Türkçe") ? "selected" : ""}>${x}</option>`).join("")}
        </select>
      </div>
    </div>
  </div>
</div>

<div class="card" style="margin-top:1.5rem;">
  <div class="card-body">
    <div class="section-title">Üretim Aşamaları</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
      ${["ÖRME", "DİKİM", "YIKAMA", "ÜTÜ", "BİTİM", "PAKETLEME"].map(s => `<span class="badge badge-production">${s}</span>`).join("")}
    </div>
    <div style="font-size:0.8125rem;color:var(--color-text-secondary);margin-top:0.75rem;">
      Üretim aşamaları sabittir ve Üretim Kontrol Paneli ile aynı sırayı kullanır.
    </div>
  </div>
</div>

<div class="card" style="margin-top:1.5rem;">
  <div class="card-body">
    <div class="section-title">Firebase Bulut Veritabanı (opsiyonel)</div>
    <div class="form-group">
      <label class="form-label" for="set-firebase-config">Firebase Config (JSON)</label>
      <textarea class="form-textarea" id="set-firebase-config" rows="6" placeholder='{"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"..."}'>${esc(STATE.firebaseConfig && Object.keys(STATE.firebaseConfig).length ? JSON.stringify(STATE.firebaseConfig) : "")}</textarea>
      <div class="form-hint" style="font-size:0.72rem;color:var(--color-text-muted);margin-top:0.35rem;">Firebase Console → Project settings → Web app config. Boş bırakılırsa yerel (localStorage) mod çalışır. Kaydedince sayfayı yenileyin.</div>
    </div>
  </div>
</div>
`;
  }

  function mount() {
    const btn = document.getElementById("settings-save");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const nameEl = document.getElementById("set-company-name");
      const taxEl = document.getElementById("set-company-tax");
      const addrEl = document.getElementById("set-company-address");
      const currEl = document.getElementById("set-company-currency");
      const userNameEl = document.getElementById("set-user-name");
      const userEmailEl = document.getElementById("set-user-email");
      const userRoleEl = document.getElementById("set-user-role");
      const userLangEl = document.getElementById("set-user-language");

      const name = (userNameEl.value || "").trim();
      if (!name) { toast("Kullanıcı adı boş olamaz."); userNameEl.focus(); return; }
      const email = (userEmailEl.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("Geçerli bir e-posta adresi girin.");
        userEmailEl.focus();
        return;
      }
      const companyName = (nameEl.value || "").trim();
      if (!companyName) { toast("Şirket adı boş olamaz."); nameEl.focus(); return; }

      STATE.company.name = companyName;
      STATE.company.taxNo = (taxEl.value || "").trim();
      STATE.company.address = (addrEl.value || "").trim();
      STATE.company.currency = currEl.value;
      const qrEl = document.getElementById("set-company-qr");
      STATE.company.qrBaseUrl = qrEl ? qrEl.value.trim() : STATE.company.qrBaseUrl;

      const fbEl = document.getElementById("set-firebase-config");
      if (fbEl) {
        const txt = fbEl.value.trim();
        if (txt) {
          try { STATE.firebaseConfig = JSON.parse(txt); }
          catch (e) { toast("Firebase config JSON geçersiz."); return; }
        } else {
          STATE.firebaseConfig = {};
        }
      }

      STATE.user.name = name;
      STATE.user.email = email;
      STATE.user.role = userRoleEl.value;
      STATE.user.language = userLangEl.value;
      STATE.user.initials = name.split(" ").filter(Boolean)
        .map(p => p.charAt(0)).slice(0, 2).join("").toUpperCase() || "Z";

      // Görünümü anında senkronize et
      const avatar = document.getElementById("set-avatar");
      const display = document.getElementById("set-user-display");
      const roleDisplay = document.getElementById("set-role-display");
      if (avatar) avatar.textContent = STATE.user.initials;
      if (display) display.textContent = STATE.user.name;
      if (roleDisplay) roleDisplay.textContent = STATE.user.role;

      window.APP.syncChrome();
      if (window.APP.refreshChrome) window.APP.refreshChrome();
      if (window.APP.saveSettings) window.APP.saveSettings();
      toast("Ayarlar kaydedildi.");
    });
  }

  window.VIEWS.settings = { render, mount };
})();
