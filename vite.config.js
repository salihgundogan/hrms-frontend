// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import EnvironmentPlugin from 'vite-plugin-environment'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    EnvironmentPlugin('all')

  ],
  resolve: {
    alias: {
      // @ sembolünün projenin /src klasörüne işaret ettiğini
      // Vite'a söyleyen kısım budur.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})