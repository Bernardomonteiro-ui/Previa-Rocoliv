(function () {
  "use strict";
  const app = document.querySelector("[data-upgrade-app]");
  if (!app || typeof UPGRADE_CONFIG === "undefined") return;
  const cfg = UPGRADE_CONFIG;
  const TOTAL_STEPS = 4;

  /* Estado do formulário. Nada aqui vira preço — isso é só o que a
     equipe da Rocoliv vai ler no WhatsApp para fazer a avaliação. */
  const d = {
    current: "",
    storage: "",
    battery: "90",
    condition: "",
    replaced: "",
    parts: [],
    partsOther: "",
    observacoes: "",
    photos: []
  };

  const $ = (s) => app.querySelector(s);
  const form = app.querySelector("[data-upgrade-form]");
  let steps = [...app.querySelectorAll("[data-upgrade-step]")];
  if (form && steps.length !== TOTAL_STEPS) {
    form.querySelectorAll("[data-upgrade-step]").forEach((el) => el.remove());
    for (let index = 1; index <= TOTAL_STEPS; index++) {
      const stepElement = document.createElement("div");
      stepElement.className = "upgrade__step";
      stepElement.dataset.upgradeStep = String(index);
      stepElement.hidden = true;
      form.insertBefore(stepElement, app.querySelector("[data-upgrade-error]"));
    }
    steps = [...form.querySelectorAll("[data-upgrade-step]")].sort(
      (a, b) => Number(a.dataset.upgradeStep) - Number(b.dataset.upgradeStep)
    );
  }

  const conditions = [
    ["excellent", "Excelente", "Pouquíssimos sinais de uso."],
    ["veryGood", "Muito bom", "Pequenos sinais de uso."],
    ["good", "Bom", "Sinais normais de uso."],
    ["marked", "Com marcas", "Riscos, amassados ou desgaste visível."],
    ["damaged", "Danificado", "Danos significativos."]
  ];
  const parts = [
    ["screen", "Tela"],
    ["battery", "Bateria"],
    ["camera", "Câmera"],
    ["housing", "Carcaça"],
    ["faceId", "Face ID"],
    ["other", "Outro"]
  ];
  const storeText = (v) => ({ "1024": "1 TB", "2048": "2 TB" }[v] || `${v} GB`);
  const escape = (v) =>
    String(v || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let step = 1;
  const device = (id) => cfg.devices.find((x) => x.id === id);
  const track = (event, extra = {}) => window.dispatchEvent(new CustomEvent("rocoliv:analytics", { detail: { event, ...extra } }));

  function select(label, key, opts, val, placeholder) {
    return `<label class="upgrade__label">${label}<select class="upgrade__select" data-field="${key}"><option value="">${placeholder}</option>${opts
      .map((o) => `<option value="${o.value}" ${val === o.value ? "selected" : ""}>${o.label}</option>`)
      .join("")}</select></label>`;
  }

  function choices(title, opts, selected, group, multi = false) {
    return `<fieldset class="upgrade__fieldset"><legend>${title}</legend><div class="upgrade__choices">${opts
      .map(([v, t, sub]) => {
        const ativo = multi ? d.parts.includes(v) : selected === v;
        return `<button class="upgrade__choice${ativo ? " is-selected" : ""}" type="button" data-choice="${v}" data-group="${group}" aria-pressed="${ativo}"><span>${t}</span>${sub ? `<small>${sub}</small>` : ""}</button>`;
      })
      .join("")}</div></fieldset>`;
  }

  function render() {
    const old = device(d.current);
    const html = [
      // 01 — Seu iPhone
      `<p class="upgrade__eyebrow">01 — SEU IPHONE</p><h3>Qual iPhone você possui?</h3><p class="upgrade__helper">Escolha o modelo e o armazenamento do aparelho que você tem hoje.</p>${select(
        "Modelo",
        "current",
        cfg.devices.map((x) => ({ value: x.id, label: x.name })),
        d.current,
        "Selecione seu iPhone"
      )}${old ? choices("Armazenamento do seu aparelho", old.storages.map((v) => [v, storeText(v)]), d.storage, "storage") : ""}`,

      // 02 — Estado do aparelho
      `<p class="upgrade__eyebrow">02 — ESTADO DO APARELHO</p><h3>Como está o seu iPhone?</h3><label class="upgrade__label">Saúde da bateria <strong data-battery-out>${d.battery}%</strong><input type="range" class="upgrade__range" min="1" max="100" value="${d.battery}" data-field="battery" aria-label="Saúde da bateria em porcentagem"></label>${choices(
        "Estado de conservação",
        conditions,
        d.condition,
        "condition"
      )}${choices("Alguma peça já foi substituída?", [["no", "Não"], ["yes", "Sim"]], d.replaced, "replaced")}${
        d.replaced === "yes" ? choices("Quais peças? Selecione todas as opções", parts, "", "parts", true) : ""
      }${
        d.replaced === "yes" && d.parts.includes("other")
          ? `<label class="upgrade__label">Qual peça foi substituída?<input class="upgrade__input" data-field="partsOther" value="${escape(d.partsOther)}" placeholder="Descreva a peça"></label>`
          : ""
      }`,

      // 03 — Detalhes (observações + fotos)
      `<p class="upgrade__eyebrow">03 — DETALHES</p><h3>Mais alguma informação?</h3><label class="upgrade__label">Observações (opcional)<textarea class="upgrade__input upgrade__textarea" data-field="observacoes" placeholder="Conte algum detalhe que possa ajudar na avaliação.">${escape(
        d.observacoes
      )}</textarea></label><p class="upgrade__helper" style="margin-top:22px">Mostre seu iPhone: fotos ajudam nossa equipe a avaliar melhor o estado do aparelho.</p><label class="upgrade__upload" data-drop><input type="file" accept="image/*" multiple data-photos><span class="upgrade__upload-icon">＋</span><strong>Escolher fotos</strong><small>ou arraste até aqui · até 5 imagens, 5 MB cada</small></label><div class="upgrade__previews">${d.photos
        .map((x, i) => `<figure><img src="${x.url}" alt="Prévia da foto ${i + 1}"><button type="button" data-remove="${i}" aria-label="Remover foto ${i + 1}">×</button></figure>`)
        .join("")}</div><p class="upgrade__helper">As fotos não são anexadas automaticamente ao WhatsApp. Depois de enviar, você poderá anexá-las direto na conversa.</p>`,

      // 04 — Revisão
      `<p class="upgrade__eyebrow">04 — REVISÃO</p><h3>Revise antes de enviar</h3><div class="upgrade__summary"><div><span>Seu aparelho</span><strong>${
        old ? `${old.name} · ${storeText(d.storage)}` : "—"
      }</strong></div><div><span>Bateria</span><strong>${d.battery}%</strong></div><div><span>Estado</span><strong>${condLabel()}</strong></div><div><span>Peças substituídas</span><strong>${resumoPecas()}</strong></div></div>${
        d.observacoes.trim()
          ? `<p class="upgrade__helper"><strong style="color:var(--branco)">Observações:</strong> ${escape(d.observacoes)}</p>`
          : ""
      }<p class="upgrade__helper">${
        d.photos.length ? `${d.photos.length} foto(s) selecionada(s).` : "Nenhuma foto selecionada ainda — você também pode enviar depois, direto na conversa do WhatsApp."
      }</p><p class="upgrade__disclaimer">Nossa equipe vai analisar essas informações (e as fotos, se enviadas) e responder com o valor do seu upgrade pelo WhatsApp.</p>`
    ];
    steps.forEach((el, i) => {
      const active = i === step - 1;
      el.innerHTML = html[i];
      el.hidden = !active;
      el.style.display = active ? "block" : "none";
      el.setAttribute("aria-hidden", String(!active));
    });
    $("[data-upgrade-counter]").textContent = `${String(step).padStart(2, "0")} / 0${TOTAL_STEPS}`;
    $("[data-upgrade-progress]").style.width = `${(step / TOTAL_STEPS) * 100}%`;
    $("[data-upgrade-back]").hidden = step === 1;
    $("[data-upgrade-next]").innerHTML =
      step === TOTAL_STEPS ? 'Enviar para avaliação <span aria-hidden="true">→</span>' : 'Continuar <span aria-hidden="true">→</span>';
    $("[data-upgrade-error]").hidden = true;
    bind();
    if (!steps[step - 1] || !steps[step - 1].textContent.trim()) {
      error("Não foi possível carregar esta etapa. Feche e tente abrir o configurador novamente.");
    }
  }

  function bind() {
    const active = steps[step - 1];

    const campoModelo = active.querySelector('[data-field="current"]');
    if (campoModelo) {
      campoModelo.addEventListener("change", () => {
        d.current = campoModelo.value;
        d.storage = "";
        render();
      });
    }

    const campoBateria = active.querySelector('[data-field="battery"]');
    if (campoBateria) {
      campoBateria.addEventListener("input", () => {
        d.battery = campoBateria.value;
        const out = active.querySelector("[data-battery-out]");
        if (out) out.textContent = `${d.battery}%`;
      });
    }

    active.querySelectorAll('[data-field]').forEach((el) => {
      if (el === campoModelo || el === campoBateria) return;
      el.addEventListener("input", () => { d[el.dataset.field] = el.value; });
    });

    active.querySelectorAll("[data-choice]").forEach((el) =>
      el.addEventListener("click", () => {
        const v = el.dataset.choice, group = el.dataset.group;
        if (group === "storage") d.storage = v;
        else if (group === "condition") d.condition = v;
        else if (group === "replaced") {
          d.replaced = v;
          if (v === "no") { d.parts = []; d.partsOther = ""; }
        } else if (group === "parts") {
          d.parts = d.parts.includes(v) ? d.parts.filter((p) => p !== v) : [...d.parts, v];
          if (!d.parts.includes("other")) d.partsOther = "";
        }
        render();
      })
    );

    const input = active.querySelector("[data-photos]");
    if (input) {
      input.addEventListener("change", () => addPhotos(input.files));
      const drop = active.querySelector("[data-drop]");
      ["dragover", "dragenter"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-dragging"); }));
      ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-dragging"); }));
      drop.addEventListener("drop", (e) => addPhotos(e.dataTransfer.files));
    }
    active.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => { URL.revokeObjectURL(d.photos.splice(+b.dataset.remove, 1)[0].url); render(); })
    );
  }

  function addPhotos(files) {
    const all = [...files].filter((f) => f.type.startsWith("image/"));
    const valid = all.filter((f) => f.size <= 5 * 1024 * 1024).slice(0, 5 - d.photos.length);
    valid.forEach((file) => d.photos.push({ file, url: URL.createObjectURL(file) }));
    if (valid.length < all.length) {
      error(all.some((f) => f.size > 5 * 1024 * 1024) ? "Cada imagem precisa ter no máximo 5 MB." : "Você pode adicionar até 5 imagens.");
    }
    render();
  }

  function error(msg) {
    const e = $("[data-upgrade-error]");
    e.textContent = msg;
    e.hidden = false;
  }

  function validate() {
    if (step === 1 && !d.current) return "Escolha o modelo do iPhone que você possui.";
    if (step === 1 && !d.storage) return "Escolha o armazenamento do aparelho.";
    if (step === 2 && !d.condition) return "Selecione o estado do aparelho.";
    if (step === 2 && !d.replaced) return "Informe se alguma peça foi substituída.";
    if (step === 2 && d.replaced === "yes" && !d.parts.length) return "Selecione as peças substituídas.";
    if (step === 2 && d.replaced === "yes" && d.parts.includes("other") && !d.partsOther.trim()) return "Descreva qual peça foi substituída.";
    return "";
  }

  function condLabel() {
    const found = conditions.find(([k]) => k === d.condition);
    return found ? found[1] : "—";
  }

  function resumoPecas() {
    if (d.replaced !== "yes") return "Nenhuma substituída";
    if (!d.parts.length) return "—";
    const nomes = d.parts.map((p) => parts.find(([k]) => k === p)[1]);
    if (d.parts.includes("other") && d.partsOther.trim()) {
      const idx = nomes.indexOf("Outro");
      if (idx > -1) nomes[idx] = `Outro (${d.partsOther.trim()})`;
    }
    return nomes.join(", ");
  }

  /* Monta a mensagem do WhatsApp. Nunca inclui preço, estimativa ou
     qualquer valor — só os dados que a equipe precisa para avaliar
     o aparelho manualmente. */
  function montarMensagem() {
    const old = device(d.current);
    const linhas = [
      "Olá! Gostaria de fazer uma avaliação para meu Upgrade.",
      `📱 Aparelho: ${old.name}`,
      `💾 Armazenamento: ${storeText(d.storage)}`,
      `🔋 Saúde da bateria: ${d.battery}%`,
      `✨ Estado de conservação: ${condLabel()}`,
      `🔧 Peças substituídas: ${resumoPecas()}`
    ];
    if (d.observacoes.trim()) linhas.push("📝 Observações:", d.observacoes.trim());
    linhas.push("");
    linhas.push(
      d.photos.length
        ? `Estou enviando ${d.photos.length === 1 ? "a foto" : `as ${d.photos.length} fotos`} do aparelho para avaliação.`
        : "Vou enviar fotos do aparelho aqui na conversa para avaliação."
    );
    linhas.push("Gostaria de saber quanto ficaria meu Upgrade.");
    return linhas.join("\n");
  }

  function send() {
    track("upgrade_whatsapp_clicked");
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(montarMensagem())}`, "_blank", "noopener,noreferrer");
  }

  /* Abre o WhatsApp com os dados (sem nenhum valor) e mostra uma tela
     de confirmação honesta: nunca diz que as fotos foram enviadas se
     elas não tiverem sido de fato — isso só acontece dentro da própria
     conversa do WhatsApp, feito pela pessoa. */
  function finish() {
    send();
    const old = device(d.current);
    $("[data-upgrade-result]").innerHTML = `<p class="upgrade__eyebrow">QUASE PRONTO</p><h3>Sua avaliação foi enviada.</h3><p class="upgrade__result-copy">Abrimos o WhatsApp com os dados do seu ${old.name}. ${
      d.photos.length ? "Anexe as fotos selecionadas diretamente na conversa para concluir." : "Se quiser, anexe fotos do aparelho diretamente na conversa."
    }</p><div class="upgrade__summary"><div><span>Seu aparelho</span><strong>${old.name} · ${storeText(
      d.storage
    )}</strong></div><div><span>Bateria</span><strong>${d.battery}%</strong></div><div><span>Estado</span><strong>${condLabel()}</strong></div><div><span>Peças substituídas</span><strong>${resumoPecas()}</strong></div></div><p class="upgrade__disclaimer">O valor do seu upgrade é definido pela nossa equipe depois da avaliação física e funcional do aparelho.</p><div class="upgrade__result-actions"><button class="upgrade__button" type="button" data-reopen>Abrir WhatsApp novamente <span aria-hidden="true">→</span></button><button class="upgrade__back" type="button" data-reset>Fazer nova avaliação</button></div>`;
    $("[data-upgrade-wizard]").hidden = true;
    $("[data-upgrade-result]").hidden = false;
    $("[data-reopen]").addEventListener("click", send);
    $("[data-reset]").addEventListener("click", reset);
    track("upgrade_completed");
  }

  function reset() {
    d.photos.forEach((p) => URL.revokeObjectURL(p.url));
    Object.assign(d, {
      current: "", storage: "", battery: "90", condition: "", replaced: "",
      parts: [], partsOther: "", observacoes: "", photos: []
    });
    step = 1;
    $("[data-upgrade-result]").hidden = true;
    $("[data-upgrade-welcome]").hidden = false;
    $("[data-upgrade-wizard]").hidden = true;
  }

  app.querySelector("[data-upgrade-start]").addEventListener("click", () => {
    $("[data-upgrade-welcome]").hidden = true;
    $("[data-upgrade-wizard]").hidden = false;
    step = 1;
    try {
      render();
      track("upgrade_started");
    } catch (exception) {
      console.error("Falha ao carregar o configurador de upgrade:", exception);
      error(`Não foi possível carregar o configurador: ${exception.message || "erro inesperado"}. Atualize a página e tente novamente.`);
    }
  });
  app.querySelector("[data-upgrade-close]").addEventListener("click", () => {
    $("[data-upgrade-wizard]").hidden = true;
    $("[data-upgrade-welcome]").hidden = false;
  });
  app.querySelector("[data-upgrade-back]").addEventListener("click", () => { if (step > 1) { step--; render(); } });
  app.querySelector("[data-upgrade-next]").addEventListener("click", () => {
    const msg = validate();
    if (msg) return error(msg);
    track("upgrade_step_completed", { step });
    if (step < TOTAL_STEPS) { step++; render(); }
    else finish();
  });
}());
