import type { Signature } from "../_types.js";

export const microsoftIisSignature: Signature = {
  name: "Microsoft IIS",
  description:
    "Internet Information Services (IIS) is an extensible web server software created by Microsoft for use with the Windows NT family.",
  cpe: "cpe:/a:microsoft:internet_information_server",
  rule: {
    confidence: "high",
    headers: {
      server: "(?:microsoft-)?iis/?(\\d+\\.\\d+)?",
    },
  },
};
