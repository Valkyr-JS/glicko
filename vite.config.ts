import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/plugin/glicko/assets/app/",
  build: {
    emptyOutDir: true,
    outDir: "./dist/app",
  },
  plugins: [react()],
});
