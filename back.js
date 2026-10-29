
const products = [
  {
    id: 1, name: "Premium Smartphone", brand: "Mobile",
    category: "Smartphones", price: 24999, oldPrice: 29999,
    rating: 4.8, tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2, name: "Classic Wireless Headphones", brand: "Audio",
    category: "Audio", price: 3999, oldPrice: 4999,
    rating: 4.7, tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3, name: "Minimal Smartwatch", brand: "Wearables",
    category: "Accessories", price: 5999, oldPrice: 7499,
    rating: 4.6, tag: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4, name: "Everyday Wireless Earbuds", brand: "Audio",
    category: "Audio", price: 1999, oldPrice: 2799,
    rating: 4.5, tag: "GREAT VALUE",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5, name: "Modern Mobile Phone", brand: "Mobile",
    category: "Smartphones", price: 18999, oldPrice: 21999,
    rating: 4.7, tag: "TOP PICK",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6, name: "Premium Audio Headset", brand: "Audio",
    category: "Audio", price: 4499, oldPrice: 5499,
    rating: 4.6, tag: "SPECIAL PRICE",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7, name: "Everyday Smart Accessory", brand: "Accessories",
    category: "Accessories", price: 1499, oldPrice: 1999,
    rating: 4.4, tag: "DEAL",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8, name: "Flagship Style Smartphone", brand: "Mobile",
    category: "Smartphones", price: 32999, oldPrice: 36999,
    rating: 4.9, tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80"
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const productGrid = $("#productGrid");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");
const resultLabel = $("#resultLabel");
const emptyState = $("#emptyState");
const clearFilterBtn = $("#clearFilter");

let selectedCategory = "All";
let searchTerm = "";
let cart = [];
let activeSlide = 0;
let slideTimer;
let toastTimer;

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

/* Notifications */
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* Product catalogue */
function getVisibleProducts() {
  let visible = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchable = [
      product.name,
      product.brand,
      product.category,
      product.tag
    ].join(" ").toLowerCase();

    return matchesCategory && searchable.includes(searchTerm);
  });

  switch (sortSelect.value) {
    case "price-low":
      visible.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      visible.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      visible.sort((a, b) => b.rating - a.rating);
      break;
  }

  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();

  productGrid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.style.opacity='0.15'">
        <span class="product-tag">${escapeHTML(product.tag)}</span>
      </div>

      <div class="product-info">
        <div class="product-brand">${escapeHTML(product.brand)}</div>
        <h3 class="product-name">${escapeHTML(product.name)}</h3>
        <div class="product-rating">
          ★★★★★ <span>${product.rating.toFixed(1)} / 5</span>
        </div>

        <div class="product-bottom">
          <div>
            <span class="product-price">${money(product.price)}</span>
            <span class="old-price">${money(product.oldPrice)}</span>
          </div>
          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Add ${escapeHTML(product.name)} to bag"
            title="Add to bag">+</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visible.length !== 0;
  resultLabel.textContent = searchTerm
    ? `${visible.length} matching product${visible.length === 1 ? "" : "s"}`
    : selectedCategory === "All"
      ? "Our current favourites"
      : `Showing ${selectedCategory}`;

  clearFilterBtn.hidden =
    selectedCategory === "All" && !searchTerm;
}

/* Search */
$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

clearFilterBtn.addEventListener("click", () => {
  selectedCategory = "All";
  searchTerm = "";
  searchInput.value = "";
  sortSelect.value = "featured";
  renderProducts();
  updateCategoryLinks();
});

function updateCategoryLinks() {
  $$("[data-category]").forEach((link) => {
    link.setAttribute(
      "aria-current",
      link.dataset.category === selectedCategory ? "true" : "false"
    );
  });
}

$$("[data-category]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.category;
    searchTerm = "";
    searchInput.value = "";
    sortSelect.value = "featured";
    renderProducts();
    updateCategoryLinks();
  });
});

/* Shopping cart */
function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your bag`);
}

function changeQuantity(productId, change) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  renderCart();
  showToast("Item removed from your bag");
}

function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  $("#cartCount").textContent = count;
  $("#cartSubtotal").textContent = money(subtotal);

  $("#cartItems").innerHTML = cart.length
    ? cart.map((item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${escapeHTML(item.name)}">
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${money(item.price)}</p>
          <div class="quantity-control">
            <button data-quantity="${item.id}" data-change="-1"
              aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-quantity="${item.id}" data-change="1"
              aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${item.id}">Remove</button>
      </div>
    `).join("")
    : `<div class="cart-empty">
        <p>Your bag is waiting for something special.</p>
        <p>Explore our collection to get started.</p>
      </div>`;
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

$("#cartItems").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

/* Cart drawer */
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartOverlay").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  $("#closeCart").focus();
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartOverlay").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);

/* Demo checkout: no payment is processed */
$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your bag is empty. Add a product first.");
    return;
  }

  showToast("Demo checkout only — connect a secure payment system to accept orders.");
});

/* Account modal */
function closeAccount() {
  $("#accountModal").classList.remove("open");
}

$("#accountBtn").addEventListener("click", () => {
  $("#accountModal").classList.add("open");
  $("#closeAccount").focus();
});

$("#closeAccount").addEventListener("click", closeAccount);
$("#accountContinue").addEventListener("click", closeAccount);

$("#accountModal").addEventListener("click", (event) => {
  if (event.target === $("#accountModal")) closeAccount();
});

/* Premium automatic hero slider */
const slides = $$(".hero-slide");
const dotsContainer = $("#sliderDots");
const progressBar = $("#sliderProgress");
const SLIDE_DURATION = 5500;

slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show advertisement ${index + 1}`);
  dot.addEventListener("click", () => {
    showSlide(index);
    startSliderTimer();
  });
  dotsContainer.appendChild(dot);
});

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  [...dotsContainer.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
    dot.setAttribute("aria-current", dotIndex === activeSlide ? "true" : "false");
  });

  // Restart the progress animation for each advertisement.
  progressBar.classList.remove("running");
  void progressBar.offsetWidth;
  progressBar.classList.add("running");
}

function startSliderTimer() {
  clearInterval(slideTimer);
  showSlide(activeSlide);

  slideTimer = setInterval(() => {
    showSlide(activeSlide + 1);
  }, SLIDE_DURATION);
}

$("#prevSlide").addEventListener("click", () => {
  showSlide(activeSlide - 1);
  startSliderTimer();
});

$("#nextSlide").addEventListener("click", () => {
  showSlide(activeSlide + 1);
  startSliderTimer();
});

// Pause autoplay when the visitor hovers over the advertisement.
const hero = $(".hero");

hero.addEventListener("mouseenter", () => {
  clearInterval(slideTimer);
  progressBar.classList.remove("running");
});

hero.addEventListener("mouseleave", startSliderTimer);

// Pause automatic movement when the browser tab is hidden.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(slideTimer);
  } else {
    startSliderTimer();
  }
});

/* Newsletter demo */
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const emailInput = $("#newsletterEmail");
  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  showToast("Thanks for your interest! Connect an email service to collect subscriptions.");
  emailInput.value = "";
});

/* Keyboard controls */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeAccount();
  }
});

/* Initial setup */
$("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
showSlide(0);
startSliderTimer();
