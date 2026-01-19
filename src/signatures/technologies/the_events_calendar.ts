import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const theEventsCalendarSignature: Signature = {
  name: "The Events Calendar",
  description: "The Events Calendar is a free event management plugin for WordPress.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/the\\-events\\-calendar\\/",
    ],
    urls: [
      "/wp-content/plugins/the-events-calendar(?:-pro)?/",
    ],
    javascriptVariables: {
      "TribeCalendar": "",
      "tribe_l10n_datatables": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
