import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path"
import { default as pkg } from "./package.json" with { type: "json" };


// https://vite.dev/config/
export default defineConfig({
  base: "/plugin/glicko/assets/app/",
  build: {
    emptyOutDir: true,
    outDir: "./dist/app",
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
