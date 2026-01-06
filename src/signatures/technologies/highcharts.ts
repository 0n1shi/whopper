import type { Signature } from "../_types.js";

export const highchartsSignature: Signature = {
  name: "Highcharts",
  description:
    "Highcharts is a charting library written in pure JavaScript, for adding interactive charts to a website or web application. Highcharts meets accessibility standards and works with Python, Angular, React, iOS, Android, and more.",
  rule: {
    confidence: "high",
    bodies: ["Created with Highcharts ([\\d.]*)"],
    javascriptVariables: {
      Highcharts: "",
      "Highcharts.version": "^(.+)$",
    },
  },
};
