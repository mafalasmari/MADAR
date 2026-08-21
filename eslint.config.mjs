import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // React Three Fiber's model is intentionally imperative: useFrame runs
    // outside React's render/commit cycle (it's a per-frame animation
    // callback, not a render), and useMemo is the idiomatic place to build
    // a Three.js geometry/material once, random seeding included. The
    // React Compiler's purity/immutability rules don't know that R3F is a
    // deliberate escape hatch, so they flag both as if this were normal
    // component render code.
    files: ["components/orbit-journey/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
