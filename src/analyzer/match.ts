type MatchResult = {
  hit: boolean;
  match: string | undefined;
};

export const matchString = (
  value: string,
  rule: { contains?: string; regex?: string },
): MatchResult => {
  if (rule.regex) {
    const regex = new RegExp(rule.regex, "i");
    const match = value.match(regex);
    if (match) {
      return { hit: true, match: match.length > 1 ? match[1] : undefined };
    }
  }
  if (rule.contains) {
    if (value.toLowerCase().includes(rule.contains.toLowerCase())) {
      return { hit: true, match: undefined };
    }
  }

  return { hit: false, match: undefined };
};
