import { addToCart, calculateCartQuantity } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";
import { renderCartQuantity, renderHeader } from "./header.js";

renderHeader();
loadProducts(renderProductsGrid);

function renderProductsGrid() {
  let productsHTML = "";
  let filteredProducts = products;

  const url = new URL(window.location.href);
  const searchTerm = url.searchParams.get("search");

  if (searchTerm) {
    filteredProducts = products.filter((product) => {
      const { keywords } = product;

      return (
        product.name.toLowerCase().includes(searchTerm) ||
        keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
      );
    });
  }

  if (!filteredProducts.length) {
    document.querySelector('.js-main').innerHTML = `<p style="
      font-family: Arial;
      font-size: 16px;
      color: rgb(33, 33, 33);
      margin-left: 20px;
      padding-top: 20px;
    ">No products matched your search.</p>`;
  } else {
    filteredProducts.forEach((product) => {
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>
  
          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>
  
          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>
  
          <div class="product-price">
            ${product.getPrice()}
          </div>
  
          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
  
          ${product.extraInfoHTML()}
  
          <div class="product-spacer"></div>
  
          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>
  
          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">
            Add to Cart
          </button>
        </div>
      `;
    });
  }

  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  const addedMessageTimeouts = {};

  renderCartQuantity();

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;

      addToCart(productId);
      updateCartQuantity();

      const addedMessage = document.querySelector(
        `.js-added-to-cart-${productId}`
      );
      addedMessage.classList.add("show-added-to-cart");

      const previousTimeoutId = addedMessageTimeouts[productId];

      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove("show-added-to-cart");
      }, 2000);

      addedMessageTimeouts[productId] = timeoutId;
    });
  });
}
