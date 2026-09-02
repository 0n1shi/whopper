import type { Pattern, Regex } from "../signatures/_types.js";

export type MatchResult = {
  hit: boolean;
  version: string | undefined;
  index: number | undefined;
  matchLength: number | undefined;
};

/**
 * Splits a pattern into the regex to run and the version template to apply to
 * its capture groups, if the pattern carries one.
 */
const splitPattern = (
  pattern: Pattern,
): { regex: Regex; template: string | undefined } =>
  typeof pattern === "string"
    ? { regex: pattern, template: undefined }
    : { regex: pattern.regex, template: pattern.version };

/**
 * Builds the version of a match. Without a template the first capture group is
 * the version, as it is for every pattern written as a plain regex. With one,
 * $1, $2 … are replaced by the corresponding groups; a template naming a group
 * that did not participate in the match yields no version rather than a
 * half-built one.
 */
const resolveVersion = (
  match: RegExpMatchArray,
  template: string | undefined,
): string | undefined => {
  if (template === undefined) {
    return match.length > 1 ? match[1] : undefined;
  }

  let missingGroup = false;
  const version = template.replace(/\$(\d)/g, (_placeholder, digit: string) => {
    const group = match[Number(digit)];
    if (group === undefined) {
      missingGroup = true;
      return "";
    }
    return group;
  });

  return missingGroup ? undefined : version;
};

export const matchString = (value: string, pattern: Pattern): MatchResult => {
  const { regex, template } = splitPattern(pattern);
  const regexExp = new RegExp(regex, "i");
  const match = value.match(regexExp);
  if (match) {
    return {
      hit: true,
      version: resolveVersion(match, template),
      index: match.index,
      matchLength: match[0].length,
    };
  }

  return {
    hit: false,
    version: undefined,
    index: undefined,
    matchLength: undefined,
  };
};

/**
 * Like {@link matchString}, but returns the first match that does not overlap
 * any of `excludedSpans` (half-open `[start, end)` character ranges). The value
 * is matched as-is, so no match can be created or destroyed by the exclusion —
 * matches that merely fall inside an excluded range are skipped in favour of the
 * next one. With no excluded spans it is equivalent to {@link matchString}.
 */
export const matchStringOutsideSpans = (
  value: string,
  pattern: Pattern,
  excludedSpans: Array<[number, number]>,
): MatchResult => {
  if (excludedSpans.length === 0) {
    return matchString(value, pattern);
  }

  const { regex, template } = splitPattern(pattern);
  const regexExp = new RegExp(regex, "gi");
  let match: RegExpExecArray | null;
  while ((match = regexExp.exec(value)) !== null) {
    if (match[0].length === 0) {
      // Guard against zero-width matches looping forever.
      regexExp.lastIndex++;
      continue;
    }
    const start = match.index;
    const end = start + match[0].length;
    const overlapsExcluded = excludedSpans.some(
      ([spanStart, spanEnd]) => start < spanEnd && end > spanStart,
    );
    if (!overlapsExcluded) {
      return {
        hit: true,
        version: resolveVersion(match, template),
        index: match.index,
        matchLength: match[0].length,
      };
    }
  }

  return {
    hit: false,
    version: undefined,
    index: undefined,
    matchLength: undefined,
  };
};

export type SnippetOptions = {
  context?: number;
  maxMatchLength?: number;
  maxValueLength?: number;
};

export const extractMatchSnippet = (
  value: string,
  index: number,
  matchLength: number,
  options: SnippetOptions = {},
): string => {
  const { context = 40, maxMatchLength = 120, maxValueLength = 200 } = options;
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
  const evidenceValue =
    result.index !== undefined && result.matchLength !== undefined
      ? extractMatchSnippet(rawValue, result.index, result.matchLength)
      : rawValue;
  return prefix ? `${prefix}: ${evidenceValue}` : evidenceValue;
};
