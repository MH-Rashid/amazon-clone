import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { calculateDeliveryDate, getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { createOrder } from "../http.js";
import { showToast } from "../utils/toast.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let numberOfItems = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    numberOfItems += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${numberOfItems}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-shipping-price">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-total-cents">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  document.querySelector(".js-place-order")
    .addEventListener("click", async () => {
      const updatedCart = cart.map(cartItem => {
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        const estimatedDeliveryTime = calculateDeliveryDate(deliveryOption).format("dddd, MMMM D YYYY");
        const { deliveryOptionId, ...rest } = cartItem;
    
        return {
          ...rest,
          estimatedDeliveryTime
        };
      });
      
      const payload = {
        products: updatedCart,
        totalCostCents: totalCents
      }
      
      try {
        const response = await createOrder(payload);
        if (response._id) {
          showToast("Order has been placed", "success");
          localStorage.removeItem('cart');
          window.location.href = "orders.html";
        } else {
          showToast(
            "Failed to place order: " + (response.message || "Unknown error"),
            "error"
          );
        }
      } catch (error) {
        console.error(error);
        showToast("An error occurred: " + (error.message || "Unknown error"), "error");
      } 
    });
}
