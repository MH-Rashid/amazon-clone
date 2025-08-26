import { calculateCartQuantity } from "../../data/cart.js";

export default function renderCheckoutHeader() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(".js-checkout-header").innerHTML = `
    <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html">
          <img class="amazon-logo" src="images/amazon-logo.png" />
          <img
            class="amazon-mobile-logo"
            src="images/amazon-mobile-logo.png"
          />
        </a>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (<a
          class="return-to-home-link js-return-link"
          href="products.html"
        >
          ${cartQuantity} items
        </a>)
      </div>

      <div class="checkout-header-right-section">
        <img src="images/icons/checkout-lock-icon.png" />
      </div>
    </div>
  `;
}
