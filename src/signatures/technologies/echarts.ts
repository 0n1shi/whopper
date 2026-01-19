import type { Signature } from "../_types.js";

export const echartsSignature: Signature = {
  name: "ECharts",
  description: "ECharts is an open-source JavaScript visualisation library.",
  rule: {
    confidence: "high",
    bodies: [
      "_echarts_instance_",
    ],
    urls: [
      "/echarts\\.min\\.[a-zA-Z0-9]*\\.js",
      "/echarts(?:\\.simple)?(?:\\.esm)?(?:\\.common)?(?:\\.min)?\\.js",
      "cdn\\.jsdelivr\\.net/(?:npm|gh/apache)/echarts@([\\d.]+(?:-[^/]+)?|latest)/dist/echarts.*\\.js",
    ],
  },
};
