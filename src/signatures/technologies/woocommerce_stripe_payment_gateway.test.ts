import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { woocommerceStripePaymentGatewaySignature } from "./woocommerce_stripe_payment_gateway.js";

function createMockContext(
  overrides: Partial<Pick<Context, "responses">> = {},
): Context {
  return {
    browser: {} as Context["browser"],
    page: {} as Context["page"],
    urls: [],
    responses: [],
    cookies: [],
    javascriptVariables: {},
    timeoutMs: 30000,
    timeoutOccurred: false,
    ...overrides,
  };
}

function createMockResponse(overrides: Partial<Response> = {}): Response {
  return {
    url: "https://example.com",
    host: "example.com",
    isFirstParty: true,
    status: 200,
    headers: { "content-type": "text/html" },
    body: "",
    ...overrides,
  };
}

describe("woocommerceStripePaymentGatewaySignature", () => {
  describe("body matching", () => {
    it("detects WooCommerce Stripe Payment Gateway from a <link> stylesheet under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/plugins/woocommerce-gateway-stripe/assets/css/stripe-styles.css">',
          }),
        ],
      });

      const result = applySignature(
        context,
        woocommerceStripePaymentGatewaySignature,
      );
      expect(result).toBeDefined();
    });
  });
});
