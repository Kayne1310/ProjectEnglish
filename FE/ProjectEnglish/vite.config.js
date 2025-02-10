import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: fs.readFileSync('./certs/cert.key'),
    //   cert: fs.readFileSync('./certs/cert.crt'),
    // },
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




