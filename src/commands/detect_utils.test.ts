import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  colorizeConfidence,
  makeDetectCommandOutput,
  printDetectCommandOutputAsText,
  printDetectCommandOutputAsJSON,
} from "./detect_utils.js";
import type { Detection } from "../analyzer/types.js";
import type { Signature } from "../signatures/_types.js";

describe("colorizeConfidence", () => {
  it("should return green for high confidence", () => {
    const result = colorizeConfidence("high");
    expect(result).toContain("high");
  });

  it("should return yellow for medium confidence", () => {
    const result = colorizeConfidence("medium");
    expect(result).toContain("medium");
  });

  it("should return red for low confidence", () => {
    const result = colorizeConfidence("low");
    expect(result).toContain("low");
  });
});

describe("makeDetectCommandOutput", () => {
  const baseSignatures: Signature[] = [
    { name: "nginx", description: "Web server", cpe: "cpe:2.3:a:nginx:nginx" },
    { name: "jQuery", description: "JavaScript library" },
    { name: "PHP", description: "Programming language" },
    {
      name: "WordPress",
      description: "CMS",
      impliedSoftwares: ["PHP", "jQuery"],
    },
  ];

  describe("basic detection", () => {
    it("should convert detections to output format", () => {
      const detections: Detection[] = [
        {
          name: "nginx",
          evidences: [
            {
              type: "header",
              value: "Server: nginx/1.20.0",
              version: "1.20.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      expect(result.detectedSoftwares).toHaveLength(1);
      expect(result.detectedSoftwares[0]!.name).toBe("nginx");
      expect(result.detectedSoftwares[0]!.description).toBe("Web server");
      expect(result.detectedSoftwares[0]!.confidence).toBe("high");
      expect(result.detectedSoftwares[0]!.versions).toEqual(["1.20.0"]);
    });

    it("should generate CPEs when signature has cpe", () => {
      const detections: Detection[] = [
        {
          name: "nginx",
          evidences: [
            {
              type: "header",
              value: "nginx/1.20.0",
              version: "1.20.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      expect(result.detectedSoftwares[0]!.cpes).toEqual([
        "cpe:2.3:a:nginx:nginx:1.20.0",
      ]);
    });

    it("should not include cpes when signature has no cpe", () => {
      const detections: Detection[] = [
        {
          name: "jQuery",
          evidences: [
            {
              type: "script",
              value: "jquery.min.js",
              version: "3.6.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      expect(result.detectedSoftwares[0]!.cpes).toBeUndefined();
    });
  });

  describe("confidence calculation", () => {
    it("should use highest confidence from evidences", () => {
      const detections: Detection[] = [
        {
          name: "nginx",
          evidences: [
            {
              type: "header",
              value: "nginx",
              version: undefined,
              confidence: "low",
            },
            {
              type: "header",
              value: "nginx/1.20.0",
              version: "1.20.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      expect(result.detectedSoftwares[0]!.confidence).toBe("high");
    });
  });

  describe("implied softwares", () => {
    it("should include implied softwares", () => {
      const detections: Detection[] = [
        {
          name: "WordPress",
          evidences: [
            {
              type: "body",
              value: "wp-content",
              version: undefined,
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      const names = result.detectedSoftwares.map((s) => s.name);
      expect(names).toContain("WordPress");
      expect(names).toContain("PHP");
      expect(names).toContain("jQuery");
    });

    it("should set impliedBy on implied softwares", () => {
      const detections: Detection[] = [
        {
          name: "WordPress",
          evidences: [
            {
              type: "body",
              value: "wp-content",
              version: undefined,
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      const php = result.detectedSoftwares.find((s) => s.name === "PHP");
      expect(php?.impliedBy).toBe("WordPress");
    });

    it("should not duplicate when software is both detected and implied", () => {
      const detections: Detection[] = [
        {
          name: "WordPress",
          evidences: [
            {
              type: "body",
              value: "wp-content",
              version: undefined,
              confidence: "high",
            },
          ],
        },
        {
          name: "PHP",
          evidences: [
            {
              type: "header",
              value: "X-Powered-By: PHP/8.0",
              version: "8.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      const phpInstances = result.detectedSoftwares.filter(
        (s) => s.name === "PHP",
      );
      expect(phpInstances).toHaveLength(1);
    });
  });

  describe("merging duplicates", () => {
    it("should merge versions from multiple evidences", () => {
      const detections: Detection[] = [
        {
          name: "nginx",
          evidences: [
            {
              type: "header",
              value: "nginx/1.20.0",
              version: "1.20.0",
              confidence: "high",
            },
            {
              type: "header",
              value: "nginx/1.20.0",
              version: "1.20.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      expect(result.detectedSoftwares[0]!.versions).toEqual(["1.20.0"]);
    });

    it("should merge implied software from multiple sources", () => {
      const signatures: Signature[] = [
        { name: "React", impliedSoftwares: ["JavaScript"] },
        { name: "Vue", impliedSoftwares: ["JavaScript"] },
        { name: "JavaScript", description: "Programming language" },
      ];

      const detections: Detection[] = [
        {
          name: "React",
          evidences: [
            {
              type: "script",
              value: "react.min.js",
              version: undefined,
              confidence: "high",
            },
          ],
        },
        {
          name: "Vue",
          evidences: [
            {
              type: "script",
              value: "vue.min.js",
              version: undefined,
              confidence: "medium",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, signatures);

      const js = result.detectedSoftwares.find((s) => s.name === "JavaScript");
      expect(js).toBeDefined();
      expect(js!.impliedBy).toContain("React");
      expect(js!.impliedBy).toContain("Vue");
      expect(js!.confidence).toBe("high"); // Should use highest confidence
    });

    it("should merge versions and cpes when same software detected multiple ways", () => {
      const signatures: Signature[] = [
        { name: "nginx", cpe: "cpe:2.3:a:nginx:nginx" },
      ];

      const detections: Detection[] = [
        {
          name: "nginx",
          evidences: [
            {
              type: "header",
              value: "nginx/1.18.0",
              version: "1.18.0",
              confidence: "medium",
            },
          ],
        },
        {
          name: "nginx",
          evidences: [
            {
              type: "header",
              value: "nginx/1.20.0",
              version: "1.20.0",
              confidence: "high",
            },
          ],
        },
      ];

      const result = makeDetectCommandOutput(detections, signatures);

      const nginx = result.detectedSoftwares.find((s) => s.name === "nginx");
      expect(nginx).toBeDefined();
      expect(nginx!.versions).toContain("1.18.0");
      expect(nginx!.versions).toContain("1.20.0");
      expect(nginx!.cpes).toContain("cpe:2.3:a:nginx:nginx:1.18.0");
      expect(nginx!.cpes).toContain("cpe:2.3:a:nginx:nginx:1.20.0");
      expect(nginx!.confidence).toBe("high");
      expect(nginx!.evidences).toHaveLength(2);
    });

    it("should merge description from existing or new software", () => {
      const signatures: Signature[] = [
        { name: "nginx" }, // No description
      ];

      const detections: Detection[] = [
        { name: "nginx" },
        { name: "nginx" },
      ];

      const result = makeDetectCommandOutput(detections, signatures);

      expect(result.detectedSoftwares).toHaveLength(1);
    });
  });

  describe("edge cases", () => {
    it("should handle empty detections", () => {
      const result = makeDetectCommandOutput([], baseSignatures);
      expect(result.detectedSoftwares).toEqual([]);
    });

    it("should handle detections without evidences", () => {
      const detections: Detection[] = [{ name: "nginx" }];

      const result = makeDetectCommandOutput(detections, baseSignatures);

      expect(result.detectedSoftwares).toHaveLength(1);
      expect(result.detectedSoftwares[0]!.confidence).toBe("low");
    });
  });
});

describe("printDetectCommandOutputAsText", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should print software names", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "nginx",
          confidence: "high" as const,
        },
      ],
    };

    printDetectCommandOutputAsText(output, false);

    expect(consoleLogSpy).toHaveBeenCalled();
    const allOutput = consoleLogSpy.mock.calls
      .map((c: unknown[]) => c[0])
      .join("\n");
    expect(allOutput).toContain("nginx");
  });

  it("should print versions when available", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "nginx",
          confidence: "high" as const,
          evidences: [
            {
              type: "header" as const,
              value: "nginx/1.20.0",
              version: "1.20.0",
              confidence: "high" as const,
            },
          ],
        },
      ],
    };

    printDetectCommandOutputAsText(output, false);

    const allOutput = consoleLogSpy.mock.calls.map((c: unknown[]) => c[0]).join("\n");
    expect(allOutput).toContain("1.20.0");
  });

  it("should print evidences when showEvidence is true", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "nginx",
          confidence: "high" as const,
          evidences: [
            {
              type: "header" as const,
              value: "Server: nginx",
              version: undefined,
              confidence: "high" as const,
            },
          ],
        },
      ],
    };

    printDetectCommandOutputAsText(output, true);

    const allOutput = consoleLogSpy.mock.calls.map((c: unknown[]) => c[0]).join("\n");
    expect(allOutput).toContain("[header]");
    expect(allOutput).toContain("Server: nginx");
  });

  it("should not print evidences when showEvidence is false", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "nginx",
          confidence: "high" as const,
          evidences: [
            {
              type: "header" as const,
              value: "Server: nginx",
              version: undefined,
              confidence: "high" as const,
            },
          ],
        },
      ],
    };

    printDetectCommandOutputAsText(output, false);

    const allOutput = consoleLogSpy.mock.calls.map((c: unknown[]) => c[0]).join("\n");
    expect(allOutput).not.toContain("[header]");
  });

  it("should print impliedBy when present", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "PHP",
          confidence: "high" as const,
          impliedBy: "WordPress",
        },
      ],
    };

    printDetectCommandOutputAsText(output, true);

    const allOutput = consoleLogSpy.mock.calls.map((c: unknown[]) => c[0]).join("\n");
    expect(allOutput).toContain("[implied]");
    expect(allOutput).toContain("WordPress");
  });
});

describe("printDetectCommandOutputAsJSON", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should print valid JSON", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "nginx",
          confidence: "high" as const,
        },
      ],
    };

    printDetectCommandOutputAsJSON(output);

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const jsonOutput = consoleLogSpy.mock.calls[0][0];
    expect(() => JSON.parse(jsonOutput)).not.toThrow();
  });

  it("should include all fields in JSON output", () => {
    const output = {
      detectedSoftwares: [
        {
          name: "nginx",
          description: "Web server",
          versions: ["1.20.0"],
          confidence: "high" as const,
        },
      ],
    };

    printDetectCommandOutputAsJSON(output);

    const jsonOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(jsonOutput.detectedSoftwares[0].name).toBe("nginx");
    expect(jsonOutput.detectedSoftwares[0].description).toBe("Web server");
    expect(jsonOutput.detectedSoftwares[0].versions).toEqual(["1.20.0"]);
  });
});
