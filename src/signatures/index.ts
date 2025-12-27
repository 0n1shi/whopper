import type { Signature } from "./_types.js";
import { nginxSignature } from "./nginx.js";
import { nextjsSignature } from "./nextjs.js";

export const signatures: Signature[] = [nginxSignature, nextjsSignature];
