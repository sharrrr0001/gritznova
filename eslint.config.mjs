import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // three.js scene graphs are mutable by design: objects, buffers and uniforms are updated
    // imperatively inside useFrame (outside React render). The React Compiler immutability rule
    // does not model this, so it is disabled for the 3D scene only.
    files: ["components/hero/scene/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  { ignores: [".next/**", "node_modules/**", ".netlify/**", "next-env.d.ts"] },
];

export default config;
