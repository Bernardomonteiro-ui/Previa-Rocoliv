/*
 * Configuração central do configurador.
 * Os valores ficam como null até a Rocoliv confirmar a tabela comercial.
 * Quando configurados, baseValue e price são valores em reais; storageValues
 * são ajustes sobre a base e os demais ajustes são reduções no valor de troca.
 */
const UPGRADE_CONFIG = {
  whatsapp: "5511959045980",
  devices: [
    { id: "iphone-11", name: "iPhone 11", storages: ["64", "128", "256"], baseValue: null, storageValues: {} },
    { id: "iphone-11-pro", name: "iPhone 11 Pro", storages: ["64", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-11-pro-max", name: "iPhone 11 Pro Max", storages: ["64", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-12", name: "iPhone 12", storages: ["64", "128", "256"], baseValue: null, storageValues: {} },
    { id: "iphone-12-pro", name: "iPhone 12 Pro", storages: ["128", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-12-pro-max", name: "iPhone 12 Pro Max", storages: ["128", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-13", name: "iPhone 13", storages: ["128", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-13-pro", name: "iPhone 13 Pro", storages: ["128", "256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", storages: ["128", "256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-14", name: "iPhone 14", storages: ["128", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-14-pro", name: "iPhone 14 Pro", storages: ["128", "256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", storages: ["128", "256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-15", name: "iPhone 15", storages: ["128", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-15-pro", name: "iPhone 15 Pro", storages: ["128", "256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", storages: ["256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-16", name: "iPhone 16", storages: ["128", "256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-16-pro", name: "iPhone 16 Pro", storages: ["128", "256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", storages: ["256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-17", name: "iPhone 17", storages: ["256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-17-pro", name: "iPhone 17 Pro", storages: ["256", "512", "1024"], baseValue: null, storageValues: {} },
    { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", storages: ["256", "512", "1024"], baseValue: null, storageValues: {} },
    // Capacidades 256/512 do modelo padrão estão provisórias: confirmar com o estoque Rocoliv.
    { id: "iphone-18", name: "iPhone 18", storages: ["256", "512"], baseValue: null, storageValues: {} },
    { id: "iphone-18-pro", name: "iPhone 18 Pro", storages: ["256", "512", "1024", "2048"], baseValue: null, storageValues: {} },
    { id: "iphone-18-pro-max", name: "iPhone 18 Pro Max", storages: ["256", "512", "1024", "2048"], baseValue: null, storageValues: {} }
  ],
  batteryAdjustments: { "95-100": null, "90-94": null, "85-89": null, "80-84": null, below80: null },
  conditionAdjustments: { excellent: null, veryGood: null, good: null, damaged: null },
  replacedPartAdjustments: { screen: null, battery: null, camera: null, housing: null, faceId: null, other: null },
  destinationPrices: {}
};
