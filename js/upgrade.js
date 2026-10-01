(function () {
  "use strict";
  const app = document.querySelector("[data-upgrade-app]");
  if (!app || typeof UPGRADE_CONFIG === "undefined") return;
  const cfg = UPGRADE_CONFIG;
  const d = { current: "", storage: "", battery: "", condition: "", replaced: "", parts: [], photos: [], target: "", targetStorage: "", name: "", phone: "" };
  const $ = (s) => app.querySelector(s);
  const form = app.querySelector("[data-upgrade-form]");
  let steps = [...app.querySelectorAll("[data-upgrade-step]")];
  if (form && steps.length !== 7) {
    for (let index = 1; index <= 7; index++) {
      if (!form.querySelector(`[data-upgrade-step="${index}"]`)) {
        const stepElement = document.createElement("div");
        stepElement.className = "upgrade__step";
        stepElement.dataset.upgradeStep = String(index);
        stepElement.hidden = true;
        form.insertBefore(stepElement, app.querySelector("[data-upgrade-error]"));
      }
    }
    steps = [...form.querySelectorAll("[data-upgrade-step]")].sort((a, b) => Number(a.dataset.upgradeStep) - Number(b.dataset.upgradeStep));
  }
  const batteries = [["95-100", "95–100%"], ["90-94", "90–94%"], ["85-89", "85–89%"], ["80-84", "80–84%"], ["below80", "Abaixo de 80%"]];
  const conditions = [["excellent", "Excelente", "Sem marcas relevantes."], ["veryGood", "Muito bom", "Pequenos sinais de uso."], ["good", "Bom", "Marcas visíveis, funcionamento normal."], ["damaged", "Com marcas ou danos", "Trincas, amassados ou outros danos."]];
  const parts = [["screen", "Tela"], ["battery", "Bateria"], ["camera", "Câmera"], ["housing", "Carcaça"], ["faceId", "Face ID"], ["other", "Outros"]];
  const storeText = (v) => v === "1024" ? "1 TB" : `${v} GB`;
  const escape = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  let step = 1;
  const device = (id) => cfg.devices.find((x) => x.id === id);
  const track = (event, extra = {}) => window.dispatchEvent(new CustomEvent("rocoliv:analytics", { detail: { event, ...extra } }));
  const price = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  function select(label, key, opts, val, placeholder) { return `<label class="upgrade__label">${label}<select class="upgrade__select" data-field="${key}"><option value="">${placeholder}</option>${opts.map((o) => `<option value="${o.value}" ${val === o.value ? "selected" : ""}>${o.label}</option>`).join("")}</select></label>`; }
  function choices(title, opts, selected, multi = false) { return `<fieldset class="upgrade__fieldset"><legend>${title}</legend><div class="upgrade__choices">${opts.map(([v, t, sub]) => `<button class="upgrade__choice${selected === v || (multi && d.parts.includes(v)) ? " is-selected" : ""}" type="button" data-choice="${v}" aria-pressed="${selected === v || (multi && d.parts.includes(v))}"><span>${t}</span>${sub ? `<small>${sub}</small>` : ""}</button>`).join("")}</div></fieldset>`; }
  function render() {
    const old = device(d.current), next = device(d.target);
    const html = [
      `<p class="upgrade__eyebrow">01 — SEU APARELHO</p><h3>Qual iPhone você possui?</h3><p class="upgrade__helper">Escolha o modelo que usa hoje.</p>${select("Modelo", "current", cfg.devices.map((x) => ({ value: x.id, label: x.name })), d.current, "Selecione seu iPhone")}`,
      `<p class="upgrade__eyebrow">02 — ARMAZENAMENTO</p><h3>Quanto de armazenamento?</h3>${old ? choices("Capacidade do seu aparelho", old.storages.map((v) => [v, storeText(v)]), d.storage) : "Escolha primeiro seu aparelho."}`,
      `<p class="upgrade__eyebrow">03 — BATERIA</p><h3>Qual a saúde da bateria?</h3><div class="upgrade__battery" aria-hidden="true"><span style="--battery-fill:${d.battery ? (d.battery === "below80" ? 72 : Number(d.battery.split("-")[0])) : 0}%"></span></div>${choices("Selecione a faixa indicada em Ajustes", batteries, d.battery)}`,
      `<p class="upgrade__eyebrow">04 — ESTADO</p><h3>Como está o seu iPhone?</h3>${choices("Escolha a opção que mais se aproxima", conditions, d.condition)}`,
      `<p class="upgrade__eyebrow">05 — HISTÓRICO</p><h3>Alguma peça já foi substituída?</h3>${choices("Selecione uma opção", [["no", "Não"], ["yes", "Sim"]], d.replaced)}${d.replaced === "yes" ? choices("Quais peças? Selecione todas as opções", parts, "", true) : ""}`,
      `<p class="upgrade__eyebrow">06 — FOTOS</p><h3>Quer enviar fotos do seu aparelho?</h3><p class="upgrade__helper">Opcional: frente, traseira, laterais, tela ligada e detalhes de danos.</p><label class="upgrade__upload" data-drop><input type="file" accept="image/*" multiple data-photos><span class="upgrade__upload-icon">＋</span><strong>Escolher fotos</strong><small>ou arraste até aqui · até 5 imagens, 5 MB cada</small></label><div class="upgrade__previews">${d.photos.map((x, i) => `<figure><img src="${x.url}" alt="Prévia da foto ${i + 1}"><button type="button" data-remove="${i}" aria-label="Remover foto ${i + 1}">×</button></figure>`).join("")}</div><p class="upgrade__helper">As fotos não são anexadas automaticamente ao WhatsApp. Você poderá enviá-las na conversa.</p>`,
      `<p class="upgrade__eyebrow">07 — PRÓXIMO IPHONE</p><h3>Para qual modelo você quer ir?</h3><div class="upgrade__select-grid">${select("Modelo desejado", "target", cfg.devices.filter((x) => x.id !== d.current).map((x) => ({ value: x.id, label: x.name })), d.target, "Selecione seu próximo iPhone")}${select("Armazenamento", "targetStorage", (next?.storages || []).map((v) => ({ value: v, label: storeText(v) })), d.targetStorage, next ? "Selecione a capacidade" : "Escolha o modelo primeiro")}</div><div class="upgrade__contact"><p>Agilize a conversa (opcional)</p><label class="upgrade__label">Seu nome<input class="upgrade__input" data-field="name" autocomplete="name" value="${escape(d.name)}" placeholder="Como podemos chamar você?"></label><label class="upgrade__label">Seu telefone<input class="upgrade__input" type="tel" inputmode="tel" data-field="phone" autocomplete="tel" value="${escape(d.phone)}" placeholder="(11) 99999-9999"></label></div>`
    ];
    steps.forEach((el, i) => {
      const active = i === step - 1;
      el.innerHTML = html[i];
      el.hidden = !active;
      el.style.display = active ? "block" : "none";
      el.setAttribute("aria-hidden", String(!active));
    });
    $("[data-upgrade-counter]").textContent = `${String(step).padStart(2, "0")} / 07`;
    $("[data-upgrade-progress]").style.width = `${step / 7 * 100}%`;
    $("[data-upgrade-back]").hidden = step === 1;
    $("[data-upgrade-next]").innerHTML = step === 7 ? "Ver minha estimativa <span aria-hidden=\"true\">→</span>" : "Continuar <span aria-hidden=\"true\">→</span>";
    $("[data-upgrade-error]").hidden = true;
    bind();
    if (!steps[step - 1] || !steps[step - 1].textContent.trim()) {
      error("Não foi possível carregar esta etapa. Feche e tente abrir o configurador novamente.");
    }
  }
  function bind() {
    const active = steps[step - 1];
    active.querySelectorAll("[data-field]").forEach((el) => ["input", "change"].forEach((ev) => el.addEventListener(ev, () => {
      const key = el.dataset.field;
      if (key === "current") { d.current = el.value; d.storage = ""; render(); }
      else if (key === "target") { d.target = el.value; d.targetStorage = ""; render(); }
      else d[key] = el.value;
    })));
    active.querySelectorAll("[data-choice]").forEach((el) => el.addEventListener("click", () => {
      const v = el.dataset.choice;
      if (step === 2) d.storage = v;
      if (step === 3) d.battery = v;
      if (step === 4) d.condition = v;
      if (step === 5 && ["yes", "no"].includes(v)) { d.replaced = v; if (v === "no") d.parts = []; }
      else if (step === 5) d.parts = d.parts.includes(v) ? d.parts.filter((p) => p !== v) : [...d.parts, v];
      render();
    }));
    const input = active.querySelector("[data-photos]");
    if (input) {
      input.addEventListener("change", () => addPhotos(input.files));
      const drop = active.querySelector("[data-drop]");
      ["dragover", "dragenter"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-dragging"); }));
      ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-dragging"); }));
      drop.addEventListener("drop", (e) => addPhotos(e.dataTransfer.files));
    }
    active.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => { URL.revokeObjectURL(d.photos.splice(+b.dataset.remove, 1)[0].url); render(); }));
  }
  function addPhotos(files) {
    const all = [...files].filter((f) => f.type.startsWith("image/"));
    const valid = all.filter((f) => f.size <= 5 * 1024 * 1024).slice(0, 5 - d.photos.length);
    valid.forEach((file) => d.photos.push({ file, url: URL.createObjectURL(file) }));
    if (valid.length < all.length) error(all.some((f) => f.size > 5 * 1024 * 1024) ? "Cada imagem precisa ter no máximo 5 MB." : "Você pode adicionar até 5 imagens.");
    render();
  }
  function error(msg) { const e = $("[data-upgrade-error]"); e.textContent = msg; e.hidden = false; }
  function validate() {
    if (step === 1 && !d.current) return "Escolha o modelo do iPhone que você possui.";
    if (step === 2 && !d.storage) return "Escolha o armazenamento do aparelho.";
    if (step === 3 && !d.battery) return "Selecione a faixa de saúde da bateria.";
    if (step === 4 && !d.condition) return "Selecione o estado do aparelho.";
    if (step === 5 && !d.replaced) return "Informe se alguma peça foi substituída.";
    if (step === 5 && d.replaced === "yes" && !d.parts.length) return "Selecione as peças ou informe que nenhuma foi substituída.";
    if (step === 7 && (!d.target || !d.targetStorage)) return "Escolha modelo e armazenamento do próximo iPhone.";
    if (step === 7 && d.phone && d.phone.replace(/\D/g, "").length < 10) return "Confira o telefone ou deixe o campo em branco.";
    return "";
  }
  function estimate() {
    const old = device(d.current), next = device(d.target);
    if (typeof old.baseValue !== "number" || typeof old.storageValues[d.storage] !== "number" || typeof cfg.batteryAdjustments[d.battery] !== "number" || typeof cfg.conditionAdjustments[d.condition] !== "number") return null;
    let trade = old.baseValue + old.storageValues[d.storage] + cfg.batteryAdjustments[d.battery] + cfg.conditionAdjustments[d.condition];
    for (const p of d.parts) { if (typeof cfg.replacedPartAdjustments[p] !== "number") return null; trade += cfg.replacedPartAdjustments[p]; }
    const sale = cfg.destinationPrices[`${next.id}:${d.targetStorage}`];
    return typeof sale === "number" ? Math.max(0, sale - Math.max(0, trade)) : null;
  }
  function finish() {
    const amount = estimate(), old = device(d.current), next = device(d.target);
    const battery = batteries.find(([k]) => k === d.battery)[1], condition = conditions.find(([k]) => k === d.condition)[1];
    const partNames = d.parts.map((p) => parts.find(([k]) => k === p)[1]);
    const pricing = amount === null ? `<p class="upgrade__result-price upgrade__result-price--pending">Sob consulta</p><p class="upgrade__result-copy">A tabela de valores será confirmada com você pela equipe Rocoliv.</p>` : `<p class="upgrade__result-price" data-amount="${amount}">${price(amount)}</p><p class="upgrade__result-copy">Seu upgrade começa em aproximadamente ${price(amount)}.</p>`;
    $("[data-upgrade-result]").innerHTML = `<p class="upgrade__eyebrow">SUA ESTIMATIVA INICIAL</p><h3>${amount === null ? "Vamos calcular junto." : "Seu próximo iPhone está mais perto."}</h3>${pricing}<div class="upgrade__summary"><div><span>Seu aparelho</span><strong>${old.name} · ${storeText(d.storage)}</strong></div><div><span>Próximo iPhone</span><strong>${next.name} · ${storeText(d.targetStorage)}</strong></div><div><span>Estado informado</span><strong>${condition} · bateria ${battery}</strong></div><div><span>Peças</span><strong>${d.replaced === "no" ? "Nenhuma substituída" : partNames.join(", ")}</strong></div></div><p class="upgrade__disclaimer">A avaliação final depende da análise física e funcional do aparelho pela equipe Rocoliv. ${d.photos.length ? `Você selecionou ${d.photos.length} foto(s); envie-as na conversa do WhatsApp.` : ""}</p><div class="upgrade__lead"><label class="upgrade__label">Seu nome<input class="upgrade__input" data-lead="name" autocomplete="name" value="${escape(d.name)}" placeholder="Seu nome (opcional)"></label><label class="upgrade__label">Telefone<input class="upgrade__input" data-lead="phone" type="tel" inputmode="tel" autocomplete="tel" value="${escape(d.phone)}" placeholder="Seu telefone (opcional)"></label></div><div class="upgrade__result-actions"><button class="upgrade__button" type="button" data-send>Quero fazer meu upgrade <span aria-hidden="true">→</span></button><button class="upgrade__back" type="button" data-reset>Refazer avaliação</button></div>`;
    $("[data-upgrade-wizard]").hidden = true; $("[data-upgrade-result]").hidden = false;
    $("[data-lead=name]").addEventListener("input", (e) => d.name = e.target.value);
    $("[data-lead=phone]").addEventListener("input", (e) => d.phone = e.target.value);
    $("[data-send]").addEventListener("click", send); $("[data-reset]").addEventListener("click", reset);
    track("upgrade_completed", { estimateAvailable: amount !== null }); track("upgrade_result_viewed", { estimateAvailable: amount !== null });
  }
  function send() {
    const old = device(d.current), next = device(d.target), amount = estimate();
    const message = [`🚀 NOVO UPGRADE — ROCOLIV`, d.name && `Nome: ${d.name}`, d.phone && `Telefone: ${d.phone}`, "", "APARELHO ATUAL", `Modelo: ${old.name}`, `Armazenamento: ${storeText(d.storage)}`, `Bateria: ${batteries.find(([k]) => k === d.battery)[1]}`, `Estado: ${conditions.find(([k]) => k === d.condition)[1]}`, `Peças substituídas: ${d.replaced === "no" ? "Não" : d.parts.map((p) => parts.find(([k]) => k === p)[1]).join(", ")}`, "", "UPGRADE DESEJADO", `Modelo: ${next.name}`, `Armazenamento: ${storeText(d.targetStorage)}`, "", `Estimativa: ${amount === null ? "A confirmar" : price(amount)}`, "", "OBSERVAÇÃO", "Valor sujeito à avaliação final do aparelho pela equipe Rocoliv.", d.photos.length && `Tenho ${d.photos.length} foto(s) para enviar nesta conversa.`].filter(Boolean).join("\n");
    track("upgrade_whatsapp_clicked"); window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  function reset() { d.photos.forEach((p) => URL.revokeObjectURL(p.url)); Object.assign(d, { current: "", storage: "", battery: "", condition: "", replaced: "", parts: [], photos: [], target: "", targetStorage: "", name: "", phone: "" }); step = 1; $("[data-upgrade-result]").hidden = true; $("[data-upgrade-welcome]").hidden = false; $("[data-upgrade-wizard]").hidden = true; }
  app.querySelector("[data-upgrade-start]").addEventListener("click", () => {
    $("[data-upgrade-welcome]").hidden = true;
    $("[data-upgrade-wizard]").hidden = false;
    step = 1;
    try { render(); track("upgrade_started"); }
    catch (exception) {
      console.error("Falha ao carregar o configurador de upgrade:", exception);
      error(`Não foi possível carregar o configurador: ${exception.message || "erro inesperado"}. Atualize a página e tente novamente.`);
    }
  });
  app.querySelector("[data-upgrade-close]").addEventListener("click", () => { $("[data-upgrade-wizard]").hidden = true; $("[data-upgrade-welcome]").hidden = false; });
  app.querySelector("[data-upgrade-back]").addEventListener("click", () => { if (step > 1) { step--; render(); } });
  app.querySelector("[data-upgrade-next]").addEventListener("click", () => { const msg = validate(); if (msg) return error(msg); track("upgrade_step_completed", { step }); if (step < 7) { step++; render(); } else { const b = $("[data-upgrade-next]"); b.disabled = true; b.textContent = "Preparando…"; setTimeout(() => { finish(); }, 220); } });
}());
