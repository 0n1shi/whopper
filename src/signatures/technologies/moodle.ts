import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const moodleSignature: Signature = {
  name: "Moodle",
  description: "Moodle is a free and open-source Learning Management System (LMS) written in PHP and distributed under the GNU General Public License.",
  cpe: "cpe:/a:moodle:moodle",
  rule: {
    confidence: "high",
    cookies: {
      "MOODLEID_": "",
      "MoodleSession": "",
    },
    bodies: [
      "<img[^>]+moodlelogo",
      "<meta[^>]+name=[\"']keywords[\"'][^>]+content=[\"']^moodle",
    ],
    javascriptVariables: {
      "M.core": "",
      "Y.Moodle": "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
