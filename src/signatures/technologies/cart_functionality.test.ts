import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { cartFunctionalitySignature } from "./cart_functionality.js";

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

describe("cartFunctionalitySignature", () => {
  describe("body matching", () => {
    it("detects an anchor linking to /cart", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<a href="/cart">View cart</a>',
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeDefined();
    });

    it("detects an anchor linking to /checkout", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<a class="btn" href="/checkout/">Checkout</a>',
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeDefined();
    });

    it("detects an anchor linking to /bag/", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<a href="/bag/">Bag</a>',
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeDefined();
    });

    it("detects shopping-cart class markup", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="shopping-cart-icon"></div>',
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeDefined();
    });

    it('detects aria-controls="cart" markup', () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<button aria-controls="cart">Open cart</button>',
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeDefined();
    });

    it("does not match an <area> image-map element pointing at /bag/", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<area shape="rect" coords="0,0,10,10" href="/bag/">',
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeUndefined();
    });

    it('does not match an <article> tag whose attribute value contains href="/bag/" as a substring', () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "<article data-link='href=\"/bag/\"'>example</article>",
          }),
        ],
      });

      const result = applySignature(context, cartFunctionalitySignature);
      expect(result).toBeUndefined();
    });
  });
});
