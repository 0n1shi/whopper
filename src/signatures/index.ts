import type { Signature } from "./_types.js";
import { nginxSignature } from "./nginx.js";
import { nextjsSignature } from "./nextjs.js";
import { awsElbSignature } from "./awselb.js";

export const signatures: Signature[] = [
  awsElbSignature,
  nginxSignature,
  nextjsSignature,
];
