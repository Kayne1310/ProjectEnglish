import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Đổi thành port bạn muốn
    strictPort: true, // Nếu port bị chiếm, Vite sẽ báo lỗi thay vì đổi sang port khác

    proxy: {
      '/api': {
        target: 'https://ksth.id.vn',
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




