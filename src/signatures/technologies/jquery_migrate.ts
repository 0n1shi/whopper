import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jqueryMigrateSignature: Signature = {
  name: "jQuery Migrate",
  description:
    "Query Migrate is a javascript library that allows you to preserve the compatibility of your jQuery code developed for versions of jQuery older than 1.9.",
  rule: {
    confidence: "high",
    urls: [
      "jquery[.-]?migrate[./-]?(\\d+\\.\\d+\\.\\d+)?",
      "jquery[.-]?migrate.*?ver=(\\d+\\.\\d+\\.\\d+)?",
    ],
    javascriptVariables: {
      "jQuery.migrateVersion": "(\\d+\\.\\d+\\.\\d+)?",
      "jQuery.migrateWarnings": "",
      jqueryMigrate: "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
