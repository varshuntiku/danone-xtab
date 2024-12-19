import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(),svgr()],
  css: {
    modules: {
      scopeBehaviour: 'local', // Using 'local' to ensure CSS is scoped
      generateScopedName: '[name]__[local]___[hash:base64:5]', // Customizing class name
    },
  },
  build: {
    lib: {
      entry: './src/main.jsx', // The entry point of our library
      name: 'MyReactLibrary', // The global variable name for UMD build
      fileName: (format) => `my-react-library.${format}.js`,
    },
    rollupOptions: {
      // Do not externalize React and React-DOM
      external: [],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});