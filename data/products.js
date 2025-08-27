import { fetchAvailableProducts } from "../scripts/http.js";
import formatCurrency from "../scripts/utils/money.js";
import { showToast } from "../scripts/utils/toast.js";

export class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails._id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return "";
  }
}

export class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    // super.extraInfoHTML();
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.instructionsLink}" target="_blank">
        Instructions
      </a>
      <a href="${this.warrantyLink}" target="_blank">
        Warranty
      </a>
    `;
  }
}

export async function loadProducts() {
  try {
    const response = await fetchAvailableProducts();
    if (!Array.isArray(response)) {
      showToast(response.message || "No products found.", "error");
      return;
    }
    const products = response.map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      }
      if (productDetails.type === "appliance") {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });

    localStorage.setItem("products", JSON.stringify(products));

    return products;
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
    showToast(error.message + ". Please try again later.", "error");
  }
}

const products = await loadProducts();

export function getProduct(productId) {
  const matchingProduct = products.find((product) => product.id === productId);

  return matchingProduct;
}