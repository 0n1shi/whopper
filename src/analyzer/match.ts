import type { Regex } from "../signatures/_types.js";

type MatchResult = {
  hit: boolean;
  version: string | undefined;
};

export const matchString = (value: string, regex: Regex): MatchResult => {
  const regexExp = new RegExp(regex, "i");
  const match = value.match(regexExp);
  if (match) {
    return { hit: true, version: match.length > 1 ? match[1] : undefined };
  }

  return { hit: false, version: undefined };
};
