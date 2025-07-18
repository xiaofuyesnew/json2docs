import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: false,
  formatters: false,

  // 忽略的文件和目录
  ignores: [
    'node_modules/**',
    'dist/**',
    'coverage/**',
    '**/*.min.js',
  ],

  rules: {
    'no-console': 'warn',
    'style/max-len': ['error', {
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
    }],
    'style/semi': ['error', 'never'],
    'style/quotes': ['error', 'single'],
    'style/comma-dangle': ['error', 'never'],
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc', caseInsensitive: true },
    }],
  },
})
