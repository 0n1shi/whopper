import type { Signature } from "../_types.js";

export const chartJsSignature: Signature = {
  name: "Chart.js",
  description:
    "Chart.js is an open-source JavaScript library that allows you to draw different types of charts by using the HTML5 canvas element.",
  rule: {
    confidence: "high",
    urls: [
      "/Chart(?:\\.bundle)?(?:\\.min)?\\.js",
      "chartjs\\.org/dist/([\\d.]+(?:-[^/]+)?|master|latest)/Chart.*\\.js",
      "cdnjs\\.cloudflare\\.com/ajax/libs/Chart\\.js/([\\d.]+(?:-[^/]+)?)/Chart.*\\.js",
      "cdn\\.jsdelivr\\.net/(?:npm|gh/chartjs)/chart\\.js@([\\d.]+(?:-[^/]+)?|latest)/dist/Chart.*\\.js",
    ],
    javascriptVariables: {
      Chart: "",
      "Chart.defaults.doughnut": "",
      "chart.ctx.bezierCurveTo": "",
    },
  },
};
