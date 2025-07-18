<script setup>
import { onErrorCaptured, ref } from 'vue'

const error = ref(null)
const errorInfo = ref(null)

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  error.value = err
  errorInfo.value = info

  // 记录错误到控制台
  console.error('Error Boundary caught an error:', err, info)

  // 可以在这里添加错误报告逻辑
  // reportError(err, info)

  // 返回false阻止错误继续传播
  return false
})

const retryCount = ref(0)
const maxRetries = 3

// 重置错误状态
function resetError() {
  error.value = null
  errorInfo.value = null
  retryCount.value++
}

// 刷新页面
function refreshPage() {
  window.location.reload()
}

// 清除应用数据
function clearAppData() {
  try {
    localStorage.clear()
    sessionStorage.clear()
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => caches.delete(name))
      })
    }
    refreshPage()
  }
  catch (e) {
    console.error('Failed to clear app data:', e)
    refreshPage()
  }
}

// 获取错误类型
function getErrorType(err) {
  if (err.name === 'ChunkLoadError')
    return 'chunk'
  if (err.message?.includes('Loading chunk'))
    return 'chunk'
  if (err.message?.includes('Network'))
    return 'network'
  return 'unknown'
}

// 获取恢复建议
function getRecoverySuggestion(err) {
  const errorType = getErrorType(err)
  switch (errorType) {
    case 'chunk':
      return '这通常是由于应用更新导致的，建议刷新页面重新加载'
    case 'network':
      return '请检查网络连接，确保网络正常后重试'
    default:
      return '这是一个意外错误，请尝试刷新页面或清除应用数据'
  }
}
</script>

<template>
  <div v-if="error" class="error-boundary">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 lg:px-8 sm:px-6">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="i-carbon-warning-filled mx-auto mb-4 text-6xl text-red-500" />
          <h2 class="mt-6 text-3xl text-gray-900 font-extrabold">
            应用出现错误
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            很抱歉，应用遇到了一个意外错误
          </p>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
          <!-- 恢复建议 -->
          <div class="mb-4 rounded-md bg-blue-50 p-3">
            <div class="flex items-start">
              <div class="i-carbon-idea mr-2 mt-0.5 text-blue-500" />
              <div>
                <h4 class="text-sm text-blue-800 font-medium">
                  恢复建议
                </h4>
                <p class="text-sm text-blue-700">
                  {{ getRecoverySuggestion(error) }}
                </p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="mb-2 text-lg text-gray-900 font-medium">
              错误详情
            </h3>
            <div class="border border-red-200 rounded-md bg-red-50 p-3">
              <p class="text-sm text-red-700 font-mono">
                {{ error.message }}
              </p>
              <details class="mt-2">
                <summary class="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  查看技术详情
                </summary>
                <pre class="mt-2 whitespace-pre-wrap text-xs text-red-600">{{ error.stack }}</pre>
                <p class="mt-2 text-xs text-red-600">
                  错误位置: {{ errorInfo }}
                </p>
                <p class="mt-2 text-xs text-red-600">
                  重试次数: {{ retryCount }}/{{ maxRetries }}
                </p>
              </details>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex space-x-3">
              <button
                v-if="retryCount < maxRetries"
                class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="resetError"
              >
                <div class="i-carbon-reset mr-2 inline-block" />
                重试 ({{ maxRetries - retryCount }} 次剩余)
              </button>
              <button
                class="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                @click="refreshPage"
              >
                <div class="i-carbon-renew mr-2 inline-block" />
                刷新页面
              </button>
            </div>

            <button
              v-if="retryCount >= maxRetries"
              class="w-full rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              @click="clearAppData"
            >
              <div class="i-carbon-clean mr-2 inline-block" />
              清除应用数据并重启
            </button>
          </div>

          <div class="mt-4 text-center">
            <p class="text-xs text-gray-500">
              如果问题持续存在，请联系技术支持或查看
              <router-link to="/guide" class="text-blue-600 hover:text-blue-800">
                使用指南
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<style scoped>
.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.1);
}
</style>
