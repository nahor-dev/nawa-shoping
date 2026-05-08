// Main site JavaScript
// Controls the navbar hide/show behavior based on scroll direction.

const navbar = document.querySelector('.navbar');
let lastScrollY = window.pageYOffset;
let ticking = false;

function updateNavbar() {
  const currentScrollY = window.pageYOffset;

  if (currentScrollY <= 0) {
    // At the top of the page, reset the navbar state.
    navbar.classList.remove('navbar-hidden', 'navbar-visible', 'navbar-scrolled');
  } else {
    // Add the scrolled class once we leave the top.
    navbar.classList.add('navbar-scrolled');

    if (currentScrollY > lastScrollY) {
      // Scrolling down: hide the navbar.
      navbar.classList.add('navbar-hidden');
      navbar.classList.remove('navbar-visible');
    } else {
      // Scrolling up: show the navbar.
      navbar.classList.remove('navbar-hidden');
      navbar.classList.add('navbar-visible');
    }
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateNavbar);
    ticking = true;
  }
});




// Additional JavaScript for other site features can be added here.


// ===== CART SETUP =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ===== UPDATE CART COUNT (ICON) =====
function updateCartCount() {
  // Keep cart storage and page logic, but do not display a badge on the navbar cart icon.
  // This prevents the '3' or any count from appearing next to the cart icon.
}

// ===== ADD TO CART =====
function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart();
  showToast("Item added to cart");
}

// ===== GET PRODUCT DATA FROM HTML =====
function setupBuyButtons() {
  const buttons = document.querySelectorAll(".buy-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const productEl = button.closest(".product");

      const name = productEl.querySelector(".p-name").innerText;
      const price = parseFloat(
        productEl.querySelector(".p-price").innerText.replace("$", "")
      );
      const image = productEl.querySelector("img").src;

      const product = { name, price, image };

      addToCart(product);
    });
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== CART PAGE LOGIC =====
function renderCartPage() {
  const cartContainer = document.querySelector(".cart-items");
  const totalEl = document.querySelector(".cart-total");

  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.image}" width="80">
      <h5>${item.name}</h5>
      <p>$${item.price}</p>
      <div>
        <button onclick="changeQty(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
      <button onclick="removeItem(${index})">Remove</button>
    `;

    cartContainer.appendChild(div);
  });

  if (totalEl) {
    totalEl.innerText = "Total: $" + total.toFixed(2);
  }
}

// ===== CHANGE QUANTITY =====
function changeQty(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCartPage();
}

// ===== REMOVE ITEM =====
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartPage();
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  setupBuyButtons();
  updateCartCount();
  renderCartPage();
});