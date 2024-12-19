import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"), // Set 'src' to point to 'src'
      assets: resolve(__dirname, "src/assets"), // If you want to use 'assets' alias
      store: resolve(__dirname, "src/store"), // If you want to use 'store' alias
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    lib: {
      entry: "src/index.js",
      name: "GlobalStyle",
      fileName: (format) => `global-style.${format}.js`,
      formats: ["es", "umd"],
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@material-ui/styles",
        "@material-ui/core",
        "axios",
        "axios-retry",
        "react-router-dom",
        "react-redux",
        "@reduxjs/toolkit",
      ],
      output: {
        globals: {
          react: "React",
          redux: "Redux",
          "react-redux": "ReactRedux",
          "@reduxjs/toolkit": "RTK",
          "react-dom": "ReactDOM",
          "@material-ui/styles": "MaterialUIStyles",
          "@material-ui/core": "MaterialUI",
          axios: "Axios",
          "axios-retry": "AxiosRetry",
          "react-router-dom": "ReactRouterDOM",
        },
      },
    },
  },
});
