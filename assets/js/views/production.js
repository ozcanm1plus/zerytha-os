/* =========================================================================
   ZERYTHA OS — Production Control Panel (Üretim Kontrol Paneli)
   Kanban: ÖRME / DİKİM / YIKAMA / ÜTÜ / BİTİM / PAKETLEME
   ========================================================================= */
(function() {
  const { STATE, fmtDate, fmtNumber, pct, toast, $, $$, navigate } = window.APP;

  const STAGES = [
    { key: "KNITTING", label: "ÖRME / KNITTING", color: "badge-production" },
    { key: "LINKING", label: "DİKİM / LINKING", color: "badge-production" },
    { key: "WASHING", label: "YIKAMA / WASHING", color: "badge-production" },
    { key: "IRONING", label: "ÜTÜ / IRONING", color: "badge-production" },
    { key: "FINISHING", label: "BİTİM / FINISHING", color: "badge-production" },
    { key: "PACKAGING", label: "PAKETLEME / PACKAGING", color: "badge-production" }
  ];

  let viewMode = "kanban"; // kanban | list | calendar

  function render() {
    return `
<div class="page-header">
  <div>
    <h1 class="page-title text-brand">Üretim Kontrol Paneli</h1>
    <p class="page-subtitle">Örme, dikiş, yıkama, ütü, bitim ve paketleme takibi</p>
  </div>
  <div class="page-actions">
    <div class="btn-group" style="border:1px solid var(--color-border);border-radius:var(--radius-md);overflow:hidden;">
      <button class="btn btn-ghost btn-sm" onclick="APP_PROD.setMode('kanban')" id="pm-kanban" aria-label="Kanban görünümü">Kanban</button>
      <button class="btn btn-ghost btn-sm" onclick="APP_PROD.setMode('list')" id="pm-list" aria-label="Liste görünümü">Liste</button>
      <button class="btn btn-ghost btn-sm" onclick="APP_PROD.setMode('calendar')" id="pm-calendar" aria-label="Takvim görünümü">Takvim</button>
    </div>
    <button class="btn btn-primary btn-sm" onclick="APP_PROD.newCard()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Yeni Kart</button>
  </div>
</div>

<div id="prod-kanban" class="prod-kanban">
  ${STAGES.map(s => `
  <div class="prod-column">
    <div class="prod-column-head">
      <div class="prod-column-title">${s.label}</div>
      <div class="prod-column-count" id="pm-count-${s.key}">0</div>
    </div>
    <div class="prod-column-body" id="pm-body-${s.key}"></div>
  </div>
  `).join("")}
</div>

<div id="prod-list" style="display:none;">
  <div class="card">
    <div class="card-body">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Model Kodu</th><th>Müşteri</th><th>Aşama</th><th>Miktar</th><th>Tamamlanan</th><th>İlerleme</th><th>Sorumlu</th><th>Planlanmış Bitiş</th><th>Durum</th>
            </tr>
          </thead>
          <tbody id="pm-list-body"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<div id="prod-calendar" style="display:none;">
  <div class="card">
    <div class="card-body">
      <div class="section-title">Üretim Takvimi</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">
        <div>Pazartesi</div><div>Salı</div><div>Çarşamba</div><div>Perşembe</div><div>Cuma</div><div>Cumartesi</div><div>Pazar</div>
      </div>
      <div id="pm-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;"></div>
    </div>
  </div>
</div>

<!-- Modal: Yeni üretim kartı -->
<div class="modal-overlay" id="prod-modal" style="display:none;">
  <div class="modal" style="max-width:560px;">
    <div class="modal-header">
      <div class="modal-title">Yeni Üretim Kartı</div>
      <button class="modal-close" onclick="APP_PROD.closeModal()">×</button>
    </div>
    <div class="modal-body">
      <form id="prod-form">
        <div class="form-group">
          <label class="form-label">Model Kodu</label>
          <input type="text" class="form-input" id="p-model" placeholder="Örn. MK-9021" required>
        </div>
        <div class="form-group">
          <label class="form-label">Müşteri</label>
          <input type="text" class="form-input" id="p-customer" placeholder="Örn. Armani Knitwear" required>
        </div>
        <div class="form-group">
          <label class="form-label">Aşama</label>
          <select class="form-select" id="p-stage" required>
            ${STAGES.map(s=>`<option value="${s.key}">${s.label}</option>`).join("")}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Üretim Miktarı</label>
            <input type="number" class="form-input" id="p-qty" min="1" value="100" required>
          </div>
          <div class="form-group">
            <label class="form-label">Tamamlanan</label>
            <input type="number" class="form-input" id="p-done" min="0" value="0" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Sorumlu Operatör / Atölye</label>
            <input type="text" class="form-input" id="p-operator" placeholder="Örn. Atölye A – Mehmet Yılmaz" required>
          </div>
          <div class="form-group">
            <label class="form-label">Planlanmış Tamamlanma</label>
            <input type="date" class="form-input" id="p-planned" required>
          </div>
        </div>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="APP_PROD.closeModal()">İptal</button>
          <button type="submit" class="btn btn-primary">Kart Oluştur</button>
        </div>
      </form>
    </div>
  </div>
</div>
`;
  }

  function mount() {
    window.APP_PROD = {
      setMode(mode) {
        viewMode = mode;
        ["kanban","list","calendar"].forEach(m => {
          const el = document.getElementById("prod-"+m);
          const btn = document.getElementById("pm-"+m);
          if (el) el.style.display = (m===mode) ? "" : "none";
          if (btn) btn.classList.toggle("btn-secondary", m!==mode);
          if (btn) btn.classList.toggle("btn-primary", m===mode);
        });
        renderCards();
        if (mode==="list") renderList();
        if (mode==="calendar") renderCalendar();
      },
      newCard() {
        document.getElementById("prod-modal").style.display = "block";
        document.getElementById("p-planned").value = new Date().toISOString().split("T")[0];
        document.getElementById("prod-form").onsubmit = (e) => {
          e.preventDefault();
          const card = {
            id: "P-" + String(100 + Math.floor(Math.random()*900)),
            model: $("#p-model").value.trim(),
            customer: $("#p-customer").value.trim(),
            stage: $("#p-stage").value,
            qty: parseInt($("#p-qty").value) || 0,
            done: parseInt($("#p-done").value) || 0,
            operator: $("#p-operator").value.trim(),
            planned: $("#p-planned").value,
            delayed: false,
            thumbnail: null
          };
          if (card.done > card.qty) card.done = card.qty;
          card.delayed = new Date(card.planned) < new Date() && card.done < card.qty;
          STATE.production.push(card);
          toast("Üretim kartı oluşturuldu: " + card.model);
          APP_PROD.closeModal();
          renderCards();
          if (viewMode==="list") renderList();
          if (viewMode==="calendar") renderCalendar();
        };
      },
      closeModal() {
        document.getElementById("prod-modal").style.display = "none";
      },
      updateCard(id, field, value) {
        const c = STATE.production.find(x=>x.id===id);
        if (!c) return;
        c[field] = value;
        if (field==="done" || field==="qty") {
          if (c.done > c.qty) c.done = c.qty;
          c.delayed = new Date(c.planned) < new Date() && c.done < c.qty;
        }
        renderCards();
        if (viewMode==="list") renderList();
      },
      editCard(id) {
        const c = STATE.production.find(x=>x.id===id);
        if (!c) return;
        window.APP.openFormModal({
          title: "Üretim Kartını Güncelle — " + c.model,
          submitLabel: "Güncelle",
          fields: [
            { name: "done", label: "Tamamlanan Adet", type: "number", min: 0, max: c.qty, required: true, value: c.done },
            { name: "stage", label: "Aşama", type: "select", required: true, value: c.stage,
              options: STAGES.map(s => ({ value: s.key, label: s.label })) },
            { name: "operator", label: "Operatör", value: c.operator || "" },
            { name: "planned", label: "Planlanan Tarih", type: "date", required: true, value: c.planned }
          ],
          onSubmit(data) {
            const n = Math.max(0, Math.min(c.qty, Number(data.done) || 0));
            c.done = n;
            c.stage = data.stage;
            c.operator = data.operator;
            c.planned = data.planned;
            c.delayed = new Date(c.planned) < new Date() && c.done < c.qty;
            renderCards();
            if (viewMode==="list") renderList();
            if (viewMode==="calendar") renderCalendar();
            toast("İlerleme güncellendi: " + c.model);
          }
        });
      }
    };

    renderCards();
  }

  function renderCards() {
    STATE.production.forEach(c => {
      c.delayed = c.delayed !== undefined ? c.delayed : (new Date(c.planned) < new Date() && c.done < c.qty);
    });

    STAGES.forEach(s => {
      const body = document.getElementById("pm-body-"+s.key);
      const countEl = document.getElementById("pm-count-"+s.key);
      if (!body) return;
      const cards = STATE.production.filter(c=>c.stage===s.key);
      countEl.textContent = cards.length;
      body.innerHTML = cards.map(c => {
        const percentage = pct(c.done, c.qty);
        const overdue = new Date(c.planned) < new Date() && c.done < c.qty;
        return `
        <div class="prod-card ${c.delayed?'delayed':''}" onclick="APP_PROD.editCard('${c.id}')">
          <div class="prod-card-thumb" style="background:${c.thumbnail?'url('+c.thumbnail+')':'#1F221F'};">
            ${c.thumbnail ? `<img src="${c.thumbnail}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:grid;place-items:center;color:var(--color-text-muted);font-size:0.65rem;">Görsel yok</div>`}
          </div>
          <div class="prod-card-body">
            <div class="prod-card-model" title="${escapeHtml(c.model)}">${escapeHtml(c.model)}</div>
            <div class="prod-card-customer">${escapeHtml(c.customer)}</div>
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--color-text-secondary);margin:0.5rem 0 0.25rem;">
              <span>${c.done} / ${c.qty}</span>
              <span>${percentage}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill ${c.delayed?'delayed':(percentage===100?'completed':'')}" style="width:${percentage}%;"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--color-text-muted);margin-top:0.5rem;">
              <span>${escapeHtml(c.operator)}</span>
              <span style="color:${overdue?'var(--color-error)':'inherit'};">${fmtDate(c.planned)}${overdue?' • GECİKİLDİ':''}</span>
            </div>
          </div>
        </div>
        `;
      }).join("");
    });
  }

  function renderList() {
    const tbody = document.getElementById("pm-list-body");
    if (!tbody) return;
    const rows = STATE.production.map(c => {
      const percentage = pct(c.done, c.qty);
      const overdue = new Date(c.planned) < new Date() && c.done < c.qty;
      return `<tr>
        <td style="font-family:var(--font-numeric);font-weight:600;">${escapeHtml(c.model)}</td>
        <td style="color:var(--color-text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(c.customer)}</td>
        <td><span class="badge badge-production">${STAGES.find(s=>s.key===c.stage).label}</span></td>
        <td style="font-family:var(--font-numeric);">${fmtNumber(c.qty)}</td>
        <td style="font-family:var(--font-numeric);">${fmtNumber(c.done)}</td>
        <td><div class="progress-bar" style="width:120px;height:4px;"><div class="progress-fill ${c.delayed?'delayed':''}" style="width:${percentage}%;"></div></div> ${percentage}%</td>
        <td style="color:var(--color-text-main);font-size:0.8125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(c.operator)}</td>
        <td style="color:${overdue?'var(--color-error)':'var(--color-text-main)'};font-weight:600;font-size:0.8125rem;">${fmtDate(c.planned)}${overdue?' <span style="font-size:0.7rem;">GECİKİLDİ</span>':''}</td>
        <td style="color:${overdue?'var(--color-error)':'var(--color-success)'};font-weight:600;font-size:0.75rem;">${overdue?'Gecikme Riski':'Normal'}</td>
      </tr>`;
    }).join("");
    tbody.innerHTML = rows;
  }

  function renderCalendar() {
    const grid = document.getElementById("pm-cal-grid");
    if (!grid) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDay = start.getDay() === 0 ? 6 : start.getDay() - 1;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    let html = "";
    for (let i=0;i<firstDay;i++) html += `<div style="height:120px;"></div>`;
    for (let d=1;d<=daysInMonth;d++) {
      const dateStr = new Date(now.getFullYear(), now.getMonth(), d).toISOString().split("T")[0];
      const due = STATE.production.filter(c=>c.planned===dateStr);
      html += `<div style="border:1px solid var(--color-border);border-radius:var(--radius-sm);height:120px;position:relative;display:flex;flex-direction:column;">
        <div style="padding:0.5rem;font-size:0.8125rem;font-weight:600;color:var(--color-text-main);border-bottom:1px solid #1F221F;">${d}</div>
        <div style="flex:1;padding:0.5rem;overflow:hidden;">
          ${due.map(c=>`<div style="font-size:0.7rem;background:var(--color-gold);color:var(--color-bg);padding:2px 6px;border-radius:2px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.model}</div>`).join("")}
        </div>
      </div>`;
    }
    grid.innerHTML = html;
  }

  function escapeHtml(t){ if(!t)return ""; return String(t).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }

  window.VIEWS.production = { render, mount };
})();
