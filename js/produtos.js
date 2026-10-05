/*
  ANTES DE ENVIAR PARA O CLIENTE — CONFIRMAR ISTO:
  ---------------------------------------------------------
  Todo produto abaixo é um EXEMPLO. Antes de usar a página de
  verdade, confirme com o cliente:
  - Quais modelos ele realmente tem em estoque agora
  - O preço de cada um (todos aqui são fictícios)
  - A condição real (novo ou seminovo) de cada aparelho
  - As fotos reais dos produtos: os 8 já usam foto real, em
    img/produtos/.

  LISTA DE PRODUTOS DA LOJA
  ---------------------------------------------------------
  Para adicionar, remover ou editar um produto, mexa só neste
  arquivo. Cada produto é um bloco { } dentro dos colchetes [].
  O preço parcelado (12x) e o card do "Catálogo rápido" acima do
  catálogo são calculados automaticamente a partir do "preco" —
  não precisa editar em mais nenhum lugar.

  Campos:
  - id:        número único (não repita)
  - nome:      nome do produto (ex: "iPhone 15 Pro Max")
  - capacidade: ex: "256GB"
  - cor:       ex: "Titânio Natural"
  - condicao:  "novo" ou "seminovo"
  - categoria: "iphone", "ipad", "airpods", "watch" ou "macbook"
  - preco:     só números, sem "R$" e sem pontos (ex: 7999)
  - imagem:    caminho do arquivo de imagem dentro da pasta img/
*/

const PRODUTOS = [
  {
    id: 1,
    nome: "iPhone 15 Pro Max",
    capacidade: "256GB",
    cor: "Titânio Natural",
    condicao: "novo",
    categoria: "iphone",
    preco: null,
    imagem: "img/produtos/iPhone-15-Pro-Max.webp"
  },
  {
    id: 2,
    nome: "iPhone 15 Pro",
    capacidade: "128GB",
    cor: "Titânio Azul",
    condicao: "novo",
    categoria: "iphone",
    preco: null,
    imagem: "img/produtos/iPhone-15-Pro.webp"
  },
  {
    id: 3,
    nome: "iPhone 18 Pro Max",
    capacidade: "256GB",
    cor: "Azul",
    condicao: "novo",
    categoria: "iphone",
    preco: null,
    imagem: "img/produtos/iPhone-18-Pro-Max-Azul.webp"
  },
  {
    id: 4,
    nome: "iPhone 18 Pro Max",
    capacidade: "256GB",
    cor: "Preto",
    condicao: "novo",
    categoria: "iphone",
    preco: null,
    imagem: "img/produtos/iPhone-18-Pro-Max-Preto.webp"
  },
  {
    id: 5,
    nome: "iPad Air",
    capacidade: "64GB",
    cor: "Cinza Espacial",
    condicao: "novo",
    categoria: "ipad",
    preco: null,
    imagem: "img/produtos/iPad-Air.webp"
  },
  {
    id: 6,
    nome: "Apple Watch Series 9",
    capacidade: "45mm GPS",
    cor: "Meia-noite",
    condicao: "novo",
    categoria: "watch",
    preco: null,
    imagem: "img/produtos/Apple-Watch-Series-9.webp"
  },
  {
    id: 7,
    nome: "AirPods Pro (2ª geração)",
    capacidade: "USB-C",
    cor: "Branco",
    condicao: "novo",
    categoria: "airpods",
    preco: null,
    imagem: "img/produtos/AirPods-Pro-2-Geracao.webp"
  },
  {
    id: 8,
    nome: "MacBook Air M2",
    capacidade: "256GB",
    cor: "Meia-noite",
    condicao: "seminovo",
    categoria: "macbook",
    preco: null,
    imagem: "img/produtos/MacBook-Air-M2.webp"
  }
];
