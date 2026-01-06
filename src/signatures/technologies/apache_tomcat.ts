import type { Signature } from "../_types.js";

export const apacheTomcatSignature: Signature = {
  name: "Apache Tomcat",
  description:
    "Apache Tomcat is an open-source implementation of the Java Servlet, JavaServer Pages, Java Expression Language and WebSocket technologies.",
  cpe: "cpe:2.3:a:apache:tomcat:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      Server: "(?:Apache-Coyote|\\bTomcat\\b[^/]*(?:/([\\d.]+))?)",
      "Servlet-Engine": "\\bTomcat\\b[^/]*(?:/([\\d.]+))?",
      "X-Powered-By": "\\bTomcat\\b[^/-]*(?:[/-]([\\d.]+))?",
      "WWW-Authenticate": "Tomcat",
    },
    bodies: ["<title>Apache Tomcat/([\\d.]+)</title>"],
  },
};
