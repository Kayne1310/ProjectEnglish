import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7048',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  css: {
    devSourcemap: false, // Tắt source map CSS
  },
  build: {
    sourcemap: false, // Disable source maps in production
  }
})




