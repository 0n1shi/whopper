import type { Context } from "../browser/types.js";
import type { Signature } from "../signatures/_types.js";
import type { Detection, Evidence } from "./types.js";
import { matchString } from "./match.js";

export const applySignature = (
  context: Context,
  signature: Signature,
): Detection | undefined => {
  const evidences: Evidence[] = [];
  const rule = signature.rule;

  // Match urls
  if (rule?.urls) {
    for (const regex of rule.urls) {
      for (const response of context.responses) {
        const url = response.url;
        const result = matchString(url, regex);
        if (!result.hit) {
          continue;
        }

        evidences.push({
          type: "url",
          value: url,
          version: result.version,
          confidence: rule.confidence,
        });
      }
    }
  }

  // Match headers
  if (rule?.headers) {
    for (const [header, regex] of Object.entries(rule.headers)) {
      const response = context.responses.find(
        (res) => res.headers[header.toLowerCase()],
      );
      if (!response) {
        continue;
      }

      const headerValue = response.headers[header.toLowerCase()];
      if (!headerValue) {
        continue;
      }

      const result = matchString(headerValue, regex);
      if (!result.hit) {
        continue;
      }

      evidences.push({
        type: "header",
        value: `${header}: ${headerValue}`,
        version: result.version,
        confidence: rule.confidence,
      });
    }
  }

  // Match bodies
  if (rule?.bodies) {
    for (const regex of rule.bodies) {
      for (const response of context.responses) {
        const body = response.headers["content-type"]?.includes("text")
          ? response.body
          : "";
        if (!body) {
          continue;
        }
        const result = matchString(body, regex);
        if (!result.hit) {
          continue;
        }

        evidences.push({
          type: "body",
          value: `${body.substring(0, 100)}...`,
          version: result.version,
          confidence: rule.confidence,
        });
      }
    }
  }

  // Match cookies
  if (rule?.cookies) {
    for (const [name, regex] of Object.entries(rule.cookies)) {
      const cookie = context.cookies.find((c) => new RegExp(name).test(c.name));
      if (!cookie) {
        continue;
      }

      const result = matchString(cookie.value, regex);
      if (!result.hit) {
        continue;
      }

      evidences.push({
        type: "cookie",
        value: `${cookie.name}: ${cookie.value}`,
        version: result.version,
        confidence: rule.confidence,
      });
    }
  }

  if (rule?.javascriptVariables) {
    for (const [name, regex] of Object.entries(rule.javascriptVariables)) {
      const jsVars = context.javascriptVariables;
      const val = jsVars[name];
      if (val === undefined) {
        continue;
      }

      const valStr = typeof val === "string" ? val : JSON.stringify(val);
      const result = matchString(valStr, regex);
      if (!result.hit) {
        continue;
      }

      evidences.push({
        type: "script",
        value: `${name}: ${valStr}`,
        version: result.version,
        confidence: rule.confidence,
      });
    }
  }

  if (evidences.length > 0) {
    return {
      name: signature.name,
      evidences,
    };
  }

  return undefined;
};
