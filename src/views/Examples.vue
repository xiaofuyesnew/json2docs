<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useDocumentStore } from '../stores/document'

const router = useRouter()
const documentStore = useDocumentStore()

const selectedExample = ref('simple')
const copied = ref(false)

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
        text: '这是一个简单的段落示例。',
      },
    ],
  },
  complex: {
    version: '1.0',
    metadata: {
      title: '复杂文档示例',
      author: 'JSON2Docs',
      created: '2025-07-24',
      description: '这是一个包含多种元素的复杂文档示例',
    },
    content: [
      {
        type: 'heading',
        level: 1,
        text: '复杂文档示例',
      },
      {
        type: 'paragraph',
        text: '这是一个包含多种元素的复杂文档示例。',
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
          { text: '项目1', level: 0 },
          { text: '项目2', level: 1 },
          { text: '项目3', level: 0 },
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
          ['数据1', '数据2', '数据3'],
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
        text: '这是一个带有背景色的段落。',
        style: {
          backgroundColor: '#EBF5FF',
          padding: '16px',
          borderRadius: '4px',
          color: '#1E40AF',
          fontWeight: 'medium',
        },
      },
      {
        type: 'paragraph',
        text: '这是一个居中对齐的段落。',
        alignment: 'center',
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

// 格式化JSON
const formattedJson = computed(() => {
  return JSON.stringify(examples[selectedExample.value], null, 2)
})

// 复制到剪贴板
function copyToClipboard() {
  navigator.clipboard.writeText(formattedJson.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// 在转换器中打开
function goToConverter() {
  documentStore.setJsonDocument(examples[selectedExample.value])
  router.push('/converter')
}
</script>

<template>
  <div>
    <h2 class="mb-6 text-2xl text-gray-900 font-bold">
      示例文档
    </h2>

    <div class="rounded-lg bg-white p-6 shadow-md">
      <p class="mb-6 text-gray-600">
        以下是一些JSON2Docs支持的文档示例，您可以查看JSON结构和预览效果。
      </p>

      <div class="mb-6">
        <label class="mb-2 block text-sm text-gray-700 font-medium">
          选择示例
        </label>
        <select
          v-model="selectedExample"
          class="w-full border border-gray-300 rounded-md px-3 py-2 md:w-64 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
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

      <div class="grid gap-6 md:grid-cols-2">
        <!-- JSON结构 -->
        <div>
          <h3 class="mb-3 flex items-center gap-2 text-lg text-gray-900 font-semibold">
            <div class="i-carbon-code text-blue-600" />
            JSON结构
          </h3>
          <pre class="max-h-96 overflow-auto rounded-md bg-gray-50 p-4 text-sm">{{ formattedJson }}</pre>

          <div class="mt-4">
            <button
              class="btn btn-primary"
              @click="copyToClipboard"
            >
              <div class="i-carbon-copy mr-1 inline-block" />
              复制JSON
            </button>
            <span v-if="copied" class="ml-2 text-sm text-green-600">
              已复制到剪贴板
            </span>
          </div>
        </div>

        <!-- 预览 -->
        <div>
          <h3 class="mb-3 flex items-center gap-2 text-lg text-gray-900 font-semibold">
            <div class="i-carbon-view text-blue-600" />
            预览
          </h3>
          <div class="max-h-96 overflow-auto border border-gray-200 rounded-md bg-white p-4">
            <div v-if="selectedExample === 'simple'">
              <h1 class="mb-4 text-2xl font-bold">
                文档标题
              </h1>
              <p class="mb-4">
                这是一个简单的段落示例。
              </p>
            </div>

            <div v-else-if="selectedExample === 'complex'">
              <h1 class="mb-4 text-2xl font-bold">
                复杂文档示例
              </h1>
              <p class="mb-4">
                这是一个包含多种元素的复杂文档示例。
              </p>

              <h2 class="mb-2 text-xl font-bold">
                列表示例
              </h2>
              <ul class="mb-4 list-disc pl-5">
                <li>项目1</li>
                <li class="ml-5">
                  项目2
                </li>
                <li>项目3</li>
              </ul>

              <h2 class="mb-2 text-xl font-bold">
                表格示例
              </h2>
              <table class="mb-4 w-full border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">
                      列1
                    </th>
                    <th class="border border-gray-300 px-4 py-2">
                      列2
                    </th>
                    <th class="border border-gray-300 px-4 py-2">
                      列3
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      数据1
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      数据2
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      数据3
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      数据4
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      数据5
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      数据6
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else-if="selectedExample === 'styled'">
              <h1 class="mb-4 text-2xl text-blue-800 font-bold">
                样式文档示例
              </h1>
              <p class="mb-4 text-gray-700">
                这是一个带有自定义样式的文档示例。
              </p>

              <h2 class="mb-2 text-xl text-blue-600 font-bold">
                样式列表
              </h2>
              <ul class="mb-4 list-disc pl-5">
                <li class="text-gray-700">
                  自定义字体
                </li>
                <li class="text-gray-700">
                  自定义颜色
                </li>
                <li class="text-gray-700">
                  自定义间距
                </li>
              </ul>

              <div class="mb-4 rounded-md bg-blue-50 p-4">
                <p class="text-blue-800 font-medium">
                  这是一个带有背景色的段落。
                </p>
              </div>

              <p class="mb-4 text-center">
                这是一个居中对齐的段落。
              </p>
            </div>
          </div>

          <div class="mt-4">
            <button
              class="btn"
              @click="goToConverter"
            >
              <div class="i-carbon-edit mr-1 inline-block" />
              在转换器中打开
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
