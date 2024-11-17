import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  envDir: "./",
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  build: {
    target: "esnext",
    minify: true,
    sourcemap: true,
  },
  define: {
    "process.env": process.env,
    // If you're using global, you can also use:
    global: "globalThis",
  },
});
