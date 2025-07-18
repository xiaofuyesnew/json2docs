<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    type: [Blob, Uint8Array, String, Object],
    required: true,
  },
  fileName: {
    type: String,
    default: 'download',
  },
  text: {
    type: String,
    default: '下载文件',
  },
  downloadingText: {
    type: String,
    default: '下载中...',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'success', 'danger'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  mimeType: {
    type: String,
    default: '',
  },
})

const isDownloading = ref(false)

const buttonClass = computed(() => {
  const baseClass = 'btn'

  switch (props.variant) {
    case 'primary':
      return `${baseClass} btn-primary`
    case 'secondary':
      return `${baseClass} btn-secondary`
    case 'success':
      return `${baseClass} btn-success`
    case 'danger':
      return `${baseClass} btn-danger`
    default:
      return baseClass
  }
})

const iconClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'i-carbon-download'
    case 'secondary':
      return 'i-carbon-document'
    case 'success':
      return 'i-carbon-checkmark'
    case 'danger':
      return 'i-carbon-warning'
    default:
      return 'i-carbon-download'
  }
})

function handleDownload() {
  if (isDownloading.value || props.disabled)
    return

  isDownloading.value = true

  try {
    let blob

    // 获取实际数据
    let actualData = props.data
    if (typeof props.data === 'object' && props.data !== null && 'data' in props.data) {
      actualData = props.data.data
    }

    // 处理不同类型的数据
    if (actualData instanceof Blob) {
      blob = actualData
    }
    else if (actualData instanceof Uint8Array) {
      blob = new Blob([actualData], { type: props.mimeType || 'application/octet-stream' })
    }
    else if (typeof actualData === 'string') {
      blob = new Blob([actualData], { type: props.mimeType || 'text/plain' })
    }
    else {
      throw new TypeError('不支持的数据类型')
    }

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = props.fileName

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      isDownloading.value = false
    }, 100)
  }
  catch (error) {
    console.error('下载失败:', error)
    isDownloading.value = false
  }
}
</script>

<template>
  <button
    class="download-button"
    :class="buttonClass"
    :disabled="disabled || isDownloading"
    @click="handleDownload"
  >
    <div v-if="isDownloading" class="i-svg-spinners-180-ring-with-bg mr-1 inline-block" />
    <div v-else :class="`${iconClass} inline-block mr-1`" />
    {{ isDownloading ? downloadingText : text }}
  </button>
</template>
