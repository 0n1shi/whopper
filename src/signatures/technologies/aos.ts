import type { Signature } from "../_types.js";

export const aosSignature: Signature = {
  name: "AOS",
  description: "JavaScript library to animate elements on your page as you scroll.",
  rule: {
    confidence: "high",
    urls: [
      "unpkg\\.com/aos@([\\d\\.]+)/dist/aos\\.js",
      "/typo3conf/ext/udem_vendor/Resources/Public/aos-([\\d\\.]+)",
    ],
    javascriptVariables: {
      "AOS.init": "",
      "AOS.refresh": "",
      "AOS.refreshHard": "",
    },
  },
};
