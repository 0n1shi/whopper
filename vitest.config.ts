import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.test.ts",
        "**/node_modules/**",
        "dist/**",
        "src/signatures/technologies/**",
      ],
    },
  },
});
