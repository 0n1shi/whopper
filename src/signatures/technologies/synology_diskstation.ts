import type { Signature } from "../_types.js";

export const synologyDiskstationSignature: Signature = {
  name: "Synology DiskStation",
  description: "DiskStation provides a full-featured network attached storage.",
  rule: {
    confidence: "high",
    bodies: [
      "<noscript><div class='syno-no-script'",
      "<meta[^>]+name=[\"']application-name[\"'][^>]+content=[\"']Synology DiskStation",
      "<meta[^>]+name=[\"']description[\"'][^>]+content=[\"']^DiskStation provides a full-featured network attached storage",
    ],
    urls: [
      "webapi/entry\\.cgi\\?api=SYNO\\.(?:Core|Filestation)\\.Desktop\\.",
    ],
  },
};
