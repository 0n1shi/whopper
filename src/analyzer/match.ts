import type { Regex } from "../signatures/_types.js";

export type MatchResult = {
  hit: boolean;
  version: string | undefined;
  index: number | undefined;
  matchLength: number | undefined;
};

export const matchString = (value: string, regex: Regex): MatchResult => {
  const regexExp = new RegExp(regex, "i");
  const match = value.match(regexExp);
  if (match) {
    return {
      hit: true,
      version: match.length > 1 ? match[1] : undefined,
      index: match.index,
      matchLength: match[0].length,
    };
  }

  return { hit: false, version: undefined, index: undefined, matchLength: undefined };
};

export const truncateBodyForEvidence = (body: string): string =>
  body.length > 100 ? `${body.substring(0, 100)}...` : body;

export const extractMatchSnippet = (
  value: string,
  index: number,
  matchLength: number,
  context = 40,
  maxMatchLength = 120,
  maxValueLength = 200,
): string => {
  if (value.length <= maxValueLength) return value;

  const start = Math.max(0, index - context);
  const end = Math.min(value.length, index + matchLength + context);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < value.length ? "..." : "";

  // Compress the match itself when it is excessively long (e.g. greedy
  // [^"']* against a large JSON blob), keeping head/tail so the evidence
  // stays informative without bloating output.
  if (matchLength > maxMatchLength) {
    const half = Math.floor(maxMatchLength / 2);
    const leading = value.substring(start, index + half);
    const trailing = value.substring(index + matchLength - half, end);
    return `${prefix}${leading}...${trailing}${suffix}`;
  }

  return `${prefix}${value.substring(start, end)}${suffix}`;
};

export const buildEvidenceValue = (
  rawValue: string,
  result: Pick<MatchResult, "index" | "matchLength">,
  prefix?: string,
): string => {
  const body =
    result.index !== undefined && result.matchLength !== undefined
      ? extractMatchSnippet(rawValue, result.index, result.matchLength)
      : rawValue;
  return prefix ? `${prefix}: ${body}` : body;
};
