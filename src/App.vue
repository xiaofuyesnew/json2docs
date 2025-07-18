<script setup>
import { storeToRefs } from 'pinia'
import { computed, provide, ref } from 'vue'

import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
import PerformanceMonitor from './components/PerformanceMonitor.vue'
import { useDocumentStore } from './stores/document'

// 全局加载状态
const isLoading = ref(false)

// 提供全局加载状态控制
provide('loading', {
  show: () => { isLoading.value = true },
  hide: () => { isLoading.value = false },
})

// 错误提示相关
const documentStore = useDocumentStore()
const { errors } = storeToRefs(documentStore)
const hasErrors = computed(() => errors.value && errors.value.length > 0)
const clearErrors = () => documentStore.clearErrors()
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />

    <!-- 全局错误提示 -->
    <ErrorMessage
      v-if="hasErrors"
      :message="errors"
      :show="true"
      type="error"
      title="出错啦"
      class="mx-auto mt-4 max-w-2xl"
      @close="clearErrors"
    />

    <main class="mx-auto max-w-7xl w-full flex-grow px-4 py-8 lg:px-8 sm:px-6">
      <ErrorBoundary>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </ErrorBoundary>
    </main>

    <AppFooter />

    <!-- 全局加载指示器 -->
    <LoadingIndicator
      v-if="isLoading"
      overlay
      message="加载中..."
    />

    <!-- 性能监控 -->
    <PerformanceMonitor />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局样式 */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
