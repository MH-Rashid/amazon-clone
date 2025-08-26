import { getDeliveryOption } from "./deliveryOptions.js";
import { getProduct } from "./products.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  let quantity;
  
  if (quantitySelector) {
    quantity = Number(quantitySelector.value)
  } else quantity = 1;

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    const product = getProduct(productId);

    cart.push({
      productId,
      quantity: quantity,
      // priceCents: product.priceCents * quantity,
      deliveryOptionId: "1",
    });
  }

  saveToStorage(cart);
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage(cart);
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  if (newQuantity < 0 || newQuantity >= 1000) {
    alert("Quantity must be at least 0 and less than 1000");
    return;
  }

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
  }

  saveToStorage(cart);
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (!matchingItem) return;

  const deliveryOption = getDeliveryOption(deliveryOptionId);

  if (!deliveryOption) return;

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage(cart);
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
}

export async function loadCartFetch() {
  const response = await fetch("https://supersimplebackend.dev/cart");
  const products = await response.text();
  console.log(products);
}
