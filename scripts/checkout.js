import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import renderCheckoutHeader from "./checkout/checkoutHeader.js";

async function loadPage() {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();