// ALAIA - Carrito y WhatsApp
// Cambia este número por el WhatsApp real del asesor.
// Formato internacional, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = "573001234567";

const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsEl = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const whatsappCheckout = document.getElementById("whatsappCheckout");

let cart = JSON.parse(localStorage.getItem("alaiaCart") || "[]");

const money = value => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0
}).format(value);

function saveCart() {
  localStorage.setItem("alaiaCart", JSON.stringify(cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.alaiaToastTimer);
  window.alaiaToastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartEmpty.hidden = cart.length > 0;
  cartItemsEl.innerHTML = "";

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${money(item.price)}</span>
      </div>
      <div class="cart-item-actions">
        <button data-action="minus" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button data-action="plus" data-index="${index}">+</button>
        <button class="remove-item" data-action="remove" data-index="${index}" aria-label="Eliminar">×</button>
      </div>`;
    cartItemsEl.appendChild(row);
  });

  cartTotal.textContent = money(total);
  whatsappCheckout.href = buildWhatsAppUrl();
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  saveCart();
  renderCart();
  openCart();
  showToast(`${name} agregado al carrito`);
}

function buildWhatsAppUrl() {
  if (!cart.length) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hola ALAIA 👋, quiero consultar sobre sus productos."
    )}`;
  }

  const lines = cart.map(item =>
    `• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`
  );
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message =
`Hola ALAIA 👋, quiero realizar este pedido:

${lines.join("\n")}

Total estimado: ${money(total)}

Quedo atento/a para confirmar disponibilidad, envío y medios de pago.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
  document.body.classList.remove("cart-open");
}

document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    addToCart(btn.dataset.product, Number(btn.dataset.price || 0));
  });
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

cartItemsEl.addEventListener("click", e => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  const item = cart[index];

  if (action === "plus") item.quantity++;
  if (action === "minus") item.quantity--;
  if (action === "remove" || item.quantity <= 0) cart.splice(index, 1);

  saveCart();
  renderCart();
});

document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  showToast("Carrito vaciado");
});

document.querySelectorAll(".whatsapp-link").forEach(link => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola ALAIA 👋, quisiera recibir atención personalizada."
  )}`;
});

/* ===== BUSCADOR AVANZADO ===== */
const searchBtnEl = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearchEl = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const searchResults = document.getElementById("searchResults");
const searchStatus = document.getElementById("searchStatus");
const searchSuggestions = document.getElementById("searchSuggestions");

const searchableProducts = [...document.querySelectorAll(".product-card")].map(card => ({
  name: card.querySelector("h3")?.textContent.trim() || "Producto",
  price: card.querySelector(".product-info p")?.textContent.trim() || "",
  image: card.querySelector("img")?.getAttribute("src") || "",
  element: card
}));

function normalizeText(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderSearchResults(term = "") {
  const query = normalizeText(term.trim());

  if (!query) {
    searchResults.innerHTML = "";
    searchStatus.textContent = "Escribe para buscar entre nuestros productos";
    return;
  }

  const matches = searchableProducts.filter(product => {
    const cardText = normalizeText(product.element.textContent || "");
    const altText = normalizeText(product.element.querySelector("img")?.alt || "");
    const searchableText = `${normalizeText(product.name)} ${cardText} ${altText} bolso bolsos accesorios nuevo nuevos lanzamiento coleccion colección`.trim();
    return searchableText.includes(query);
  });

  searchStatus.textContent = matches.length
    ? `${matches.length} ${matches.length === 1 ? "artículo encontrado" : "artículos encontrados"}`
    : "0 artículos encontrados";

  if (!matches.length) {
    searchResults.innerHTML = `
      <div class="search-empty">
        <strong>No encontramos “${term.replace(/</g, "&lt;")}”</strong>
        <span>Prueba con “orquídea”, “clásico” o “bolso”.</span>
      </div>`;
    return;
  }

  searchResults.innerHTML = matches.map((product, index) => `
    <button type="button" class="search-result-card" data-result-index="${searchableProducts.indexOf(product)}">
      <img src="${product.image}" alt="">
      <span>
        <strong>${product.name}</strong>
        <span>${product.price}</span>
      </span>
    </button>
  `).join("");
}

function openSearch(term = "") {
  if (!searchOverlay) return;
  searchOverlay.classList.add("open");
  searchOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("search-open");
  searchInput.value = term;
  renderSearchResults(term);
  setTimeout(() => searchInput.focus(), 80);
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove("open");
  searchOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("search-open");
}

if (searchBtnEl) searchBtnEl.addEventListener("click", () => openSearch());
if (closeSearchEl) closeSearchEl.addEventListener("click", closeSearch);

if (searchOverlay) {
  searchOverlay.addEventListener("click", e => {
    if (e.target === searchOverlay) closeSearch();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", e => renderSearchResults(e.target.value));
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSearch();
  });
}

if (clearSearch) {
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    renderSearchResults("");
    searchInput.focus();
  });
}

if (searchSuggestions) {
  searchSuggestions.addEventListener("click", e => {
    const button = e.target.closest("[data-search-term]");
    if (!button) return;
    const term = button.dataset.searchTerm;
    searchInput.value = term;
    renderSearchResults(term);
    searchInput.focus();
  });
}

if (searchResults) {
  searchResults.addEventListener("click", e => {
    const result = e.target.closest("[data-result-index]");
    if (!result) return;
    const product = searchableProducts[Number(result.dataset.resultIndex)];
    closeSearch();
    product.element.scrollIntoView({ behavior: "smooth", block: "center" });
    product.element.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
      { duration: 450, easing: "ease-out" }
    );
    setTimeout(() => product.element.querySelector(".add-cart")?.focus(), 500);
  });
}

/* ===== MI CUENTA / PERFIL LOCAL ===== */
const accountBtn = document.getElementById("accountBtn");
const accountOverlay = document.getElementById("accountOverlay");
const closeAccount = document.getElementById("closeAccount");
const accountForm = document.getElementById("accountForm");
const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountWelcome = document.getElementById("accountWelcome");
const accountStatus = document.getElementById("accountStatus");
const clearAccount = document.getElementById("clearAccount");

function getAccount() {
  try {
    return JSON.parse(localStorage.getItem("alaiaAccount") || "{}");
  } catch {
    return {};
  }
}

function renderAccount() {
  const account = getAccount();
  if (!accountName || !accountEmail || !accountWelcome || !accountStatus) return;
  accountName.value = account.name || "";
  accountEmail.value = account.email || "";
  accountWelcome.textContent = account.name
    ? `Hola, ${account.name} ✨`
    : "Tu espacio en ALAIA";
  accountStatus.textContent = account.name
    ? "Tus datos están guardados únicamente en este dispositivo."
    : "";
}

function openAccount() {
  if (!accountOverlay) return;
  renderAccount();
  accountOverlay.classList.add("open");
  accountOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("account-open");
  setTimeout(() => accountName.focus(), 80);
}

function closeAccountPanel() {
  accountOverlay.classList.remove("open");
  accountOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("account-open");
}

if (accountBtn) accountBtn.addEventListener("click", openAccount);
if (closeAccount) closeAccount.addEventListener("click", closeAccountPanel);

if (accountOverlay) {
  accountOverlay.addEventListener("click", e => {
    if (e.target === accountOverlay) closeAccountPanel();
  });
}

if (accountForm) {
  accountForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = accountName.value.trim();
    const email = accountEmail.value.trim();

    if (!name) {
      accountStatus.textContent = "Escribe tu nombre para guardar tus datos.";
      accountName.focus();
      return;
    }

    localStorage.setItem("alaiaAccount", JSON.stringify({ name, email }));
    renderAccount();
    accountStatus.textContent = "✓ Datos guardados correctamente.";
    showToast(`¡Hola, ${name}! Tus datos fueron guardados.`);
  });
}

if (clearAccount) {
  clearAccount.addEventListener("click", () => {
    localStorage.removeItem("alaiaAccount");
    renderAccount();
    accountStatus.textContent = "Datos eliminados de este dispositivo.";
  });
}

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (searchOverlay?.classList.contains("open")) closeSearch();
  if (accountOverlay?.classList.contains("open")) closeAccountPanel();
});

const subscribeEl = document.getElementById("subscribe");
if (subscribeEl) {
  subscribeEl.addEventListener("submit", e => {
    e.preventDefault();
    showToast("¡Gracias! Te hemos suscrito a ALAIA.");
    e.target.reset();
  });
}

renderCart();
