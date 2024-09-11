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
      // Proxy API requests to the backend
      '/api': {
        target: 'http://localhost:8080',  // Your Spring Boot backend
        changeOrigin: true,  // Change the origin of the request to the backend
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional: remove /api prefix if not used in backend
        secure: false,  // Disable SSL for development, can be set to true if backend uses HTTPS
      },
      // Proxy WebSocket/SockJS requests
      '/ws': {
        target: 'http://localhost:8080',  // Proxy WebSocket (SockJS) connections to the backend
        ws: true,  // 웹 소켓 허용
        changeOrigin: true,  // Change the origin for WebSocket connections
        secure: false,  // Disable SSL for development
        configure: (proxy, options) => {
          // Custom configuration for SockJS, if needed
          console.log('Proxy configured for /ws');
        },
      },

    },
  },
})
