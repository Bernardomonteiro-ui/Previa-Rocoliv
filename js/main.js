/* =========================================================
   ROCOLIV IMPORTS — js/main.js
   Este arquivo NÃO precisa ser editado para trocar preços ou
   produtos — isso é feito em js/produtos.js.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURAÇÃO GERAL DA LOJA
     Troque o número do WhatsApp aqui (só dígitos, com DDI+DDD).
  --------------------------------------------------------- */
  const CONFIG = {
    nomeLoja: "Rocoliv Imports",
    whatsapp: "5511959045980"
  };

  const formatarPreco = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const linkWhatsapp = (mensagem) =>
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

  const prefereMovimentoReduzido =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. ANO ATUAL NO RODAPÉ
     ========================================================= */
  const elAno = document.getElementById("ano-atual");
  if (elAno) elAno.textContent = new Date().getFullYear();

  /* =========================================================
     2. LINKS DE WHATSAPP — todos usam CONFIG.whatsapp acima.
     - [data-whatsapp]: mensagem padrão, ou a que estiver em
       data-whatsapp-msg (ex: botão "Avaliar meu usado").
     - [data-whatsapp-numero]: só abre a conversa, sem mensagem
       pronta (ex: número exibido na seção de contato).
     ========================================================= */
  const MENSAGEM_PADRAO = `Olá! Gostaria de falar com a ${CONFIG.nomeLoja}.`;

  document.addEventListener("click", (evento) => {
    const whatsapp = evento.target.closest("[data-whatsapp], .produto-card__botao");
    if (!whatsapp) return;
    window.dispatchEvent(new CustomEvent("rocoliv:analytics", {
      detail: { event: whatsapp.closest(".produto-card") ? "product_viewed" : "whatsapp_clicked" }
    }));
  });

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const mensagem = el.getAttribute("data-whatsapp-msg") || MENSAGEM_PADRAO;
    el.href = linkWhatsapp(mensagem);
  });

  document.querySelectorAll("[data-whatsapp-numero]").forEach((el) => {
    el.href = `https://wa.me/${CONFIG.whatsapp}`;
  });

  /* =========================================================
     3. CABEÇALHO: encolhe e ganha fundo desfocado ao rolar
     ========================================================= */
  const cabecalho = document.getElementById("cabecalho");
  const aplicarEstadoCabecalho = () => {
    if (!cabecalho) return;
    cabecalho.classList.toggle("is-encolhido", window.scrollY > 40);
  };
  aplicarEstadoCabecalho();
  window.addEventListener("scroll", aplicarEstadoCabecalho, { passive: true });

  /* =========================================================
     4. MENU MOBILE (hambúrguer)
     ========================================================= */
  const hamburguer = document.getElementById("hamburguer");
  const menu = document.getElementById("menu");

  const fecharMenu = () => {
    if (!menu || !hamburguer) return;
    menu.classList.remove("is-aberto");
    hamburguer.setAttribute("aria-expanded", "false");
    hamburguer.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  };

  const alternarMenu = () => {
    if (!menu || !hamburguer) return;
    const vaiAbrir = !menu.classList.contains("is-aberto");
    menu.classList.toggle("is-aberto", vaiAbrir);
    hamburguer.setAttribute("aria-expanded", String(vaiAbrir));
    hamburguer.setAttribute("aria-label", vaiAbrir ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = vaiAbrir ? "hidden" : "";
  };

  if (hamburguer && menu) {
    hamburguer.addEventListener("click", alternarMenu);
    menu.querySelectorAll(".menu__link, .menu__cta").forEach((link) => {
      link.addEventListener("click", fecharMenu);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) fecharMenu();
    });
  }

  /* =========================================================
     5. CATÁLOGO: renderiza produtos vindos de js/produtos.js
     ========================================================= */
  const grade = document.getElementById("grade-produtos");
  const listaProdutos = typeof PRODUTOS !== "undefined" ? PRODUTOS : [];

  const iconeWhatsapp = `
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 2.7C8.7 2.7 2.8 8.6 2.8 15.9c0 2.6.7 5.1 2.1 7.3L2.7 29.3l6.3-2.1c2.1 1.2 4.5 1.8 6.9 1.8 7.3 0 13.2-5.9 13.2-13.2S23.3 2.7 16 2.7Zm0 24.1c-2.2 0-4.3-.6-6.1-1.7l-.4-.3-3.7 1.2 1.2-3.6-.3-.4a10.9 10.9 0 0 1-1.7-5.9c0-6 4.9-10.9 10.9-10.9s10.9 4.9 10.9 10.9S22 26.8 16 26.8Zm5.9-8.2c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.8-1-2.4-.3-.6-.5-.5-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.6 1.2 3.2 1.4 3.4.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5 0-.1-.3-.2-.6-.3Z"/>
    </svg>`;

  function criarCartaoProduto(produto) {
    const artigo = document.createElement("article");
    artigo.className = "produto-card";
    artigo.setAttribute("data-categoria", produto.categoria);

    const seloClasse = "produto-card__selo--novo";
    const seloTexto = "Consulte";
    const mensagem = `Olá! Tenho interesse no ${produto.nome} ${produto.capacidade} que vi no site.`;
    const precoHtml = Number.isFinite(produto.preco)
      ? `<span class="produto-card__preco-parcela">12x de ${formatarPreco(produto.preco / 12)}</span><span class="produto-card__preco-vista">${formatarPreco(produto.preco)} à vista no Pix</span>`
      : `<span class="produto-card__preco-vista">Consulte disponibilidade e valor</span>`;

    artigo.innerHTML = `
      <div class="produto-card__imagem-wrap">
        <span class="produto-card__selo ${seloClasse}">${seloTexto}</span>
        <img class="produto-card__imagem" src="${produto.imagem}" alt="${produto.nome} ${produto.capacidade} ${produto.cor}" loading="lazy" width="800" height="800">
      </div>
      <div class="produto-card__corpo">
        <h3 class="produto-card__nome">${produto.nome}</h3>
        <p class="produto-card__specs">${produto.capacidade} · ${produto.cor}</p>
        <p class="produto-card__preco">${precoHtml}</p>
        <a class="produto-card__botao" target="_blank" rel="noopener" href="${linkWhatsapp(mensagem)}">
          ${iconeWhatsapp} Comprar pelo WhatsApp
        </a>
      </div>
    `;
    return artigo;
  }

  function renderizarProdutos(categoria) {
    if (!grade) return;
    grade.innerHTML = "";
    const filtrados = categoria === "todos"
      ? listaProdutos
      : listaProdutos.filter((p) => p.categoria === categoria);

    filtrados.forEach((produto) => grade.appendChild(criarCartaoProduto(produto)));

    if (window.gsap && !prefereMovimentoReduzido) {
      gsap.fromTo(
        grade.children,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }
      );
    }
  }

  renderizarProdutos("todos");

  const botoesCategoria = document.querySelectorAll(".categoria-btn");

  function filtrarCatalogoPor(categoria) {
    botoesCategoria.forEach((b) => b.classList.toggle("is-ativo", b.getAttribute("data-categoria") === categoria));
    renderizarProdutos(categoria);
  }

  botoesCategoria.forEach((botao) => {
    botao.addEventListener("click", () => filtrarCatalogoPor(botao.getAttribute("data-categoria")));
  });

  /* =========================================================
     5.1 FAIXA DE MODELOS — miniaturas horizontais puxadas dos
     mesmos dados de js/produtos.js. Clicar num modelo filtra o
     catálogo abaixo pela categoria dele e rola até lá.
     ========================================================= */
  const pistaModelos = document.getElementById("faixa-modelos-pista");
  if (pistaModelos && listaProdutos.length) {
    listaProdutos.forEach((produto) => {
      const seloClasse = "faixa-modelos__selo--novo";
      const seloTexto = "Consulte";

      const item = document.createElement("li");
      item.innerHTML = `
        <button class="faixa-modelos__item" type="button" data-categoria="${produto.categoria}">
          <span class="faixa-modelos__imagem-wrap">
            <span class="faixa-modelos__selo ${seloClasse}">${seloTexto}</span>
            <img class="faixa-modelos__imagem" src="${produto.imagem}" alt="" loading="lazy" width="800" height="800">
          </span>
          <span class="faixa-modelos__nome">${produto.nome}</span>
        </button>
      `;
      pistaModelos.appendChild(item);
    });

    pistaModelos.querySelectorAll("[data-categoria]").forEach((botao) => {
      botao.addEventListener("click", () => {
        filtrarCatalogoPor(botao.getAttribute("data-categoria"));
        document.getElementById("produtos").scrollIntoView({ behavior: prefereMovimentoReduzido ? "auto" : "smooth", block: "start" });
      });
    });

    const setaEsq = document.querySelector(".faixa-modelos__seta--esq");
    const setaDir = document.querySelector(".faixa-modelos__seta--dir");
    if (setaEsq) setaEsq.addEventListener("click", () => pistaModelos.scrollBy({ left: -320, behavior: "smooth" }));
    if (setaDir) setaDir.addEventListener("click", () => pistaModelos.scrollBy({ left: 320, behavior: "smooth" }));
  }

  /* =========================================================
     6. FAQ — fecha as outras perguntas ao abrir uma nova
     ========================================================= */
  const itensFaq = document.querySelectorAll("[data-faq-item]");
  itensFaq.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        itensFaq.forEach((outro) => {
          if (outro !== item) outro.open = false;
        });
      }
    });
  });

  /* Links que apontam para uma pergunta do FAQ (ex: "Garantia" no
     menu) abrem essa pergunta automaticamente e rolam até ela —
     funciona tanto no clique quanto ao abrir o site direto com
     #garantia no fim do endereço.

     A rolagem é feita à mão (scrollIntoView), em vez de deixar o
     navegador rolar sozinho: como abrir a pergunta muda a altura
     do acordeão, a rolagem automática do navegador não conseguia
     acompanhar e a pergunta ficava escondida atrás do cabeçalho
     fixo. Rolando depois de abrir, com o tamanho já certo, a
     posição final fica sempre correta. */
  function abrirFaqEScrollar(hash) {
    if (!hash) return;
    const alvo = document.querySelector(hash);
    if (!alvo) return;

    if (alvo.tagName === "DETAILS" && !alvo.open) alvo.open = true;

    /* Um pequeno atraso (em vez de rolar na mesma tarefa) garante que
       o navegador já recalculou o layout depois de abrir a pergunta
       (e fechar as outras) antes de medirmos a posição — senão a
       rolagem mede o tamanho antigo e erra o alvo. */
    setTimeout(() => {
      alvo.scrollIntoView({
        behavior: prefereMovimentoReduzido ? "auto" : "smooth",
        block: "start"
      });
    }, 50);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const hash = link.getAttribute("href");
      const alvo = document.querySelector(hash);
      if (alvo && alvo.tagName === "DETAILS") {
        evento.preventDefault();
        abrirFaqEScrollar(hash);
        if (window.history && window.history.pushState) window.history.pushState(null, "", hash);
      }
    });
  });

  if (window.location.hash) {
    if (document.readyState === "complete") {
      abrirFaqEScrollar(window.location.hash);
    } else {
      window.addEventListener("load", () => abrirFaqEScrollar(window.location.hash));
    }
  }

  /* =========================================================
     6.1 CARROSSEL "COMECE PELOS DESTAQUES"
     Funciona sem depender do GSAP. Usa rolagem nativa (scroll-snap)
     para o arraste no celular — mais leve e confiável que arraste
     customizado por JavaScript.
     ========================================================= */
  (function iniciarCarrossel() {
    const viewport = document.getElementById("carrossel-viewport");
    const pista = document.getElementById("carrossel-pista");
    const indicadoresWrap = document.getElementById("carrossel-indicadores");
    const botaoPausa = document.getElementById("carrossel-pausa");
    if (!viewport || !pista) return;

    const slides = Array.from(pista.children);
    if (!slides.length) return;

    if (prefereMovimentoReduzido) {
      viewport.classList.add("esta-estatico");
      if (botaoPausa) botaoPausa.hidden = true;
      if (indicadoresWrap) indicadoresWrap.hidden = true;
      return;
    }

    let indiceAtual = 0;
    let pausado = false;
    let temporizador = null;

    slides.forEach((_, i) => {
      const ponto = document.createElement("button");
      ponto.type = "button";
      ponto.className = "carrossel__ponto";
      ponto.setAttribute("aria-label", `Ir para o destaque ${i + 1} de ${slides.length}`);
      ponto.addEventListener("click", () => {
        irPara(i);
        reiniciarAutoplay();
      });
      indicadoresWrap.appendChild(ponto);
    });
    const pontos = Array.from(indicadoresWrap.children);

    function atualizarIndicadores() {
      pontos.forEach((p, i) => p.classList.toggle("is-ativo", i === indiceAtual));
    }

    function irPara(indice) {
      indiceAtual = (indice + slides.length) % slides.length;
      viewport.scrollTo({ left: slides[indiceAtual].offsetLeft - viewport.offsetLeft, behavior: "smooth" });
      atualizarIndicadores();
    }

    function pararAutoplay() {
      if (temporizador) clearInterval(temporizador);
    }

    function iniciarAutoplay() {
      pararAutoplay();
      temporizador = setInterval(() => {
        if (!pausado) irPara(indiceAtual + 1);
      }, 5000);
    }

    function reiniciarAutoplay() { iniciarAutoplay(); }

    let scrollTimeout;
    viewport.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          let maisProximo = 0;
          let menorDistancia = Infinity;
          slides.forEach((slide, i) => {
            const distancia = Math.abs(slide.offsetLeft - viewport.offsetLeft - viewport.scrollLeft);
            if (distancia < menorDistancia) {
              menorDistancia = distancia;
              maisProximo = i;
            }
          });
          indiceAtual = maisProximo;
          atualizarIndicadores();
        }, 120);
      },
      { passive: true }
    );

    if (botaoPausa) {
      botaoPausa.addEventListener("click", () => {
        pausado = !pausado;
        botaoPausa.classList.toggle("is-pausado", pausado);
        botaoPausa.setAttribute("aria-pressed", String(pausado));
        botaoPausa.setAttribute(
          "aria-label",
          pausado ? "Retomar apresentação automática" : "Pausar apresentação automática"
        );
      });
    }

    viewport.addEventListener("pointerdown", pararAutoplay, { passive: true });
    viewport.addEventListener("pointerup", () => { if (!pausado) iniciarAutoplay(); }, { passive: true });

    atualizarIndicadores();
    iniciarAutoplay();
  })();

  /* =========================================================
     6.2 EXPLORE OS DETALHES — pílulas que expandem um texto e
     trocam a imagem ao lado. Sem JS, todos os textos já aparecem
     visíveis (definido no HTML/CSS), então nada fica escondido.
     ========================================================= */
  (function iniciarExplorar() {
    const itens = document.querySelectorAll("[data-explorar-item]");
    const imagem = document.getElementById("explorar-imagem");
    if (!itens.length || !imagem) return;

    itens.forEach((item, i) => {
      const texto = item.querySelector(".explorar__texto");
      texto.style.maxHeight = i === 0 ? `${texto.scrollHeight}px` : "0px";
    });

    function trocarImagem(novaImagem) {
      if (!novaImagem || imagem.getAttribute("src") === novaImagem) return;

      if (window.gsap && !prefereMovimentoReduzido) {
        gsap.to(imagem, {
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
          onComplete: () => {
            imagem.src = novaImagem;
            gsap.fromTo(
              imagem,
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
          }
        });
      } else {
        /* Sem GSAP ou com "reduzir movimento" ligado: troca direto,
           sem animação (a transição de opacidade do CSS já respeita
           prefers-reduced-motion automaticamente). */
        imagem.classList.add("esta-trocando");
        setTimeout(() => {
          imagem.src = novaImagem;
          imagem.classList.remove("esta-trocando");
        }, prefereMovimentoReduzido ? 0 : 220);
      }
    }

    itens.forEach((item) => {
      const botao = item.querySelector("[data-explorar-botao]");
      const texto = item.querySelector(".explorar__texto");

      botao.addEventListener("click", () => {
        const jaAtivo = item.classList.contains("is-ativo");

        itens.forEach((outro) => {
          outro.classList.remove("is-ativo");
          outro.querySelector(".explorar__texto").style.maxHeight = "0px";
        });

        if (jaAtivo) return;

        item.classList.add("is-ativo");
        texto.style.maxHeight = `${texto.scrollHeight}px`;

        trocarImagem(item.getAttribute("data-imagem"));
      });
    });
  })();

  /* =========================================================
     7. CONTADOR DOS NÚMEROS DE DESTAQUE
     Implementado sem depender do GSAP, para funcionar mesmo
     se o CDN do GSAP falhar ao carregar.
     ========================================================= */
  const contadores = document.querySelectorAll("[data-contador]");

  function animarContador(elemento) {
    const alvo = parseInt(elemento.getAttribute("data-alvo"), 10) || 0;
    const prefixo = elemento.getAttribute("data-prefixo") || "";
    const sufixo = elemento.getAttribute("data-sufixo") || "";

    if (prefereMovimentoReduzido) {
      elemento.textContent = `${prefixo}${alvo}${sufixo}`;
      return;
    }

    const duracao = 1500;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const facilitado = 1 - Math.pow(1 - progresso, 3);
      const valorAtual = Math.round(alvo * facilitado);
      elemento.textContent = `${prefixo}${valorAtual}${sufixo}`;
      if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  if ("IntersectionObserver" in window && contadores.length) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    contadores.forEach((el) => observador.observe(el));
  } else {
    contadores.forEach((el) => {
      const alvo = el.getAttribute("data-alvo");
      el.textContent = `${el.getAttribute("data-prefixo") || ""}${alvo}${el.getAttribute("data-sufixo") || ""}`;
    });
  }

  /* =========================================================
     8. ANIMAÇÕES GSAP (camada extra — nunca essencial)
     Tudo aqui é opcional: se o GSAP não carregar (CDN fora do
     ar) ou o usuário pedir "reduzir movimento", o site continua
     100% funcional e visível, só sem os efeitos.
     ========================================================= */
  const gsapDisponivel = typeof window.gsap !== "undefined";

  if (gsapDisponivel && !prefereMovimentoReduzido) {
    try {
      gsap.registerPlugin(ScrollTrigger);

      /* ---- 8.1 Entrada do herói: título palavra por palavra ---- */
      const tituloHero = document.querySelector("[data-anim-titulo]");
      if (tituloHero) {
        const textoOriginal = tituloHero.textContent.trim();
        const palavras = textoOriginal.split(/\s+/);
        tituloHero.innerHTML = palavras
          .map((palavra) => `<span class="palavra"><span>${palavra}</span></span>`)
          .join(" ");

        const spansInternos = tituloHero.querySelectorAll(".palavra > span");
        gsap.set(spansInternos, { yPercent: 130, opacity: 0 });

        const subtitulo = document.querySelector("[data-anim-subtitulo]");
        const botaoHero = document.querySelector("[data-anim-botao]");
        if (subtitulo) gsap.set(subtitulo, { opacity: 0, y: 24 });
        if (botaoHero) gsap.set(botaoHero, { opacity: 0, y: 24 });

        const tlHero = gsap.timeline({ delay: 0.15 });
        tlHero
          .to(spansInternos, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: "power3.out"
          })
          .to(subtitulo, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
          .to(botaoHero, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
      }

      /* ---- 8.3 Revelação genérica ao rolar (fade + leve subida) ---- */
      function revelarAoRolar(selector, opcoes = {}) {
        document.querySelectorAll(selector).forEach((elemento) => {
          gsap.fromTo(
            elemento,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: elemento,
                start: "top 85%",
                toggleActions: "play none none reverse"
              },
              ...opcoes
            }
          );
        });
      }

      revelarAoRolar(".titulo-secao");
      revelarAoRolar(".contato__texto");
      revelarAoRolar(".contato__lista");
      revelarAoRolar(".explorar__imagem", { y: 25, duration: 0.6, ease: "power2.out" });

      /* ---- 8.4 Cascata em grupos de itens ---- */
      function revelarEmCascata(containerSelector, itemSelector, stagger = 0.08) {
        document.querySelectorAll(containerSelector).forEach((container) => {
          const itens = container.querySelectorAll(itemSelector);
          if (!itens.length) return;
          gsap.fromTo(
            itens,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger,
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      revelarAoRolar(".carrossel__viewport");
      revelarEmCascata(".faixa-modelos__pista", ".faixa-modelos__item");
      revelarEmCascata(".categorias", ".categoria-btn");
      revelarEmCascata(".explorar__lista", ".explorar__item");
      revelarEmCascata(".passos", ".passo-card");
      revelarEmCascata(".depoimentos__grade", ".depoimento-card");
      revelarEmCascata(".numeros__lista", ".numeros__item");
      revelarEmCascata(".faq", ".faq-item");

      /* Cartões de produto: observa a grade porque ela é recriada
         ao trocar de categoria. */
      const observadorGrade = new MutationObserver(() => {
        gsap.fromTo(
          "#grade-produtos .produto-card",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power2.out" }
        );
      });
      if (grade) observadorGrade.observe(grade, { childList: true });

      /* ---- 8.5 Seção "Por que comprar" (AirPods): a foto entra com
         fade + leve subida, e os 3 textos ao lado entram em cascata
         logo em seguida (mesmo padrão usado no resto do site). ---- */
      revelarAoRolar(".destaque__midia");
      revelarEmCascata(".destaque__textos", ".destaque__item");

      ScrollTrigger.refresh();
    } catch (erro) {
      /* Se qualquer coisa falhar no GSAP, o site continua normal —
         apenas sem as animações extras. */
      console.warn("Animações GSAP desativadas:", erro);
    }
  }
})();
