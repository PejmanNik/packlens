import { defineConfig } from "vite";
import typescript2 from "rollup-plugin-typescript2";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    {
      ...typescript2({
        tsconfig: "./tsconfig.app.json",
      }),
      enforce: "pre",
      apply: "build",
    },
  ],
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  resolve: {
    external: ["node:fs"],
  },
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"],
    },
  },
}));
