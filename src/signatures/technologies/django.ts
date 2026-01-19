import type { Signature } from "../_types.js";
import { pythonSignature } from "./python.js";

export const djangoSignature: Signature = {
  name: "Django",
  description: "Django is a Python-based free and open-source web application framework.",
  cpe: "cpe:/a:djangoproject:django",
  rule: {
    confidence: "high",
    cookies: {
      "django_language": "",
    },
    bodies: [
      "(?:powered by <a[^>]+>Django ?([\\d.]+)?<\\/a>|<input[^>]*name=[\"']csrfmiddlewaretoken[\"'][^>]*>)",
    ],
    javascriptVariables: {
      "__admin_media_prefix__": "",
      "django": "",
    },
  },
  impliedSoftwares: [pythonSignature.name],
};
