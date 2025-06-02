import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path"

// https://vite.dev/config/
export default defineConfig({
  base: "/plugin/glicko/assets/app/",
  build: {
    emptyOutDir: true,
    outDir: "./dist/app",
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
