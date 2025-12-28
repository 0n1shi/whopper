import type { Signature } from "./_types.js";

import { nginxSignature } from "./technologies/nginx.js";
import { nextjsSignature } from "./technologies/nextjs.js";
import { awsElbSignature } from "./technologies/awselb.js";
import { apacheHttpServerSignature } from "./technologies/apache.js";
import { phpSignature } from "./technologies/php.js";
import { jquerySignature } from "./technologies/jquery.js";

export const signatures: Signature[] = [
  apacheHttpServerSignature,
  awsElbSignature,
  jquerySignature,
  phpSignature,
  nginxSignature,
  nextjsSignature,
];
