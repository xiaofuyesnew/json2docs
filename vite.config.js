import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@converter': '/packages/converter/src',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
