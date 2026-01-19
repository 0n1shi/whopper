import type { Signature } from "../_types.js";

export const algoliaSignature: Signature = {
  name: "Algolia",
  description: "Algolia offers a hosted web search product delivering real-time results.",
  rule: {
    confidence: "high",
    headers: {
      "Content-Security-Policy": "\\.algolia",
    },
    cookies: {
      "_ALGOLIA": "",
    },
    javascriptVariables: {
      "ALGOLIA_INSIGHTS_SRC": "",
      "AlgoliaSearch": "",
      "__GLOBAL__.algolia": "",
      "__NEXT_DATA__.props.pageProps.appSettings.ALGOLIA_APP_ID": "",
      "__algolia": "",
      "algoliasearch.version": "^(.+)$",
    },
  },
};
