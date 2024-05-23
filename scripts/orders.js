import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import formatCurrency from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { renderHeader, renderCartQuantity } from "./header.js";

async function loadPage() {
  renderHeader();
  await loadProductsFetch();

  let ordersHtml = "";

  orders.forEach((order) => {
    const { orderTime } = order;
    const orderDate = dayjs(orderTime).format("MMMM D");

    const { totalCostCents } = order;
    const totalCost = formatCurrency(totalCostCents);

    ordersHtml += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${totalCost}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsGridHtml(order)}
        </div>
      </div>
    `;

    function productsGridHtml(order) {
      let html = "";

      const { products } = order;

      products.forEach((product) => {
        const { productId } = product;
        const matchingProduct = getProduct(productId);

        const { estimatedDeliveryTime } = product;
        const currentTime = dayjs();
        const arrivalDate = dayjs(estimatedDeliveryTime);

        html += `
          <div class="product-image-container">
            <img src="${matchingProduct.image}" />
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">${currentTime < arrivalDate ? 'Arriving' : 'Delivered'} on: ${arrivalDate.format("MMMM D")}</div>
            <div class="product-quantity">Quantity: ${product.quantity}</div>
            <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${matchingProduct.id}">
              <img class="buy-again-icon" src="images/icons/buy-again.png" />
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${matchingProduct.id}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      });

      return html;
    }
  });

  document.querySelector(".js-orders-grid").innerHTML = ordersHtml;
  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      addToCart(button.dataset.productId);
      renderCartQuantity();
      button.innerHTML = '✔ Added';
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });
}

loadPage();