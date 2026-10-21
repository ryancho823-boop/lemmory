import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The public site only gets the demo slice of the bank (lib/bank.ts). The full bank holds every
  // problem's answer and is the product, so it must never be bundled into the site.
  {
    ignores: ["scripts/**"], // build-demo-bank.ts cuts the demo slice from the full bank at build time
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@lemmory/core/formulas", "@lemmory/core/content/notes", "@lemmory/core/content/v2/*", "@lemmory/core/grading"], allowTypeImports: true, message: "Use the demo bank in lib/bank.ts. The full bank must not reach the public site." },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
