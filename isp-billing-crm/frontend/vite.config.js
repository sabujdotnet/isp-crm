import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    historyApiFallback: true
  }
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://isp-billing-crm.onrender.com/api',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
