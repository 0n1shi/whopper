import type { Signature } from "../_types.js";

export const phusionPassengerSignature: Signature = {
  name: "Phusion Passenger",
  description:
    "Phusion Passenger is a free web server and application server with support for Ruby, Python and Node.js.",
  rule: {
    confidence: "high",
    headers: {
      Server: "Phusion Passenger ([\\d.]+)",
      "X-Powered-By": "Phusion Passenger(?:\\(R\\))? ?([\\d.]+)?",
    },
  },
};
