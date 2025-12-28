import type { Signature } from "./_types.js";
import { nginxSignature } from "./technologies/nginx.js";
import { nextjsSignature } from "./technologies/nextjs.js";
import { awsElbSignature } from "./technologies/awselb.js";

export const signatures: Signature[] = [
  awsElbSignature,
  nginxSignature,
  nextjsSignature,
];
