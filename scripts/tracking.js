import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { getProduct } from "../data/products.js";
import { renderHeader } from "./header.js";
import { fetchSingleOrder } from "./http.js";
import { showToast } from "./utils/toast.js";

async function loadPage() {
  renderHeader();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  let matchingOrder;

  try {
    const response = await fetchSingleOrder(orderId);
    if (response.ok) {
      matchingOrder = response.order;
    } else {
      showToast(response.message || "Order not found.", "error");
      window.location.href = "orders.html";
    }
  } catch (error) {
    console.error(error);
    showToast("Failed to load order details." + error.message, "error");
  }

  const { products } = matchingOrder;

  const productDetails = products.find(
    (product) => product.productId === productId
  );

  const matchingProduct = getProduct(productId);

  const arrivalDate = dayjs(productDetails.estimatedDeliveryTime).format(
    "dddd, MMMM D"
  );

  const currentTime = dayjs();
  const orderTime = dayjs(matchingOrder.createdAt);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  const deliveryProgress =
    ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;

  const html = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">${
      deliveryProgress < 100
        ? `Arriving on ${arrivalDate}`
        : `Delivered on ${arrivalDate}`
    }</div>

    <div class="product-info">
      ${matchingProduct.name}
    </div>

    <div class="product-info">Quantity: ${productDetails.quantity}</div>

    <img
      class="product-image"
      src="${matchingProduct.image}"
    />

    <div class="progress-labels-container">
      <div class="progress-label ${
        deliveryProgress <= 49 && "current-status"
      }">Preparing</div>
      <div class="progress-label ${
        deliveryProgress >= 50 && deliveryProgress <= 99
          ? "current-status"
          : null
      }">Shipped</div>
      <div class="progress-label ${
        deliveryProgress >= 100 && "current-status"
      }">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <progress value=${deliveryProgress} max=100></progress>
    </div>
  `;

  document.querySelector(".js-order-tracking").innerHTML = html;

  // set up progress bar transition
  const progressEl = document.querySelector("progress");
  progressEl.value = 0;

  setTimeout(() => {
    progressEl.value = deliveryProgress; // triggers CSS transition
  }, 100);
}

loadPage();
