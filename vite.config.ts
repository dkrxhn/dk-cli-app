import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Frontend lives in client/
  root: path.resolve(__dirname, "client"),

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  build: {
    // IMPORTANT: match what the server expects: dist/public
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
