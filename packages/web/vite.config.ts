import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "../../node_modules/@vscode/codicons/dist/codicon.css",
          dest: "assets",
        },
        {
          src: "../../node_modules/@vscode/codicons/dist/codicon.ttf",
          dest: "assets",
        },
      ],
    }),
  ],
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
