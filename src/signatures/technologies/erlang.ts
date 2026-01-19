import type { Signature } from "../_types.js";

export const erlangSignature: Signature = {
  name: "Erlang",
  description: "Erlang is a general-purpose, concurrent, functional programming language, and a garbage-collected runtime system.",
  cpe: "cpe:2.3:a:erlang:erlang%2fotp:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      "Server": "Erlang(?: OTP/(?:[\\d.ABR-]+))?",
    },
  },
};
