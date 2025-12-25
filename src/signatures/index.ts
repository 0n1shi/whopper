import type { Signature } from "./_types.js";
import { nginxSignature } from "./nginx.js";

export const signatures: Signature[] = [nginxSignature];
