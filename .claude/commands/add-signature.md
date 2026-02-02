# Add Signature

Add a new technology signature to `src/signatures/technologies/`.

## Steps

1. **Confirm with user**: Ask the user for the technology name they want to add
2. **Gather information**: Collect the following from the user:
   - Technology name (e.g., jQuery, Nginx)
   - Description (brief description)
   - CPE 2.2 (Common Platform Enumeration) (optional)
     - **Search the internet to find the correct CPE**
     - Format: `cpe:/<part>:<vendor>:<product>:<version>`
     - Examples: `cpe:/a:jquery:jquery`, `cpe:/a:nginx:nginx`
     - Reference: [NVD CPE Dictionary](https://nvd.nist.gov/products/cpe)
   - Detection rules:
     - confidence: "high" | "medium" | "low"
     - headers: HTTP header regex matching (optional)
     - bodies: HTML body regex matching (optional)
     - urls: URL path regex matching (optional)
     - cookies: Cookie regex matching (optional)
     - javascriptVariables: JavaScript variable regex matching (optional)

3. **Reference existing signatures**: Use existing signature files as reference
   - Server detection example: `src/signatures/technologies/nginx.ts`
   - JavaScript detection example: `src/signatures/technologies/jquery.ts`

4. **Create file**: Create a new file at `src/signatures/technologies/{snake_case_name}.ts`

   ```typescript
   import type { Signature } from "../_types.js";

   export const {camelCase}Signature: Signature = {
     name: "{Technology Name}",
     description: "{Description}",
     cpe: "{CPE}",  // optional
     rule: {
       confidence: "{high|medium|low}",
       // Select appropriate options from below
       headers: { ... },
       bodies: [ ... ],
       urls: [ ... ],
       cookies: { ... },
       javascriptVariables: { ... },
     },
   };
   ```

5. **Register in index.ts**: Edit `src/signatures/index.ts`
   - Add import statement (alphabetical order recommended)
   - Add to `signatures` array export (alphabetical order recommended)

6. **Verify build**: Confirm the build passes with `npm run build`

## Type Definitions

```typescript
type Confidence = "high" | "medium" | "low";
type Regex = string;

type Rule = {
  confidence: Confidence;
  headers?: Record<string, Regex>;
  bodies?: Regex[];
  urls?: Regex[];
  cookies?: Record<string, Regex>;
  javascriptVariables?: Record<string, Regex>;
};

type Signature = {
  name: string;
  description?: string;
  cpe?: string;
  rule?: Rule;
  impliedSoftwares?: string[];
};
```

## Important Notes

- File names: snake_case (e.g., `jquery_ui.ts`)
- Export names: camelCase + Signature (e.g., `jqueryUiSignature`)
- Version capture regex: `(\\d+\\.\\d+\\.\\d+)`
- Use `.js` extension in imports/exports (ESM compatibility)
- **Always use CPE 2.2 format** (not CPE 2.3)
  - CPE 2.2: `cpe:/a:vendor:product:version`
  - CPE 2.3: `cpe:2.3:a:vendor:product:version:...` (do not use)
