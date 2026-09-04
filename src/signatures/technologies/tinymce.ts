import type { Signature } from "../_types.js";

export const tinyMceSignature: Signature = {
  name: "TinyMCE",
  description:
    "TinyMCE is an online rich-text editor released as open-source software. TinyMCE is designed to integrate with JavaScript libraries, Vue.js, and AngularJS as well as content management systems such as Joomla!, and WordPress.",
  cpe: "cpe:/a:tiny:tinymce",
  rule: {
    confidence: "high",
    urls: ["/tiny_?mce(?:\\.min)?\\.js"],
    bodies: [
      {
        // TinyMCE never carries the whole version in one place: majorVersion
        // holds "8" on its own and minorVersion the remainder ("8.2"). The two
        // sit next to each other ahead of the release date in every major from
        // 4 onwards, and they survive being bundled into an application bundle,
        // where the version banner is dropped and the file no longer matches
        // the script URL above. Reading the banner instead would miss exactly
        // those builds.
        regex:
          'majorVersion:"(\\d+)",\\s*minorVersion:"(\\d+(?:\\.\\d+)*)",\\s*releaseDate:"',
        version: "$1.$2",
      },
    ],
    javascriptVariables: {
      // Presence check only: this global holds the major number alone, so
      // capturing it would report a second, less precise version next to the
      // one built above, detections being split per distinct version.
      "tinyMCE.majorVersion": "",
      tinymce: "",
    },
  },
};
