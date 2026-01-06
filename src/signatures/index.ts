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
import { jqueryUiSignature } from "./technologies/jquery_ui.js";
import { jqueryMigrateSignature } from "./technologies/jquery_migrate.js";
import { swiperSignature } from "./technologies/spiwer.js";
import { microsoftAspSignature } from "./technologies/microsoft_asp.js";
import { microsoftIisSignature } from "./technologies/microsoft_iis.js";
import { gsapSignature } from "./technologies/gsap.js";
import { contactForm7Signature } from "./technologies/contact_form_7.js";
import { reactSignature } from "./technologies/react.js";
import { lodashSignature } from "./technologies/lodash.js";
import { modernizrSignature } from "./technologies/modernizr.js";
import { vueJsSignature } from "./technologies/vue_js.js";
import { openSslSignature } from "./technologies/openssl.js";
import { yoastSeoSignature } from "./technologies/yoast_seo.js";
import { microsoftHttpApiSignature } from "./technologies/microsoft_httpapi.js";
import { animateCssSignature } from "./technologies/animate_css.js";
import { fancyBoxSignature } from "./technologies/fancybox.js";
import { siteKitSignature } from "./technologies/site_kit.js";

export const signatures: Signature[] = [
  apacheHttpServerSignature,
  awsElbSignature,
  animateCssSignature,
  bootstrapSignature,
  contactForm7Signature,
  corejsSignature,
  gsapSignature,
  jquerySignature,
  jqueryCookieSignature,
  jqueryMigrateSignature,
  jqueryUiSignature,
  lodashSignature,
  fancyBoxSignature,
  microsoftHttpApiSignature,
  microsoftAspSignature,
  microsoftIisSignature,
  modernizrSignature,
  mysqlSignature,
  nginxSignature,
  nextjsSignature,
  openSslSignature,
  phpSignature,
  reactSignature,
  siteKitSignature,
  slickSignature,
  swiperSignature,
  vueJsSignature,
  wordpressSignature,
  yoastSeoSignature,
  yawsHttpServerSignature,
];
