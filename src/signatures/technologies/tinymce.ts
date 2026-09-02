import type { Signature } from "../_types.js";

export const tinyMceSignature: Signature = {
  name: "TinyMCE",
  description:
    "TinyMCE is an online rich-text editor released as open-source software. TinyMCE is designed to integrate with JavaScript libraries, Vue.js, and AngularJS as well as content management systems such as Joomla!, and WordPress.",
  cpe: "cpe:/a:tiny:tinymce",
  rule: {
    confidence: "high",
    urls: ["/tiny_?mce(?:\\.min)?\\.js"],
    // The bundle banner is the only place that carries the whole version as a
    // single string, and its shape changed twice: TinyMCE 6 and later print
    // "TinyMCE version X.Y.Z (<date>)", TinyMCE 5 prints "Version: X.Y.Z
    // (<date>)" right below the tiny.cloud line of its copyright header, and
    // TinyMCE 4 prints "// X.Y.Z (<date>)" as the very first line of the
    // bundle. Bodies are matched against every text-like response including
    // HTML, so every pattern requires the release date that always follows the
    // version and is anchored at the start of the response, where the banner
    // sits in a real bundle. A page that merely names a version, or that quotes
    // the banner in a bullet list or a code block, therefore cannot pass as
    // evidence. Requiring bundle code after the banner instead would not work:
    // TinyMCE 7 and 8 put a second comment block between the two.
    bodies: [
      "^\\s{0,10}/\\*\\*[\\s\\S]{0,20}?TinyMCE version (\\d+\\.\\d+\\.\\d+)\\s*\\((?:TBD|\\d{4}-\\d{2}-\\d{2})\\)",
      "^\\s{0,10}/\\*\\*[\\s\\S]{0,400}?tiny\\.cloud/[\\s\\S]{0,20}?Version:\\s*(\\d+\\.\\d+\\.\\d+)\\s*\\((?:TBD|\\d{4}-\\d{2}-\\d{2})\\)",
      "^// (\\d+\\.\\d+\\.\\d+) \\(\\d{4}-\\d{2}-\\d{2}\\)\\s*!function",
    ],
    javascriptVariables: {
      // Presence check only. tinyMCE.majorVersion holds the major number on its
      // own ("8") and tinyMCE.minorVersion holds the remainder ("1.2"), so no
      // single variable carries the full version. Capturing the major number
      // here would report a second, less precise version next to the one taken
      // from the banner, because detections are split per distinct version.
      "tinyMCE.majorVersion": "",
      tinymce: "",
    },
  },
};
