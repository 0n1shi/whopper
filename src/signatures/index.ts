import type { Signature } from "./_types.js";

import { nginxSignature } from "./technologies/nginx.js";
import { nextjsSignature } from "./technologies/nextjs.js";
import { awsElbSignature } from "./technologies/awselb.js";
import { apacheHttpServerSignature } from "./technologies/apache.js";
import { phpSignature } from "./technologies/php.js";
import { jquerySignature } from "./technologies/jquery.js";
import { wordpressSignature } from "./technologies/wordpress.js";
import { mysqlSignature } from "./technologies/mysql.js";
import { corejsSignature } from "./technologies/corejs.js";
import { jqueryCookieSignature } from "./technologies/jquery_cookie.js";
import { slickSignature } from "./technologies/slick.js";
import { yawsHttpServerSignature } from "./technologies/yaws.js";
import { bootstrapSignature } from "./technologies/bootstrap.js";
import { jqueryMigrateSignature } from "./technologies/jquery_migrate.js";

export const signatures: Signature[] = [
  apacheHttpServerSignature,
  awsElbSignature,
  bootstrapSignature,
  corejsSignature,
  jquerySignature,
  jqueryCookieSignature,
  jqueryMigrateSignature,
  phpSignature,
  mysqlSignature,
  nginxSignature,
  nextjsSignature,
  slickSignature,
  yawsHttpServerSignature,
  wordpressSignature,
];
