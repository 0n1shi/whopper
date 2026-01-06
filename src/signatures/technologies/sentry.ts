import type { Signature } from "../_types.js";

export const sentrySignature: Signature = {
  name: "Sentry",
  description:
    "Sentry is an open-source platform for workflow productivity, aggregating errors from across the stack in real time.",
  rule: {
    confidence: "high",
    urls: [
      "browser\\.sentry\\-cdn\\.com/([0-9.]+)/bundle(?:\\.tracing)?(?:\\.min)?\\.js",
    ],
    bodies: [
      "<script[^>]*>\\s*Raven\\.config\\('[^']*', \\{\\s+release: '([0-9\\.]+)'",
    ],
    javascriptVariables: {
      "Raven.config": "",
      Sentry: "",
      "Sentry.SDK_VERSION": "(.+)",
      __SENTRY__: "",
      "ravenOptions.whitelistUrls": "",
    },
  },
};
