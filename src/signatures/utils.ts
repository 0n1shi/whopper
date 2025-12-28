import type { Signature } from "./_types.js";

export function getJavascriptVariableNames(signatures: Signature[]): string[] {
  return [
    ...new Set(
      signatures.flatMap((sig) =>
        sig.rule.javascriptVariables
          ? Object.keys(sig.rule.javascriptVariables)
          : [],
      ),
    ),
  ];
}
