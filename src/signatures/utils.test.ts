import { describe, it, expect } from "vitest";
import { getJavascriptVariableNames } from "./utils.js";
import type { Signature } from "./_types.js";

describe("getJavascriptVariableNames", () => {
  it("should return empty array for empty signatures", () => {
    const result = getJavascriptVariableNames([]);
    expect(result).toEqual([]);
  });

  it("should return empty array when no signatures have javascript variables", () => {
    const signatures: Signature[] = [
      { name: "nginx" },
      { name: "Apache", rule: { confidence: "high", headers: { Server: "Apache" } } },
    ];
    const result = getJavascriptVariableNames(signatures);
    expect(result).toEqual([]);
  });

  it("should extract javascript variable names from signatures", () => {
    const signatures: Signature[] = [
      {
        name: "jQuery",
        rule: {
          confidence: "high",
          javascriptVariables: { jQuery: ".*", "$": ".*" },
        },
      },
    ];
    const result = getJavascriptVariableNames(signatures);
    expect(result).toContain("jQuery");
    expect(result).toContain("$");
  });

  it("should deduplicate variable names across signatures", () => {
    const signatures: Signature[] = [
      {
        name: "React",
        rule: {
          confidence: "high",
          javascriptVariables: { React: ".*", ReactDOM: ".*" },
        },
      },
      {
        name: "React Router",
        rule: {
          confidence: "high",
          javascriptVariables: { React: ".*", ReactRouter: ".*" },
        },
      },
    ];
    const result = getJavascriptVariableNames(signatures);
    const reactCount = result.filter((name) => name === "React").length;
    expect(reactCount).toBe(1);
    expect(result).toContain("ReactDOM");
    expect(result).toContain("ReactRouter");
  });

  it("should handle signatures with undefined rule", () => {
    const signatures: Signature[] = [
      { name: "nginx" },
      {
        name: "jQuery",
        rule: {
          confidence: "high",
          javascriptVariables: { jQuery: ".*" },
        },
      },
    ];
    const result = getJavascriptVariableNames(signatures);
    expect(result).toEqual(["jQuery"]);
  });

  it("should handle signatures with rule but no javascriptVariables", () => {
    const signatures: Signature[] = [
      {
        name: "nginx",
        rule: { confidence: "high", headers: { Server: "nginx" } },
      },
      {
        name: "jQuery",
        rule: {
          confidence: "high",
          javascriptVariables: { jQuery: ".*" },
        },
      },
    ];
    const result = getJavascriptVariableNames(signatures);
    expect(result).toEqual(["jQuery"]);
  });
});
