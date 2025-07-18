import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  unocss: true,
  ignores: [
    '**/*.md',
    '**/*.mdx',
    '.kiro/**',
    'packages/converter/docs/**',
    'packages/converter/README.md',
    'node_modules/**',
  ],
  rules: {
    'no-console': 'off',
  },
}, {
  files: ['public/conversion-worker.js'],
  rules: {
    'no-restricted-globals': 'off', // Allow self in web workers
  },
}, {
  files: ['**/*.test.js', '**/test/**/*.js'],
  rules: {
    'no-new': 'off', // Allow new in tests for error testing
  },
}, {
  ignores: ['**/*.md', '**/*.mdx', '.kiro/**/*.md'],
})
