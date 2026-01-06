import type { Signature } from "../_types.js";
import { nginxSignature } from "./nginx.js";

export const openRestySignature: Signature = {
  name: "OpenResty",
  description:
    "OpenResty is a web platform based on nginx which can run Lua scripts using its LuaJIT engine.",
  rule: {
    confidence: "high",
    headers: {
      Server: "openresty(?:/([\\d.]+))?",
    },
  },
  impliedSoftwares: [nginxSignature.name],
};
