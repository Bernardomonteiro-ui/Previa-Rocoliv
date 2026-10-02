/*
 * Configuração central do configurador de Upgrade.
 *
 * IMPORTANTE: o site NUNCA calcula, estima ou exibe valor de upgrade.
 * Esta lista serve só para preencher os menus de modelo/armazenamento
 * do formulário. A avaliação e o preço são sempre definidos manualmente
 * pela equipe da Rocoliv, por WhatsApp, depois de ver os dados e as
 * fotos do aparelho.
 *
 * Para adicionar/remover um modelo ou uma capacidade aceita na troca,
 * edite só a lista "devices" abaixo.
 */
const UPGRADE_CONFIG = {
  whatsapp: "5511959045980",
  devices: [
    { id: "iphone-11", name: "iPhone 11", storages: ["64", "128", "256"] },
    { id: "iphone-11-pro", name: "iPhone 11 Pro", storages: ["64", "256", "512"] },
    { id: "iphone-11-pro-max", name: "iPhone 11 Pro Max", storages: ["64", "256", "512"] },
    { id: "iphone-12", name: "iPhone 12", storages: ["64", "128", "256"] },
    { id: "iphone-12-pro", name: "iPhone 12 Pro", storages: ["128", "256", "512"] },
    { id: "iphone-12-pro-max", name: "iPhone 12 Pro Max", storages: ["128", "256", "512"] },
    { id: "iphone-13", name: "iPhone 13", storages: ["128", "256", "512"] },
    { id: "iphone-13-pro", name: "iPhone 13 Pro", storages: ["128", "256", "512", "1024"] },
    { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", storages: ["128", "256", "512", "1024"] },
    { id: "iphone-14", name: "iPhone 14", storages: ["128", "256", "512"] },
    { id: "iphone-14-pro", name: "iPhone 14 Pro", storages: ["128", "256", "512", "1024"] },
    { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", storages: ["128", "256", "512", "1024"] },
    { id: "iphone-15", name: "iPhone 15", storages: ["128", "256", "512"] },
    { id: "iphone-15-pro", name: "iPhone 15 Pro", storages: ["128", "256", "512", "1024"] },
    { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", storages: ["256", "512", "1024"] },
    { id: "iphone-16", name: "iPhone 16", storages: ["128", "256", "512"] },
    { id: "iphone-16-pro", name: "iPhone 16 Pro", storages: ["128", "256", "512", "1024"] },
    { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", storages: ["256", "512", "1024"] },
    { id: "iphone-17", name: "iPhone 17", storages: ["256", "512"] },
    { id: "iphone-17-pro", name: "iPhone 17 Pro", storages: ["256", "512", "1024"] },
    { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", storages: ["256", "512", "1024"] },
    // Capacidades do iPhone 18 padrão provisórias: confirmar com o estoque Rocoliv.
    { id: "iphone-18", name: "iPhone 18", storages: ["256", "512"] },
    { id: "iphone-18-pro", name: "iPhone 18 Pro", storages: ["256", "512", "1024", "2048"] },
    { id: "iphone-18-pro-max", name: "iPhone 18 Pro Max", storages: ["256", "512", "1024", "2048"] }
  ]
};
