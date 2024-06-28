import { calculateCartQuantity } from "../data/cart.js";

export function renderCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  
  const cartHtml = `
    <img class="cart-icon" src="images/icons/cart-icon.png" />
    <div class="cart-quantity">${cartQuantity}</div>
    <div class="cart-text">Cart</div>
  `

  document.querySelector(".js-cart-link").innerHTML = cartHtml;
}

export function renderHeader() {
  document.querySelector('.js-amazon-header').innerHTML = `
    <div class="amazon-header-left-section">
      <a href="index.html" class="header-link">
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
      <a class="orders-link header-link" href="orders.html">
        <span class="returns-text">Returns</span>
        <span class="orders-text">& Orders</span>
      </a>

      <a class="cart-link header-link js-cart-link" href="checkout.html">
      </a>
    </div>
  `;

  renderCartQuantity();
  
  document.querySelector('.js-search-bar').addEventListener('keypress', (event) => {
    const searchTerm = document.querySelector('.js-search-bar').value;
    if (event.key === "Enter") {
      window.location.href = `index.html?search=${searchTerm}`;
    }
  });

  document.querySelector('.js-search-button').addEventListener('click', () => {
    const searchTerm = document.querySelector('.js-search-bar').value;
    window.location.href = `index.html?search=${searchTerm}`;
  })
}