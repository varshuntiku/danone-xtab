import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        server: {
            port: 3001
        },
        preview: {
            port: 3001
        },
        plugins: [react(), jsconfigPaths(), svgr()],
        define:
            command === 'serve'
                ? { global: {}, __APP_ENV__: JSON.stringify(env.APP_ENV) }
                : { __APP_ENV__: JSON.stringify(env.APP_ENV) },
        envPrefix: 'REACT_APP_',
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './testSetup.js',
            css: true
        },
        build: {
            outDir: 'build',
            rollupOptions: {
                external: ['canvg','dompurify'],
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    };
});
