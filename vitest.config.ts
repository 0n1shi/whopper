import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "**/*.test.ts",
        "**/*.test.mjs",
        "**/node_modules/**",
        "dist/**",
        "src/signatures/technologies/**",
      ],
    },
  },
});
