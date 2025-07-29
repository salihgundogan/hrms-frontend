// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url' // Bu satır önemlidir!

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      // @ sembolünün projenin /src klasörüne işaret ettiğini
      // Vite'a söyleyen kısım budur.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})