import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// UnoCSS
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info)

  // 错误分类和处理
  const errorType = getErrorType(err)
  const errorMessage = getErrorMessage(err, errorType)

  // 显示用户友好的错误提示
  showErrorNotification(errorMessage, errorType, err)

  // 错误统计和报告
  reportError(err, vm, info, errorType)
}

// 处理未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)

  const errorMessage = event.reason?.message || '发生了未知错误'
  const errorType = 'async'
  showErrorNotification(`异步操作失败: ${errorMessage}`, errorType, event.reason)

  // 错误统计
  reportError(event.reason, null, 'unhandledrejection', errorType)

  // 阻止默认的错误处理
  event.preventDefault()
})

// 处理全局JavaScript错误
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error)

  const errorMessage = event.error?.message || event.message || '发生了未知错误'
  const errorType = 'script'
  showErrorNotification(`脚本错误: ${errorMessage}`, errorType, event.error)

  // 错误统计
  reportError(event.error, null, 'global', errorType)
})

// 错误类型判断
function getErrorType(error) {
  if (error.name === 'ChunkLoadError')
    return 'chunk'
  if (error.name === 'NetworkError')
    return 'network'
  if (error.name === 'DocumentConverterError')
    return 'converter'
  if (error.message?.includes('Loading chunk'))
    return 'chunk'
  if (error.message?.includes('fetch'))
    return 'network'
  if (error.message?.includes('JSON'))
    return 'json'
  if (error.message?.includes('Permission'))
    return 'permission'
  if (error.message?.includes('timeout'))
    return 'timeout'
  if (error.stack?.includes('vue'))
    return 'vue'
  return 'unknown'
}

// 获取用户友好的错误消息
function getErrorMessage(error, type) {
  switch (type) {
    case 'chunk':
      return '资源加载失败，请刷新页面重试'
    case 'network':
      return '网络连接异常，请检查网络后重试'
    case 'converter':
      return '文档转换失败，请检查JSON格式'
    case 'json':
      return 'JSON格式错误，请检查语法'
    case 'permission':
      return '权限不足，请检查浏览器设置'
    case 'timeout':
      return '操作超时，请稍后重试'
    case 'vue':
      return '界面组件错误，请刷新页面'
    default:
      return error.message || '应用出现异常，请稍后重试'
  }
}

// 显示错误通知
// function showErrorNotification(message, type, originalError = null) {
function showErrorNotification(message, type) {
  // 避免重复显示相同错误
  const existingNotifications = document.querySelectorAll('.error-notification')
  for (const notification of existingNotifications) {
    if (notification.textContent.includes(message)) {
      return // 相同错误已存在，不重复显示
    }
  }

  // 创建增强的错误提示
  const notification = document.createElement('div')
  notification.className = 'error-notification fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md transform transition-all duration-300 ease-in-out'

  // 根据错误类型选择图标和颜色
  const iconMap = {
    chunk: '🔄',
    network: '🌐',
    async: '⚡',
    script: '⚠️',
    unknown: '❌',
  }

  const colorMap = {
    chunk: 'bg-orange-500',
    network: 'bg-red-500',
    async: 'bg-yellow-500',
    script: 'bg-red-600',
    unknown: 'bg-gray-600',
  }

  notification.className = notification.className.replace('bg-red-500', colorMap[type] || 'bg-red-500')

  notification.innerHTML = `
    <div class="flex items-start">
      <div class="mr-3 mt-0.5 text-lg">${iconMap[type] || '❌'}</div>
      <div class="flex-1">
        <div class="font-medium mb-1">应用错误</div>
        <div class="text-sm opacity-90">${message}</div>
        ${type === 'chunk' ? '<div class="text-xs mt-1 opacity-75">建议刷新页面重新加载资源</div>' : ''}
        ${type === 'network' ? '<div class="text-xs mt-1 opacity-75">请检查网络连接后重试</div>' : ''}
      </div>
      <button class="ml-2 text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `

  document.body.appendChild(notification)

  // 添加进入动画
  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 10)

  // 自动移除时间根据错误类型调整
  const autoRemoveTime = type === 'chunk' ? 10000 : 6000
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => notification.remove(), 300)
    }
  }, autoRemoveTime)

  // 添加点击重试功能（针对特定错误类型）
  if (type === 'chunk' || type === 'network') {
    const retryButton = document.createElement('button')
    retryButton.className = 'mt-2 px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors'
    retryButton.textContent = type === 'chunk' ? '刷新页面' : '重试'
    retryButton.onclick = () => {
      if (type === 'chunk') {
        window.location.reload()
      }
      else {
        notification.remove()
      }
    }
    notification.querySelector('.flex-1').appendChild(retryButton)
  }
}

// 错误统计和报告
const errorStats = {
  total: 0,
  byType: {},
  recent: [],
}

function reportError(error, vm, info, type) {
  // 更新错误统计
  errorStats.total++
  errorStats.byType[type] = (errorStats.byType[type] || 0) + 1

  // 记录最近的错误（保留最近10个）
  const errorRecord = {
    timestamp: new Date().toISOString(),
    type,
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    info,
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  errorStats.recent.unshift(errorRecord)
  if (errorStats.recent.length > 10) {
    errorStats.recent = errorStats.recent.slice(0, 10)
  }

  // 存储到localStorage（可选）
  try {
    localStorage.setItem('app_error_stats', JSON.stringify(errorStats))
  }
  catch (e) {
    // localStorage可能不可用，忽略错误
    console.error(e)
  }

  // 在开发环境下显示详细错误信息
  if (import.meta.env.DEV) {
    console.group(`🚨 Error Report [${type}]`)
    console.error('Error:', error)
    console.log('Component:', vm)
    console.log('Info:', info)
    console.log('Stats:', errorStats)
    console.groupEnd()
  }

  // 这里可以添加发送错误报告到服务器的逻辑
  // sendErrorToServer(errorRecord)
}

// 提供全局访问错误统计的方法
window.__getErrorStats = () => errorStats

// 挂载应用
app.mount('#app')
