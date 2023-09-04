import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
export default defineConfig({
  base: 'http://localhost:5000',
  plugins: [
    vue(),
    qiankun('app0', {
      useDevMode: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5000,
    cors: true,
    origin: 'http://localhost:5000'
  }
})
