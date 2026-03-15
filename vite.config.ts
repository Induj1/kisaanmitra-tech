import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy AI calls during local dev to the node proxy on 8787
      "/api/chat": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
      "/api/whisper": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-hook-form": path.resolve(__dirname, "node_modules/react-hook-form/dist/index.cjs.js"),
      "framer-motion": path.resolve(__dirname, "node_modules/framer-motion/dist/cjs/index.js"),
    },
  },
});
