import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const adobeExperienceManagerSignature: Signature = {
  name: "Adobe Experience Manager",
  description: "Adobe Experience Manager (AEM) is a content management solution for building websites, mobile apps and forms.",
  cpe: "cpe:/a:adobe:experience_manager",
  rule: {
    confidence: "high",
    bodies: [
      "<div class=\"[^\"]*parbase",
      "<div[^>]+data-component-path=\"[^\"+]jcr:",
      "<div class=\"[^\"]*aem-Grid",
    ],
    urls: [
      "/etc/designs/",
      "/etc/clientlibs/",
      "/etc\\.clientlibs/",
      "aem-(?:GridColumn|apps/)",
    ],
  },
  impliedSoftwares: [javaSignature.name],
};
