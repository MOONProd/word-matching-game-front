import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: true,
    }),
    tsconfigPaths(),
  ],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        // target: 'http://10.10.220.36:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8080',
        // target: 'http://10.10.220.36:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:8080',
        // target: 'http://10.10.220.36:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          console.log('Proxy configured for /ws');
        },
      },
    },
  },
});

