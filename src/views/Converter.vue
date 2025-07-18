<script setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

import ErrorMessage from '../components/ErrorMessage.vue'
import FormatSelector from '../components/FormatSelector.vue'
import JsonEditor from '../components/JsonEditor.vue'
import JsonValidator from '../components/JsonValidator.vue'
import ProgressIndicator from '../components/ProgressIndicator.vue'
import { useDocumentStore } from '../stores/document'

const DocumentPreview = defineAsyncComponent(() => import('../components/DocumentPreview.vue'))
const DownloadButton = defineAsyncComponent(() => import('../components/DownloadButton.vue'))
const FilePreview = defineAsyncComponent(() => import('../components/FilePreview.vue'))

const documentStore = useDocumentStore()

const jsonInput = ref('')
const jsonError = ref('')
const selectedExample = ref('')
const jsonEditor = ref(null)
const downloadButton = ref(null)
const validationResult = ref({ valid: false, errors: [], warnings: [] })
// 使用store中的进度状态
const conversionProgress = computed(() => documentStore.conversionProgress)
const conversionStatus = computed(() => documentStore.conversionStatus)

// 转换进度条颜色
const conversionProgressVariant = computed(() => {
  if (documentStore.hasErrors)
    return 'danger'
  if (conversionProgress.value < 100)
    return 'primary'
  return 'success'
})

// 示例数据
const examples = {
  simple: {
    version: '1.0',
    metadata: {
      title: '简单文档示例',
      author: 'JSON2Docs',
      created: '2025-07-24',
      description: '这是一个简单的文档示例',
    },
    content: [
      {
        type: 'heading',
        level: 1,
        text: '文档标题',
      },
      {
        type: 'paragraph',
        text: '这是一个简单的段落示例，包含**粗体**和*斜体*文本。',
      },
    ],
  },
  complex: {
    version: '1.0',
    metadata: {
      title: '复杂文档示例',
      author: 'JSON2Docs',
      created: '2025-07-24',
      description: '这是一个复杂的文档示例',
    },
    content: [
      {
        type: 'heading',
        level: 1,
        text: '复杂文档示例',
      },
      {
        type: 'paragraph',
        text: '这是一个包含多种元素的复杂文档示例。包含[链接](https://example.com)和`代码`。',
      },
      {
        type: 'heading',
        level: 2,
        text: '列表示例',
      },
      {
        type: 'list',
        listType: 'unordered',
        items: [
          '项目1',
          { text: '项目2', level: 1 },
          { text: '项目3', level: 1 },
          '项目4',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '表格示例',
      },
      {
        type: 'table',
        headers: ['列1', '列2', '列3'],
        rows: [
          ['数据1', '**粗体**数据', '数据3'],
          ['数据4', '数据5', '数据6'],
        ],
      },
    ],
  },
  styled: {
    version: '1.0',
    metadata: {
      title: '样式文档示例',
      author: 'JSON2Docs',
      created: '2025-07-24',
      description: '这是一个带有自定义样式的文档示例',
    },
    content: [
      {
        type: 'heading',
        level: 1,
        text: '样式文档示例',
      },
      {
        type: 'paragraph',
        text: '这是一个带有自定义样式的文档示例。',
      },
      {
        type: 'heading',
        level: 2,
        text: '样式列表',
      },
      {
        type: 'list',
        listType: 'unordered',
        items: [
          { text: '自定义字体', level: 0 },
          { text: '自定义颜色', level: 0 },
          { text: '自定义间距', level: 0 },
        ],
      },
      {
        type: 'paragraph',
        text: '这是一个居中对齐的段落。',
        alignment: 'center',
      },
      {
        type: 'paragraph',
        text: '这是一个右对齐的段落。',
        alignment: 'right',
      },
    ],
    styles: {
      fonts: {
        default: 'Roboto, sans-serif',
        heading: 'Georgia, serif',
      },
      colors: {
        text: '#374151',
        heading: '#1E40AF',
        background: '#FFFFFF',
      },
      spacing: {
        lineHeight: 1.6,
        paragraphSpacing: '1.5em',
      },
    },
  },
}

// 如果store中已有文档，则加载到编辑器
onMounted(() => {
  if (documentStore.jsonDocument) {
    jsonInput.value = JSON.stringify(documentStore.jsonDocument, null, 2)
  }
})

// 加载示例
function loadExample() {
  if (selectedExample.value) {
    jsonInput.value = JSON.stringify(examples[selectedExample.value], null, 2)
    jsonError.value = ''
  }
}

// 格式化JSON
function formatJson() {
  jsonEditor.value?.formatJson()
}

// 处理验证结果
function handleValidationChange(result) {
  validationResult.value = result
  jsonError.value = result.errors.length > 0 ? result.errors[0] : ''
}

// 处理快速修复
function handleQuickFix(action) {
  switch (action) {
    case 'format':
      formatJson()
      break
    case 'example':
      selectedExample.value = 'simple'
      loadExample()
      break
  }
}

// 验证JSON并设置文档
function validateAndSetDocument() {
  try {
    jsonError.value = ''

    // 检查验证结果
    if (!validationResult.value.valid) {
      jsonError.value = validationResult.value.errors[0] || '无效的JSON格式'
      return
    }

    const parsedJson = JSON.parse(jsonInput.value)

    // 设置文档
    documentStore.setJsonDocument(parsedJson)
  }
  catch (error) {
    jsonError.value = `JSON解析错误: ${error.message}`
  }
}

// 转换文档
async function convertDocument() {
  try {
    // 执行转换（进度由store管理）
    await documentStore.convertDocument()
  }
  catch (error) {
    console.error('转换失败:', error)
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 获取文件名
function getFileName() {
  if (!documentStore.convertedResult)
    return 'document'

  const format = documentStore.convertedResult.format
  const title = documentStore.jsonDocument?.metadata?.title || 'document'
  const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const timestamp = new Date().toISOString().split('T')[0]

  return `${sanitizedTitle}_${timestamp}.${format}`
}

// 获取MIME类型
function getMimeType() {
  if (!documentStore.convertedResult)
    return ''

  switch (documentStore.convertedResult.format) {
    case 'html':
      return 'text/html'
    case 'pdf':
      return 'application/pdf'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    default:
      return 'application/octet-stream'
  }
}

// 下载文件
function downloadFile() {
  if (downloadButton.value) {
    downloadButton.value.handleDownload()
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl text-gray-900 font-bold">
        文档转换器
      </h2>
      <router-link
        to="/guide"
        class="btn-sm btn btn-secondary"
      >
        <div class="i-carbon-help mr-1" />
        使用指南
      </router-link>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- 左侧：JSON输入 -->
      <div class="rounded-lg bg-white p-6 shadow-md">
        <h3 class="mb-4 flex items-center gap-2 text-lg text-gray-900 font-semibold">
          <div class="i-carbon-code text-blue-600" />
          JSON输入
        </h3>

        <div class="mb-4 flex gap-4">
          <div class="flex-1">
            <label class="mb-1 block text-sm text-gray-700 font-medium">
              选择示例
            </label>
            <select
              v-model="selectedExample"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadExample"
            >
              <option value="">
                -- 选择示例 --
              </option>
              <option value="simple">
                简单文档
              </option>
              <option value="complex">
                复杂文档
              </option>
              <option value="styled">
                样式文档
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-700 font-medium">
              操作
            </label>
            <button
              class="btn w-full"
              :disabled="!jsonInput"
              @click="formatJson"
            >
              格式化
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="mb-1 block text-sm text-gray-700 font-medium">
            JSON文档数据
          </label>
          <JsonEditor
            ref="jsonEditor"
            v-model="jsonInput"
            placeholder="在此输入JSON文档数据..."
            class="h-80"
          />
        </div>

        <div class="mb-4">
          <JsonValidator
            :json-text="jsonInput"
            @validation-change="handleValidationChange"
            @quick-fix="handleQuickFix"
          />
        </div>

        <button
          class="btn w-full btn-primary"
          :disabled="!jsonInput"
          @click="validateAndSetDocument"
        >
          验证并设置文档
        </button>
      </div>

      <!-- 右侧：转换选项和结果 -->
      <div class="rounded-lg bg-white p-6 shadow-md">
        <h3 class="mb-4 flex items-center gap-2 text-lg text-gray-900 font-semibold">
          <div class="i-carbon-settings text-blue-600" />
          转换选项
        </h3>

        <div v-if="!documentStore.hasDocument" class="py-12 text-center">
          <div class="i-carbon-document-add mx-auto mb-4 text-6xl text-gray-300" />
          <h3 class="mb-2 text-lg text-gray-900 font-medium">
            开始转换文档
          </h3>
          <p class="mb-4 text-gray-500">
            请先在左侧输入JSON文档数据，或选择一个示例开始
          </p>
          <div class="flex justify-center gap-3">
            <router-link to="/guide" class="btn-sm btn btn-secondary">
              <div class="i-carbon-help mr-1" />
              查看指南
            </router-link>
            <button
              class="btn-sm btn btn-primary"
              @click="selectedExample = 'simple'; loadExample()"
            >
              <div class="i-carbon-play mr-1" />
              加载示例
            </button>
          </div>
        </div>

        <template v-else>
          <div class="mb-6">
            <label class="mb-2 block text-sm text-gray-700 font-medium">
              选择输出格式
            </label>
            <FormatSelector v-model="documentStore.selectedFormat" />
          </div>

          <div class="mb-6">
            <label class="mb-2 block text-sm text-gray-700 font-medium">
              文档预览
            </label>
            <div class="max-h-60 overflow-auto border border-gray-200 rounded-md p-4">
              <DocumentPreview :document="documentStore.jsonDocument" />
            </div>
          </div>

          <div class="mb-6">
            <button
              class="mb-2 btn w-full"
              :class="{ 'btn-primary': !documentStore.isConverting }"
              :disabled="documentStore.isConverting"
              @click="convertDocument"
            >
              <span v-if="documentStore.isConverting">
                <div class="i-svg-spinners-180-ring-with-bg mr-2 inline-block" />
                转换中...
              </span>
              <span v-else>
                开始转换
              </span>
            </button>

            <ProgressIndicator
              v-if="documentStore.isConverting"
              :progress="conversionProgress"
              label="转换进度"
              :status="conversionStatus"
              :variant="conversionProgressVariant"
            />
          </div>

          <ErrorMessage
            v-if="documentStore.hasErrors"
            type="error"
            title="转换错误"
            :message="documentStore.errors"
            class="mb-4"
            @close="documentStore.clearErrors()"
          />

          <div v-if="documentStore.hasResult" class="mt-4">
            <h4 class="mb-2 flex items-center gap-2 text-gray-900 font-medium">
              <div class="i-carbon-checkmark-filled text-green-600" />
              转换结果
            </h4>
            <div class="mb-4 border border-gray-200 rounded-md bg-gray-50 p-3">
              <div class="mb-1 text-sm text-gray-500">
                格式: {{ documentStore.convertedResult.format.toUpperCase() }}
              </div>
              <div class="mb-1 text-sm text-gray-500">
                时间: {{ formatDate(documentStore.convertedResult.timestamp) }}
              </div>
              <div class="mb-1 text-sm text-gray-500">
                数据类型: {{ typeof documentStore.convertedResult.data }}
              </div>
              <div v-if="documentStore.convertedResult.format === 'html'" class="text-sm text-gray-500">
                数据长度: {{ String(documentStore.convertedResult.data).length }}
              </div>
            </div>

            <!-- 文件预览 -->
            <div class="mb-4">
              <div class="mb-2 text-sm text-gray-700 font-medium">
                文件预览:
              </div>
              <FilePreview
                :data="documentStore.convertedResult.data"
                :format="documentStore.convertedResult.format"
                :file-name="getFileName()"
                @download="downloadFile"
              />
            </div>

            <div class="flex gap-3">
              <DownloadButton
                ref="downloadButton"
                class="flex-1"
                variant="success"
                :data="documentStore.convertedResult.data"
                :file-name="getFileName()"
                :mime-type="getMimeType()"
              />
              <button class="btn btn-secondary" @click="documentStore.clearResult()">
                <div class="i-carbon-close mr-1 inline-block" />
                清除结果
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
