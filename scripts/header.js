import { calculateCartQuantity } from "../data/cart.js";
import { logout } from "./http.js";
import { showToast } from "./utils/toast.js";

export function renderCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  const cartHtml = `
    <img class="cart-icon" src="images/icons/cart-icon.png" />
    <div class="cart-quantity">${cartQuantity}</div>
    <div class="cart-text">Cart</div>
  `;

  document.querySelector(".js-cart-link").innerHTML = cartHtml;
}

export function renderHeader() {
  document.querySelector(".js-amazon-header").innerHTML = `
    <div class="amazon-header-left-section">
      <a href="products.html" class="header-link">
        <img class="amazon-logo" src="images/amazon-logo-white.png" />
        <img
          class="amazon-mobile-logo"
          src="images/amazon-mobile-logo-white.png"
        />
      </a>
    </div>

    <div class="amazon-header-middle-section">
      <input class="search-bar js-search-bar" type="text" placeholder="Search" />

      <button class="search-button js-search-button">
        <img class="search-icon" src="images/icons/search-icon.png" />
      </button>
    </div>

    <div class="amazon-header-right-section">
      <div class="user-greeting" tabindex="0" aria-haspopup="true" aria-expanded="false">
        <span class="greeting-text"></span>
        <span class="arrow-icon"></span>
        <div class="dropdown-card" role="menu">
          <button id="sign-out-btn" role="menuitem">Sign out</button>
        </div>
      </div>
    
      <a class="orders-link header-link" href="orders.html">
        <span class="orders-text">Orders</span>
      </a>

      <a class="cart-link header-link js-cart-link" href="checkout.html">
      </a>
    </div>
  `;

  renderCartQuantity();

  const disclaimer = document.querySelector(".disclaimer");
  const header = document.querySelector(".amazon-header");

  function adjustHeaderOffset() {
    // Adjust header offset based on disclaimer height
    const height = disclaimer.offsetHeight;
    header.style.marginTop = `${height}px`;
  }

  window.addEventListener("load", adjustHeaderOffset);
  window.addEventListener("resize", adjustHeaderOffset);

  document
    .querySelector(".js-search-bar")
    .addEventListener("keypress", (event) => {
      const searchTerm = document.querySelector(".js-search-bar").value;
      if (event.key === "Enter") {
        window.location.href = `products.html?search=${searchTerm}`;
      }
    });

  document.querySelector(".js-search-button").addEventListener("click", () => {
    const searchTerm = document.querySelector(".js-search-bar").value;
    window.location.href = `products.html?search=${searchTerm}`;
  });

  const user = JSON.parse(localStorage.getItem("user"));
  document.querySelector(
    ".greeting-text"
  ).textContent = `Hello, ${user.firstname}`;

  document
    .getElementById("sign-out-btn")
    .addEventListener("click", async () => {
      const response = await logout();
      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("products");
        window.location.href = "/index.html";
      } else {
        showToast(
          "Logout failed: " + (response.message || "Unknown error"),
          "error"
        );
      }
    });
}