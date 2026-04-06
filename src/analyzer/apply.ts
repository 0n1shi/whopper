import type { Context, Response } from "../browser/types.js";
import type { Runtime, Signature } from "../signatures/_types.js";
import type { Detection, Evidence } from "./types.js";
import { matchString } from "./match.js";

function isFirstPartyResponse(response: Response): boolean {
  return response.isFirstParty ?? true;
}

function isFirstPartyCookie(cookie: Context["cookies"][number]): boolean {
  return cookie.isFirstParty ?? true;
}

function isTextLikeContentType(contentType: string | undefined): boolean {
  if (!contentType) {
    return false;
  }
  const lowerContentType = contentType.toLowerCase();
  return (
    lowerContentType.includes("text/") ||
    lowerContentType.includes("javascript") ||
    lowerContentType.includes("ecmascript") ||
    lowerContentType.includes("json") ||
    lowerContentType.includes("xml")
  );
}

function isAllowedThirdPartyBodyContentType(contentType: string): boolean {
  const lowerContentType = contentType.toLowerCase();
  return (
    lowerContentType.includes("text/css") ||
    lowerContentType.includes("javascript") ||
    lowerContentType.includes("ecmascript")
  );
}

function inferRuntime(signature: Signature): Runtime {
  const hasHeaders = Object.keys(signature.rule?.headers ?? {}).length > 0;
  const hasCookies = Object.keys(signature.rule?.cookies ?? {}).length > 0;
  return hasHeaders || hasCookies ? "server" : "client";
}

function resolveRuntime(signature: Signature): Runtime {
  return signature.runtime ?? inferRuntime(signature);
}

function isBodyMatchAllowed(response: Response, runtime: Runtime): boolean {
  const contentType = response.headers["content-type"];
  if (!isTextLikeContentType(contentType)) {
    return false;
  }

  if (isFirstPartyResponse(response)) {
    return true;
  }

  if (runtime !== "client") {
    return false;
  }

  return contentType ? isAllowedThirdPartyBodyContentType(contentType) : false;
}

export const applySignature = (
  context: Context,
  signature: Signature,
): Detection | undefined => {
  let evidences: Evidence[] = [];
  const rule = signature.rule;
  const runtime = resolveRuntime(signature);
  const allResponses = context.responses;
  const firstPartyResponses = context.responses.filter(isFirstPartyResponse);
  const firstPartyCookies = context.cookies.filter(isFirstPartyCookie);

  // Match urls
  if (rule?.urls) {
    for (const regex of rule.urls) {
      for (const response of allResponses) {
        if (!isFirstPartyResponse(response) && runtime !== "client") {
          continue;
        }
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
          host: response.host,
          sourceUrl: response.url,
        });
      }
    }
  }

  // Match headers
  if (rule?.headers) {
    for (const [header, regex] of Object.entries(rule.headers)) {
      const headerKey = header.toLowerCase();
      const response = firstPartyResponses.find((res) => res.headers[headerKey]);
      if (!response) {
        continue;
      }

      const headerValue = response.headers[headerKey]!;
      const result = matchString(headerValue, regex);
      if (!result.hit) {
        continue;
      }

      evidences.push({
        type: "header",
        value: `${header}: ${headerValue}`,
        version: result.version,
        confidence: rule.confidence,
        host: response.host,
        sourceUrl: response.url,
      });
    }
  }

  // Match bodies
  if (rule?.bodies) {
    for (const regex of rule.bodies) {
      for (const response of allResponses) {
        if (!isBodyMatchAllowed(response, runtime)) {
          continue;
        }

        const body = response.body ?? "";
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
          host: response.host,
          sourceUrl: response.url,
        });
      }
    }
  }

  // Match cookies
  if (rule?.cookies) {
    for (const [name, regex] of Object.entries(rule.cookies)) {
      const cookieNameRegex = new RegExp(`^(?:${name})$`, "i");
      const cookie = firstPartyCookies.find((c) => cookieNameRegex.test(c.name));
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
        host: cookie.host,
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

  // Discard script evidences when required JavaScript variables are missing,
  // unless other evidence types (URL, header, etc.) already confirm the technology.
  if (rule?.requiredJavascriptVariables) {
    const jsVars = context.javascriptVariables;
    const allPresent = rule.requiredJavascriptVariables.every(
      (name) => jsVars[name] !== undefined,
    );
    const hasNonScriptEvidence = evidences.some((e) => e.type !== "script");
    if (!allPresent && !hasNonScriptEvidence) {
      evidences = evidences.filter((e) => e.type !== "script");
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
