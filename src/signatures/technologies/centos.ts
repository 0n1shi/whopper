import type { Signature } from "../_types.js";

export const centOsSignature: Signature = {
  name: "CentOS",
  description:
    "CentOS is a Linux distribution that provides a free, community-supported computing platform functionally compatible with its upstream source, Red Hat Enterprise Linux (RHEL).",
  cpe: "cpe:/o:centos:centos",
  rule: {
    confidence: "high",
    headers: {
      server: "CentOS",
      "x-powered-by": "CentOS",
    },
  },
};
