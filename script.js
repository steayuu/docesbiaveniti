const WHATS = "5511984100723";

const produtosPadrao = [
  // Brigadeiros
  { id: 1, nome: "Brigadeiro Tradicional", categoria: "Brigadeiros", tags: ["chocolate", "clássico"], img: "https://i.imgur.com/SSmGEAs.jpeg",
    desc: "Brigadeiro cremoso, feito com chocolate e finalização caprichada. Ideal para festas e lembrancinhas." },

  { id: 2, nome: "Brigadeiro Gourmet", categoria: "Brigadeiros", tags: ["gourmet", "premium"], img: "https://i.imgur.com/CkeGnsq.jpeg",
    desc: "Versão especial com ingredientes selecionados e acabamento sofisticado." },

  // Pudins
  { id: 3, nome: "Pudim Cremoso", categoria: "Pudins", tags: ["cremoso", "calda"], img: "https://i.imgur.com/D79uBcs.png",
    desc: "Pudim lisinho, cremoso e com calda brilhante. Sob encomenda no tamanho ideal para você." },

  // Bolos de Pote
  { id: 4, nome: "Bolo de Pote", categoria: "Potes da Felicidade", tags: ["camadas", "recheio"], img: "https://i.imgur.com/kvn4rRP.jpeg",
    desc: "Camadas bem montadas com massa macia e recheio generoso. Você escolhe o sabor." },

  //Pote da Felicidade
  { id: 8, nome: "Pote da Felicidade", categoria: "Potes da Felicidade", tags: ["recheado", "camadas"], img: "https://i.imgur.com/s1DGY0X.jpeg",
    desc: "Pote recheado com camadas generosas de creme, bolo e coberturas deliciosas. Uma verdadeira explosão de sabor." },

  //Bombom no Pote
  { id: 9,
    nome: "Bombom no Pote",
    categoria: "Potes da Felicidade",
    tags: ["bombom", "cremoso"],
    imgs: [
      "https://i.imgur.com/Nld44zh.jpeg",
      "https://i.imgur.com/4HQFbOE.jpeg"
    ],
    desc: "Versão especial de bombom no pote com camadas de creme, chocolate e recheios irresistíveis." 
  },

  // Brownies
  { id: 5, nome: "Brownie", categoria: "Brownies", tags: ["intenso", "macio"], img: "https://i.imgur.com/Js3uWaN.jpeg",
    desc: "Brownie úmido e chocolatudo, com recheio a sua escolha, perfeito para acompanhar um café ou presentear." },

  // Bombons
  { id: 6, nome: "Bombom Trufado", categoria: "Bombons", tags: ["trufa", "recheado"], img: "https://i.imgur.com/gXXrt9a.jpeg",
    desc: "Bombons trufados com recheio cremoso e cobertura irresistível." },

  // Cones
  { id: 7, nome: "Cone Trufado", categoria: "Cones Trufados", tags: ["recheado", "crocante"], img: "https://i.imgur.com/x9G4EI9.jpeg",
    desc: "Cone crocante recheado com trufa cremosa e finalização deliciosa." },
];

const STORAGE_KEY = "doceria_bia_produtos";

let produtos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || produtosPadrao;

function salvarProdutos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

function obterCategorias() {
  return ["Todos", ...new Set(produtos.map(p => p.categoria))];
}

const grid = document.getElementById("gridProdutos");
const chips = document.getElementById("chips");
const search = document.getElementById("search");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");
const modalWpp = document.getElementById("modalWpp");

let categoriaAtiva = "Todos";
let imagemAtual = 0;
let imagensProduto = [];

function criarLinkWhatsApp(produto) {
  const msg =
    `Oi Bia! Quero fazer uma encomenda 😊\n\n` +
    `Produto: ${produto.nome}\n` +
    `Categoria: ${produto.categoria}\n` +
    `Sabores/Detalhes: (escrever aqui)\n` +
    `Quantidade: (escrever aqui)\n` +
    `Data desejada: (escrever aqui)`;

  return `https://api.whatsapp.com/send?phone=${WHATS}&text=${encodeURIComponent(msg)}`;
}

function renderChips() {
  chips.innerHTML = "";
  const categorias = obterCategorias();
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === categoriaAtiva ? " ativo" : "");
    btn.textContent = cat;

    btn.addEventListener("click", () => {
      categoriaAtiva = cat;
      renderChips();
      renderProdutos();
    });

    chips.appendChild(btn);
  });
}

function cardProduto(p) {
  const el = document.createElement("article");
  el.className = "card";

  el.innerHTML = `
    <img src="${p.imgs ? p.imgs[0] : p.img}" alt="${p.nome}">
    <div class="card-body">
      <h3>${p.nome}</h3>
      <p>${p.desc}</p>
      <div class="meta">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-mini" data-ver="${p.id}">Ver detalhes</button>
      <a class="btn-mini pedir" href="${criarLinkWhatsApp(p)}" target="_blank">Pedir</a>
    </div>
  `;

  el.querySelector(`[data-ver="${p.id}"]`).addEventListener("click", () => abrirModal(p));
  return el;
}

function renderProdutos() {
  const termo = (search.value || "").toLowerCase().trim();

  const filtrados = produtos.filter(p => {
    const matchCat = (categoriaAtiva === "Todos") || (p.categoria === categoriaAtiva);
    const matchBusca =
      !termo ||
      p.nome.toLowerCase().includes(termo) ||
      p.desc.toLowerCase().includes(termo) ||
      p.tags.some(t => t.toLowerCase().includes(termo));
    return matchCat && matchBusca;
  });

  grid.innerHTML = "";
  if (filtrados.length === 0) {
    grid.innerHTML = `<p style="padding:10px 2px;">Nenhum produto encontrado 😢</p>`;
    return;
  }

  filtrados.forEach(p => grid.appendChild(cardProduto(p)));
}

function abrirModal(p) {

  imagensProduto = p.imgs ? p.imgs : [p.img];
  imagemAtual = 0;

  modalImg.src = imagensProduto[imagemAtual];
  modalImg.alt = p.nome;

  modalTitle.textContent = p.nome;
  modalDesc.textContent = p.desc;
  modalMeta.textContent = `Categoria: ${p.categoria} • Sob encomenda`;
  modalWpp.href = criarLinkWhatsApp(p);

  modal.classList.add("aberto");
  modal.setAttribute("aria-hidden", "false");
}

function fecharModal() {
  modal.classList.remove("aberto");
  modal.setAttribute("aria-hidden", "true");
}

if (modalImg) {
  modalImg.addEventListener("click", () => {
    if (imagensProduto.length > 1) {
      imagemAtual = (imagemAtual + 1) % imagensProduto.length;
      modalImg.src = imagensProduto[imagemAtual];
    }
  });
}

search.addEventListener("input", renderProdutos);
if (modalClose) modalClose.addEventListener("click", fecharModal);
if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) fecharModal(); });

document.getElementById("ano").textContent = new Date().getFullYear();


window.addEventListener("scroll", () => {
  const topo = document.querySelector(".topo");
  topo.style.boxShadow = (window.scrollY > 20) ? "0 10px 22px rgba(0,0,0,0.20)" : "none";
});


renderChips();
renderProdutos();

renderProdutos();


const adminPage = document.getElementById("adminPage");
const adminForm = document.getElementById("adminForm");
const produtoId = document.getElementById("produtoId");
const produtoNome = document.getElementById("produtoNome");
const produtoCategoria = document.getElementById("produtoCategoria");
const produtoDesc = document.getElementById("produtoDesc");
const produtoTags = document.getElementById("produtoTags");
const produtoImagem = document.getElementById("produtoImagem");
const previewImagem = document.getElementById("previewImagem");
const limparForm = document.getElementById("limparForm");
const listaAdminProdutos = document.getElementById("listaAdminProdutos");

let imagemAtualAdmin = "";

function verificarAdmin() {
  if (window.location.hash === "#1233") {
    document.body.classList.add("admin-mode");
    renderAdminProdutos();
  }
}

function limparFormularioAdmin() {
  produtoId.value = "";
  produtoNome.value = "";
  produtoCategoria.value = "";
  produtoDesc.value = "";
  produtoTags.value = "";
  produtoImagem.value = "";
  imagemAtualAdmin = "";
  previewImagem.src = "";
  previewImagem.classList.remove("ativo");
}

function renderAdminProdutos() {
  if (!listaAdminProdutos) return;

  listaAdminProdutos.innerHTML = "";

  produtos.forEach(produto => {
    const item = document.createElement("div");
    item.className = "admin-item";

    item.innerHTML = `
      <img src="${produto.imgs ? produto.imgs[0] : produto.img}" alt="${produto.nome}">
      <div>
        <h4>${produto.nome}</h4>
        <p><strong>Categoria:</strong> ${produto.categoria}</p>
        <p>${produto.desc}</p>
      </div>
      <div class="admin-item-acoes">
        <button class="btn-edit" type="button" data-edit="${produto.id}">Editar</button>
        <button class="btn-delete" type="button" data-delete="${produto.id}">Excluir</button>
      </div>
    `;

    item.querySelector("[data-edit]").addEventListener("click", () => editarProduto(produto.id));
    item.querySelector("[data-delete]").addEventListener("click", () => excluirProduto(produto.id));

    listaAdminProdutos.appendChild(item);
  });
}

function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  produtoId.value = produto.id;
  produtoNome.value = produto.nome;
  produtoCategoria.value = produto.categoria;
  produtoDesc.value = produto.desc;
  produtoTags.value = produto.tags.join(", ");

  imagemAtualAdmin = produto.imgs ? produto.imgs[0] : produto.img;
  previewImagem.src = imagemAtualAdmin;
  previewImagem.classList.add("ativo");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirProduto(id) {
  const confirmar = confirm("Deseja excluir este produto?");
  if (!confirmar) return;

  produtos = produtos.filter(p => p.id !== id);
  salvarProdutos();

  renderChips();
  renderProdutos();
  renderAdminProdutos();
  limparFormularioAdmin();
}

if (produtoImagem) {
  produtoImagem.addEventListener("change", () => {
    const arquivo = produtoImagem.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
      imagemAtualAdmin = leitor.result;
      previewImagem.src = imagemAtualAdmin;
      previewImagem.classList.add("ativo");
    };

    leitor.readAsDataURL(arquivo);
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const idEditando = produtoId.value ? Number(produtoId.value) : null;

    const produto = {
      id: idEditando || Date.now(),
      nome: produtoNome.value.trim(),
      categoria: produtoCategoria.value.trim(),
      desc: produtoDesc.value.trim(),
      tags: produtoTags.value.split(",").map(tag => tag.trim()).filter(Boolean),
      img: imagemAtualAdmin || "https://via.placeholder.com/600x400?text=Produto",
    };

    if (idEditando) {
      produtos = produtos.map(p => p.id === idEditando ? produto : p);
    } else {
      produtos.push(produto);
    }

    salvarProdutos();

    categoriaAtiva = "Todos";
    renderChips();
    renderProdutos();
    renderAdminProdutos();
    limparFormularioAdmin();

    alert("Produto salvo com sucesso!");
  });
}

if (limparForm) {
  limparForm.addEventListener("click", limparFormularioAdmin);
}

window.addEventListener("hashchange", verificarAdmin);
verificarAdmin();
