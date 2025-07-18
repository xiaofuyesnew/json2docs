<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100,
  },
  label: {
    type: String,
    default: '进度',
  },
  status: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'success', 'warning', 'danger'].includes(value),
  },
})

// 进度条颜色
const progressColorClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-500'
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'danger':
      return 'bg-red-500'
    default:
      return 'bg-blue-500'
  }
})

// 状态文本颜色
const statusColorClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-blue-600'
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'danger':
      return 'text-red-600'
    default:
      return 'text-blue-600'
  }
})

// 格式化进度
function formatProgress(value) {
  return `${Math.round(value)}%`
}

// 获取预计剩余时间
function getEstimatedTime() {
  if (props.progress >= 100)
    return '已完成'
  if (props.progress === 0)
    return '准备中...'

  // 简单的时间估算逻辑
  const remainingProgress = 100 - props.progress
  const estimatedSeconds = Math.ceil(remainingProgress / 20) // 假设每5%需要1秒

  if (estimatedSeconds <= 5)
    return '即将完成'
  if (estimatedSeconds <= 10)
    return '约10秒'
  if (estimatedSeconds <= 30)
    return '约30秒'
  return '约1分钟'
}

// 获取当前阶段
function getCurrentStage() {
  if (props.progress >= 100)
    return '转换完成'
  if (props.progress >= 75)
    return '优化输出'
  if (props.progress >= 50)
    return '生成内容'
  if (props.progress >= 25)
    return '解析文档'
  if (props.progress > 0)
    return '验证格式'
  return '准备中'
}
</script>

<template>
  <div class="progress-indicator">
    <div class="mb-2 flex items-center justify-between">
      <div class="text-sm text-gray-700 font-medium">
        {{ label }}
      </div>
      <div class="text-sm text-gray-500 font-mono">
        {{ formatProgress(progress) }}
      </div>
    </div>

    <div class="relative h-3 overflow-hidden rounded-full bg-gray-200 shadow-inner">
      <!-- 进度条背景动画 -->
      <div
        v-if="progress > 0 && progress < 100"
        class="absolute inset-0 animate-pulse from-transparent via-white to-transparent bg-gradient-to-r opacity-30"
      />

      <!-- 主进度条 -->
      <div
        class="relative h-full overflow-hidden transition-all duration-500 ease-out" :class="progressColorClass"
        :style="{ width: `${progress}%` }"
      >
        <!-- 进度条光泽效果 -->
        <div
          v-if="progress > 0"
          class="animate-shimmer absolute inset-0 from-transparent via-white to-transparent bg-gradient-to-r opacity-20"
        />
      </div>

      <!-- 完成时的成功动画 -->
      <div v-if="progress === 100 && variant === 'success'" class="absolute right-2 top-1/2 transform -translate-y-1/2">
        <div class="i-carbon-checkmark-filled animate-bounce text-xs text-white" />
      </div>
    </div>

    <!-- 状态信息 -->
    <div v-if="status" class="mt-2 flex items-center text-sm" :class="statusColorClass">
      <!-- 加载动画图标 -->
      <div v-if="progress > 0 && progress < 100" class="i-svg-spinners-180-ring-with-bg mr-2 animate-spin" />
      <!-- 完成图标 -->
      <div v-else-if="progress === 100 && variant === 'success'" class="i-carbon-checkmark-filled mr-2" />
      <!-- 错误图标 -->
      <div v-else-if="progress === 100 && variant === 'danger'" class="i-carbon-error-filled mr-2" />

      <span>{{ status }}</span>
    </div>

    <!-- 进度阶段指示器 -->
    <div v-if="progress > 0" class="mt-3">
      <div class="mb-2 flex justify-between text-xs text-gray-400">
        <div class="flex items-center" :class="{ 'text-blue-500': progress >= 25 }">
          <div class="i-carbon-circle-filled mr-1" :class="progress >= 25 ? 'text-blue-500' : 'text-gray-300'" />
          验证
        </div>
        <div class="flex items-center" :class="{ 'text-blue-500': progress >= 50 }">
          <div class="i-carbon-circle-filled mr-1" :class="progress >= 50 ? 'text-blue-500' : 'text-gray-300'" />
          解析
        </div>
        <div class="flex items-center" :class="{ 'text-blue-500': progress >= 75 }">
          <div class="i-carbon-circle-filled mr-1" :class="progress >= 75 ? 'text-blue-500' : 'text-gray-300'" />
          生成
        </div>
        <div class="flex items-center" :class="{ 'text-green-500': progress === 100 }">
          <div class="i-carbon-circle-filled mr-1" :class="progress === 100 ? 'text-green-500' : 'text-gray-300'" />
          完成
        </div>
      </div>

      <!-- 详细进度信息 -->
      <div class="rounded bg-gray-50 p-2 text-xs text-gray-600">
        <div class="flex justify-between">
          <span>预计剩余时间:</span>
          <span>{{ getEstimatedTime() }}</span>
        </div>
        <div class="flex justify-between">
          <span>当前阶段:</span>
          <span>{{ getCurrentStage() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
