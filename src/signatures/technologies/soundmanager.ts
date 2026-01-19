import type { Signature } from "../_types.js";

export const soundmanagerSignature: Signature = {
  name: "SoundManager",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "BaconPlayer": "",
      "SoundManager": "",
      "soundManager.version": "V(.+) ",
    },
  },
};
