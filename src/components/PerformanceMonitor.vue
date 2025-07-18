<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useDocumentStore } from '../stores/document'

const documentStore = useDocumentStore()

const isVisible = ref(false)
const memoryInfo = ref(null)
const performanceEntries = ref([])

// 获取内存信息
function getMemoryInfo() {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
    }
  }
  return null
}

// 获取性能条目
function getPerformanceEntries() {
  const entries = performance.getEntriesByType('measure')
  return entries.slice(-10) // 最近10个测量
}

// 更新性能数据
function updatePerformanceData() {
  memoryInfo.value = getMemoryInfo()
  performanceEntries.value = getPerformanceEntries()
}

// 格式化时间
function formatTime(time) {
  return `${time.toFixed(2)}ms`
}

// 格式化内存大小
function formatMemory(mb) {
  return `${mb}MB`
}

// 获取内存使用率
const memoryUsagePercent = computed(() => {
  if (!memoryInfo.value)
    return 0
  return Math.round((memoryInfo.value.used / memoryInfo.value.total) * 100)
})

// 获取内存状态颜色
const memoryStatusColor = computed(() => {
  const percent = memoryUsagePercent.value
  if (percent > 80)
    return 'text-red-600'
  if (percent > 60)
    return 'text-yellow-600'
  return 'text-green-600'
})

// 性能统计
const performanceStats = computed(() => documentStore.performanceStats)

let updateInterval = null

onMounted(() => {
  updatePerformanceData()
  updateInterval = setInterval(updatePerformanceData, 2000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

// 清除性能数据
function clearPerformanceData() {
  performance.clearMeasures()
  performance.clearMarks()
  updatePerformanceData()
}

// 开发模式检测
const isDevelopment = import.meta.env.DEV
</script>

<template>
  <div v-if="isDevelopment" class="performance-monitor">
    <!-- 性能监控切换按钮 -->
    <button
      class="fixed bottom-4 right-4 z-50 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
      @click="isVisible = !isVisible"
    >
      <div class="i-carbon-analytics h-5 w-5" />
    </button>

    <!-- 性能监控面板 -->
    <div
      v-if="isVisible"
      class="fixed bottom-16 right-4 z-50 w-80 border rounded-lg bg-white p-4 shadow-xl"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          性能监控
        </h3>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="isVisible = false"
        >
          <div class="i-carbon-close h-4 w-4" />
        </button>
      </div>

      <!-- 转换统计 -->
      <div class="mb-4">
        <h4 class="mb-2 text-sm text-gray-700 font-medium">
          转换统计
        </h4>
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span>总转换次数:</span>
            <span>{{ performanceStats.totalConversions }}</span>
          </div>
          <div class="flex justify-between">
            <span>上次转换时间:</span>
            <span>{{ formatTime(performanceStats.lastConversionTime) }}</span>
          </div>
          <div class="flex justify-between">
            <span>平均转换时间:</span>
            <span>{{ formatTime(performanceStats.averageConversionTime) }}</span>
          </div>
          <div class="flex justify-between">
            <span>使用Worker:</span>
            <span :class="performanceStats.workerUsed ? 'text-green-600' : 'text-gray-600'">
              {{ performanceStats.workerUsed ? '是' : '否' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 内存使用情况 -->
      <div v-if="memoryInfo" class="mb-4">
        <h4 class="mb-2 text-sm text-gray-700 font-medium">
          内存使用
        </h4>
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span>已使用:</span>
            <span :class="memoryStatusColor">{{ formatMemory(memoryInfo.used) }}</span>
          </div>
          <div class="flex justify-between">
            <span>总计:</span>
            <span>{{ formatMemory(memoryInfo.total) }}</span>
          </div>
          <div class="flex justify-between">
            <span>限制:</span>
            <span>{{ formatMemory(memoryInfo.limit) }}</span>
          </div>
          <div class="mt-2">
            <div class="flex items-center justify-between text-xs">
              <span>使用率</span>
              <span :class="memoryStatusColor">{{ memoryUsagePercent }}%</span>
            </div>
            <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full transition-all duration-300"
                :class="{
                  'bg-green-500': memoryUsagePercent < 60,
                  'bg-yellow-500': memoryUsagePercent >= 60 && memoryUsagePercent < 80,
                  'bg-red-500': memoryUsagePercent >= 80,
                }"
                :style="{ width: `${memoryUsagePercent}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 缓存统计 -->
      <div class="mb-4">
        <h4 class="mb-2 text-sm text-gray-700 font-medium">
          缓存统计
        </h4>
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span>缓存条目:</span>
            <span>{{ documentStore.resultCache.size }}</span>
          </div>
          <div class="flex justify-between">
            <span>缓存命中:</span>
            <span class="text-green-600">优化性能</span>
          </div>
        </div>
      </div>

      <!-- 性能条目 -->
      <div v-if="performanceEntries.length > 0" class="mb-4">
        <h4 class="mb-2 text-sm text-gray-700 font-medium">
          性能测量
        </h4>
        <div class="max-h-32 overflow-y-auto text-xs space-y-1">
          <div
            v-for="entry in performanceEntries"
            :key="entry.name"
            class="flex justify-between"
          >
            <span class="truncate">{{ entry.name }}</span>
            <span>{{ formatTime(entry.duration) }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2">
        <button
          class="btn-sm btn flex-1 btn-secondary"
          @click="updatePerformanceData"
        >
          <div class="i-carbon-renew mr-1" />
          刷新
        </button>
        <button
          class="btn-sm btn flex-1 btn-secondary"
          @click="clearPerformanceData"
        >
          <div class="i-carbon-clean mr-1" />
          清除
        </button>
      </div>

      <!-- 提示信息 -->
      <div class="mt-3 text-xs text-gray-500">
        <div class="i-carbon-information mr-1 inline-block" />
        仅在开发模式下显示
      </div>
    </div>
  </div>
</template>

<style scoped>
.performance-monitor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
