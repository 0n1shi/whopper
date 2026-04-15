import type { Regex } from "../signatures/_types.js";

type MatchResult = {
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
): string => {
  const start = Math.max(0, index - context);
  const end = Math.min(value.length, index + matchLength + context);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < value.length ? "..." : "";
  return `${prefix}${value.substring(start, end)}${suffix}`;
};
