import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), EnvironmentPlugin("all")],
  build: {
    target: "es2021",
    rollupOptions: {
      output: {
        entryFileNames: `main.js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
