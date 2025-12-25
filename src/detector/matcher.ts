import type { Context } from "../browser/index.js";
import type { Signature } from "../signatures/_types.js";
import type { Evidence } from "./types.js";

const matchString = (
  value: string,
  rule: { contains?: string; regex?: string },
): boolean => {
  if (rule.contains && value.includes(rule.contains)) {
    return true;
  }
  if (rule.regex && new RegExp(rule.regex).test(value)) {
    return true;
  }
  return false;
};

export const applySignature = (
  context: Context,
  signature: Signature,
): [boolean, Evidence[]] => {
  for (const rule of signature.rules) {
    let ruleMatched = false;
    const evidences: Evidence[] = [];

    // Match headers
    if (rule.headers) {
      for (const [header, match] of Object.entries(rule.headers)) {
        const response = context.responses.find(
          (res) => res.headers[header.toLowerCase()],
        );
        if (response) {
          const headerValue = response.headers[header.toLowerCase()];
          if (headerValue && matchString(headerValue, match)) {
            ruleMatched = true;
            evidences.push({
              type: "header",
              value: `${header}: ${headerValue}`,
            });
          }
        }
      }
    }

    // Match bodies
    if (rule.bodies) {
      for (const match of rule.bodies) {
        for (const response of context.responses) {
          const body = response.headers["content-type"]?.includes("text")
            ? response.body
            : "";
          if (body && matchString(body, match)) {
            ruleMatched = true;
            evidences.push({ type: "body", value: body });
          }
        }
      }
    }

    if (ruleMatched) {
      return [true, evidences];
    }
  }
  return [false, []];
};
