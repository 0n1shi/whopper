import type { Signature } from "../_types.js";

export const shopifySignature: Signature = {
  name: "Shopify",
  description:
    "Shopify is a subscription-based software that allows anyone to set up an online store and sell their products. Shopify store owners can also sell in physical locations using Shopify POS, a point-of-sale app and accompanying hardware.",
  rule: {
    confidence: "high",
    headers: {
      "x-shopid": ".+",
      "x-shopify-stage": ".+",
    },
    cookies: {
      _shopify_s: ".+",
      _shopify_y: ".+",
    },
    urls: [
      "sdks\\.shopifycdn\\.com",
      "cdn\\.shopify\\.com",
      "^https?//.+\\.myshopify\\.com",
    ],
    bodies: [
      "shopify-checkout-api-token",
      "shopify-digital-wallet",
      "href=[\"'][^\"']*(?:cdn\\.|\\.my)shopify\\.com",
    ],
    javascriptVariables: {
      SHOPIFY_API_BASE_URL: "",
      Shopify: ".+",
      ShopifyAPI: "",
      ShopifyCustomer: "",
    },
  },
};
