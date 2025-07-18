import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'JsonDocsConverter',
      fileName: 'json2docs-converter',
    },
    rollupOptions: {
      external: ['pdf-lib', 'docx'],
      output: {
        globals: {
          'pdf-lib': 'PDFLib',
          'docx': 'docx',
        },
      },
    },
  },
})
