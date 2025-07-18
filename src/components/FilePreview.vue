<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  data: {
    type: [Blob, Uint8Array, String, Object],
    required: true,
  },
  format: {
    type: String,
    required: true,
    validator: value => ['html', 'pdf', 'docx'].includes(value),
  },
  fileName: {
    type: String,
    default: 'document',
  },
})

const emit = defineEmits(['download'])

// 检查浏览器是否支持PDF预览
const isPdfSupported = computed(() => {
  if (typeof navigator === 'undefined')
    return false
  return navigator.mimeTypes && navigator.mimeTypes['application/pdf']
})

// 为PDF创建对象URL
const pdfObjectUrl = ref('')

// 获取实际的数据内容
const actualData = computed(() => {
  // 如果是对象且有 data 属性，则使用 data 属性
  if (typeof props.data === 'object' && props.data !== null && 'data' in props.data) {
    return props.data.data
  }
  return props.data
})

// 获取HTML内容用于预览
const htmlContent = computed(() => {
  if (props.format !== 'html')
    return ''

  const data = actualData.value
  if (typeof data === 'string') {
    return data
  }

  // 如果是其他类型，尝试转换为字符串
  if (data instanceof Uint8Array) {
    return new TextDecoder().decode(data)
  }

  return String(data)
})

// 创建PDF对象URL
function createPdfObjectUrl() {
  if (props.format === 'pdf') {
    const data = actualData.value
    let blob

    if (data instanceof Blob) {
      blob = data
    }
    else if (data instanceof Uint8Array) {
      blob = new Blob([data], { type: 'application/pdf' })
    }
    else {
      return
    }

    pdfObjectUrl.value = URL.createObjectURL(blob)
  }
}

// 下载文件
function downloadFile() {
  emit('download')
}

// 组件挂载时创建对象URL
onMounted(() => {
  createPdfObjectUrl()
})

// 组件卸载前释放对象URL
onBeforeUnmount(() => {
  if (pdfObjectUrl.value) {
    URL.revokeObjectURL(pdfObjectUrl.value)
  }
})
</script>

<template>
  <div class="file-preview">
    <!-- HTML预览 -->
    <div v-if="format === 'html'" class="html-preview">
      <iframe
        :srcdoc="htmlContent"
        class="h-full w-full border-0"
        sandbox="allow-same-origin"
      />
    </div>

    <!-- PDF预览 -->
    <div v-else-if="format === 'pdf'" class="pdf-preview">
      <div v-if="isPdfSupported" class="h-full w-full">
        <object
          :data="pdfObjectUrl"
          type="application/pdf"
          class="h-full w-full"
        >
          <div class="h-full flex flex-col items-center justify-center">
            <div class="i-carbon-warning mb-2 text-4xl text-yellow-500" />
            <p>无法预览PDF文件，请下载后查看</p>
          </div>
        </object>
      </div>
      <div v-else class="h-full flex flex-col items-center justify-center">
        <div class="i-carbon-document-pdf mb-2 text-4xl text-red-500" />
        <p class="text-center">
          PDF预览不可用，请下载后查看
        </p>
        <button
          class="mt-4 btn btn-primary"
          @click="downloadFile"
        >
          下载PDF文件
        </button>
      </div>
    </div>

    <!-- DOCX预览 -->
    <div v-else-if="format === 'docx'" class="docx-preview h-full flex flex-col items-center justify-center">
      <div class="i-carbon-document mb-2 text-4xl text-green-500" />
      <p class="text-center">
        DOCX文件不支持在线预览
      </p>
      <p class="mb-4 text-center text-sm text-gray-500">
        请下载后使用Microsoft Word或其他文档编辑器打开
      </p>
      <button
        class="btn btn-primary"
        @click="downloadFile"
      >
        下载DOCX文件
      </button>
    </div>

    <!-- 未知格式 -->
    <div v-else class="unknown-format h-full flex flex-col items-center justify-center">
      <div class="i-carbon-document-unknown mb-2 text-4xl text-gray-500" />
      <p class="text-center">
        不支持预览此格式
      </p>
      <button
        class="mt-4 btn btn-secondary"
        @click="downloadFile"
      >
        下载文件
      </button>
    </div>
  </div>
</template>

<style scoped>
.file-preview {
  width: 100%;
  height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}
</style>
