import type { Signature } from "../_types.js";

export const windowsServerSignature: Signature = {
  name: "Windows Server",
  description:
    "Windows Server is a brand name for a group of server operating systems.",
  rule: {
    confidence: "high",
    headers: {
      server: "Win32|Win64",
    },
  },
};
