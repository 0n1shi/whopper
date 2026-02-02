# Whopper - Agent Guidelines

Whopper is a CLI tool that detects web technologies used on websites (similar to Wappalyzer or BuiltWith).

## Project Overview

- **Language**: TypeScript (ESM)
- **Runtime**: Node.js
- **Key Dependencies**: Playwright (browser automation), Commander (CLI)

## Directory Structure

```
src/
├── main.ts              # Entry point
├── cli.ts               # CLI definition
├── commands/            # CLI commands
├── analyzer/            # Technology detection logic
├── browser/             # Browser operations
├── logger/              # Logging
└── signatures/          # Technology signature definitions
    ├── _types.ts        # Type definitions
    ├── index.ts         # Signature exports
    └── technologies/    # Individual signature files
```

## Commands

```bash
npm install        # Install dependencies
npm run build      # TypeScript build
npm run dev        # Development run (source maps enabled)
npm run start      # Build & run
npm run lint       # ESLint
npm run format     # Prettier
npm run test       # Vitest test execution
```

## Adding Signatures

Use the `/add-signature` command to add new technology signatures.

### Manual Addition

1. Create `src/signatures/technologies/{snake_case}.ts`
2. Add import and export to `src/signatures/index.ts`

### Signature Structure

```typescript
import type { Signature } from "../_types.js";

export const exampleSignature: Signature = {
  name: "Example",
  description: "Description text",
  cpe: "cpe:/a:vendor:product",  // CPE 2.2 format
  rule: {
    confidence: "high",  // "high" | "medium" | "low"
    // Select appropriate options from below
    headers: { "header-name": "regex" },
    bodies: ["regex"],
    urls: ["regex"],
    cookies: { "cookie-name": "regex" },
    javascriptVariables: { "window.varName": "regex" },
  },
};
```

### CPE Guidelines

- **Format**: Use CPE 2.2 (`cpe:/a:vendor:product`)
- Do NOT use CPE 2.3 (`cpe:2.3:a:vendor:...`)
- Search NVD for correct CPE: https://nvd.nist.gov/products/cpe

## Coding Conventions

- File names: snake_case (`jquery_ui.ts`)
- Export names: camelCase + Signature (`jqueryUiSignature`)
- Use `.js` extension in imports (ESM compatibility)
- Version extraction regex: `(\\d+\\.\\d+\\.\\d+)`
- Formatting: Prettier is the source of truth; run `npm run format` before PRs
- Linting: ESLint with `@eslint/js` + `typescript-eslint` recommendations

## Testing

- Framework: Vitest (`npm test`)
- Test files: `*.test.ts`
- Coverage: `@vitest/coverage-v8`
- Keep test files close to the code they cover (e.g., `src/analyzer/*.test.ts`)

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits style (e.g., `feat: add gsap signature`, `docs: update README`)
- PRs should include:
  - A short summary of changes and motivation
  - Any relevant CLI output or reproduction steps
  - Links to related issues if applicable

## Release

```bash
npm version patch  # or minor, major
git push --follow-tags
npm publish
```

## Development Notes

- The CLI binary is `whopper`, mapped to `dist/main.js` via `package.json`
- For local CLI testing, consider `npm link` and then run `whopper detect <url>`
