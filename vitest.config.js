import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.js'],
  },
  resolve: {
    alias: {
      '@': '/src',
      '@converter': '/packages/converter/src',
    },
  },
})
