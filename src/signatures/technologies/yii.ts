import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const yiiSignature: Signature = {
  name: "Yii",
  description: "Yii is an open-source, object-oriented, component-based MVC PHP web application framework.",
  rule: {
    confidence: "high",
    cookies: {
      "YII_CSRF_TOKEN": "",
    },
    bodies: [
      "Powered by <a href=\"http://www\\.yiiframework\\.com/\" rel=\"external\">Yii Framework</a>",
      "<input type=\"hidden\" value=\"[a-zA-Z0-9]{40}\" name=\"YII_CSRF_TOKEN\" \\/>",
      "<!\\[CDATA\\[YII-BLOCK-(?:HEAD|BODY-BEGIN|BODY-END)\\]",
    ],
    urls: [
      "/assets/[a-zA-Z0-9]{8}\\/yii\\.js$",
      "/yii\\.(?:validation|activeForm)\\.js",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
