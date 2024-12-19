import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), svgr(), libInjectCss()],
  server: {
    port: 3001,
  },
  css: {
    modules: {
      // Ensures camelCase style names are used in the module
      localsConvention: "camelCase",
      // You can configure the scope of the CSS class names here if needed
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"), // Set 'src' to point to 'src'
      components: resolve(__dirname, "src/components"), // You can keep other aliases if needed
      assets: resolve(__dirname, "src/assets"), // If you want to use 'assets' alias
      store: resolve(__dirname, "src/store"), // If you want to use 'store' alias
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    lib: {
      entry: "src/index.js", // Entry point for your library
      name: "SolutionBluePrintWc", // Global name for UMD builds
      fileName: (format) => `solution-blueprint.${format}.js`, // Output file name
      formats: ["es", "umd"], // Build formats
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-redux",
        "clsx",
        "react-router-dom",
        "@reduxjs/toolkit",
        "@material-ui/core",
        "@material-ui/icons",
        "@material-ui/styles",
        "@material-ui/lab",
        "@xyflow/react",
        "@react-spring/web",
        "underscore",
        "sanitize-html-react",
        "@monaco-editor/react",
        "monaco-editor",
        "axios",
        "axios-retry",
        "global-style"
      ],
      output: {
        globals: {
          react: "React",
          redux: "Redux",
          clsx: "clsx",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
          "react-redux": "ReactRedux",
          "@reduxjs/toolkit": "RTK",
          "@material-ui/icons": "MaterialUIIcons",
          "@material-ui/core": "MaterialUI",
          "@material-ui/styles": "MaterialUIStyle",
          "@material-ui/lab": "MaterialUILab",
          "@xyflow/react": "ReactFlow",
          "@react-spring/web": "ReactSpringWeb",
          underscore: "Underscore",
          "sanitize-html-react": "SanitizeHtmlReact",
          "@monaco-editor/react": "MonacoEditorReact",
          "monaco-editor" : "MonacoEditor",
          axios: "Axios",
          "axios-retry": "AxiosRetry",
          "global-style" : "GlobalStyle"
        },
      },
    },
  },
});
