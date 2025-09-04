import { calculateCartQuantity } from "../data/cart.js";
import { logout } from "./http.js";

// Icon SVGs (Amazon style, simplified)
const icons = {
  home: `<svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10z"/></svg>`,
  account: `<svg width="24" height="24" fill="#fff"><circle cx="12" cy="9" r="4"/><path d="M4 20c0-3.3 3.6-5 8-5s8 1.7 8 5v1H4v-1z" fill="#fff"/></svg>`,
  orders: `<svg width="24" height="24" fill="#fff"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h8v2H8z" fill="#232f3e"/><path d="M8 14h5v2H8z" fill="#232f3e"/></svg>`,
  cart: `<svg width="24" height="24" fill="#fff"><circle cx="9" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 6h2l1.5 9h8l1.5-9H5z"/></svg>`,
};

const buttons = [
  { label: "Home", icon: icons.home, href: "products.html" },
  { label: "Account", icon: icons.account },
  { label: "Orders", icon: icons.orders, href: "orders.html" },
  { label: "Cart", icon: icons.cart, href: "checkout.html" },
];

function renderBottomNav() {
  // Create bottom navigation container
  const bottomNav = document.createElement("nav");
  bottomNav.className = "bottom-nav";

  // Create buttons
  buttons.forEach((btn) => {
    if (btn.label === "Account") {
      const wrapper = document.createElement("div");
      wrapper.className = "account-wrapper";

      const link = document.createElement("a");
      link.id = "account-btn";
      link.innerHTML = `${btn.icon}<span>${btn.label}</span>`;
      wrapper.appendChild(link);

      const popup = document.createElement("div");
      popup.className = "logout-popup";
      popup.innerHTML = `<button class="logout-btn">Logout</button>`;
      wrapper.appendChild(popup);

      bottomNav.appendChild(wrapper);
    } else if (btn.label === "Cart") {
      const link = document.createElement("a");
      link.href = btn.href;
      link.className = "js-mobile-cart-link";
      bottomNav.appendChild(link);
    } else {
      const link = document.createElement("a");
      link.href = btn.href;
      link.innerHTML = `${btn.icon}<span>${btn.label}</span>`;
      bottomNav.appendChild(link);
    }
  });

  return bottomNav;
}

const bottomNav = renderBottomNav();
document.body.appendChild(bottomNav);
renderMobileCartQuantity();

const accountBtn = document.getElementById("account-btn");
const logoutPopup = document.querySelector(".logout-popup");

accountBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logoutPopup.classList.toggle("active");
});

// Close popup if user taps outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".account-wrapper")) {
    logoutPopup.classList.remove("active");
  }
});

document.querySelector(".logout-btn").addEventListener("click", async () => {
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

// let bottomNav = null;

// function handleBottomNavVisibility() {
//   if (window.innerWidth <= 768) {
//     if (!document.querySelector(".bottom-nav")) {
//       bottomNav = renderBottomNav();
//       document.body.appendChild(bottomNav);
//       renderMobileCartQuantity();

//       const accountBtn = document.getElementById("account-btn");
//       const logoutPopup = document.querySelector(".logout-popup");

//       accountBtn.addEventListener("click", (e) => {
//         e.preventDefault();
//         logoutPopup.classList.toggle("active");
//       });

//       // Close popup if user taps outside
//       document.addEventListener("click", (e) => {
//         if (!e.target.closest(".account-wrapper")) {
//           logoutPopup.classList.remove("active");
//         }
//       });

//       document
//         .querySelector(".logout-btn")
//         .addEventListener("click", async () => {
//           const response = await logout();
//           if (response.ok) {
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("user");
//             localStorage.removeItem("products");
//             window.location.href = "/index.html";
//           } else {
//             showToast(
//               "Logout failed: " + (response.message || "Unknown error"),
//               "error"
//             );
//           }
//         });
//     }
//   } else {
//     const existingNav = document.querySelector(".bottom-nav");
//     if (existingNav) {
//       existingNav.style.display = "none";
//       existingNav.remove();
//       bottomNav = null;
//     }
//   }
// }

// window.addEventListener("load", handleBottomNavVisibility);
// window.addEventListener("DOMContentLoaded", handleBottomNavVisibility);
// window.addEventListener("resize", handleBottomNavVisibility);

export function renderMobileCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  const cartHtml = `
    <div class="cart-icon-wrapper">
      ${icons.cart}
      <div class="mobile-cart-quantity">${cartQuantity}</div>
    </div>
    <span>Cart</span>
  `;

  document.querySelector(".js-mobile-cart-link").innerHTML = cartHtml;
}
