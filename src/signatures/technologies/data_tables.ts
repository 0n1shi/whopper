import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const dataTablesSignature: Signature = {
  name: "DataTables",
  description:
    "DataTables is a plug-in for the jQuery Javascript library adding advanced features like pagination, instant search, themes, and more to any HTML table.",
  cpe: "cpe:/a:datatables:datatables.net",
  rule: {
    confidence: "high",
    urls: ["dataTables.*\\.js"],
    javascriptVariables: {
      "$.fn.dataTable.version": "^(.+)$",
      "jQuery.fn.dataTable.version": "^(.+)$",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
