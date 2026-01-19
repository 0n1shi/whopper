import type { Signature } from "../_types.js";
import { scalaSignature } from "./scala.js";

export const playSignature: Signature = {
  name: "Play",
  cpe: "cpe:/a:playframework:play_framework",
  rule: {
    confidence: "high",
    cookies: {
      "PLAY_SESSION": "",
    },
  },
  impliedSoftwares: [scalaSignature.name],
};
