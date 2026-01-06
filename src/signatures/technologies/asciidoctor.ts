import type { Signature } from "../_types.js";

export const asciidoctorSignature: Signature = {
  name: "Asciidoctor",
  description:
    "Asciidoctor is an open-source text processor and publishing toolchain, written in Ruby, for converting AsciiDoc content to HTML 5, DocBook 5, and other formats.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Asciidoctor\\s([\\d\\.]+)",
    ],
  },
};
