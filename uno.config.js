import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        'carbon': () => import('@iconify-json/carbon').then(i => i.default),
        'svg-spinners': () => import('@iconify-json/svg-spinners').then(i => i.default),
      },
    }),
  ],
  shortcuts: [
    // 按钮
    ['btn', 'px-4 py-2 rounded-md inline-block bg-gray-600 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 disabled:cursor-default disabled:bg-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'],
    ['btn-primary', 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'],
    ['btn-secondary', 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'],
    ['btn-success', 'bg-green-600 hover:bg-green-700 focus:ring-green-500'],
    ['btn-danger', 'bg-red-600 hover:bg-red-700 focus:ring-red-500'],

    // 图标按钮
    ['icon-btn', 'inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200'],

    // 卡片
    ['card', 'bg-white rounded-lg shadow-md p-6'],
    ['card-hover', 'transition-shadow duration-200 hover:shadow-lg'],

    // 表单元素
    ['form-input', 'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'],
    ['form-select', 'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'],
    ['form-checkbox', 'rounded border-gray-300 text-blue-600 focus:ring-blue-500'],
    ['form-radio', 'rounded-full border-gray-300 text-blue-600 focus:ring-blue-500'],

    // 标签
    ['badge', 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'],
    ['badge-blue', 'bg-blue-100 text-blue-800'],
    ['badge-green', 'bg-green-100 text-green-800'],
    ['badge-red', 'bg-red-100 text-red-800'],
    ['badge-yellow', 'bg-yellow-100 text-yellow-800'],

    // 布局
    ['container-sm', 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'],
    ['container-md', 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'],
    ['container-lg', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'],
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },
})
