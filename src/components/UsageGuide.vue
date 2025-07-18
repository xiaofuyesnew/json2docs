<script setup>
import { ref } from 'vue'

const activeTab = ref('overview')

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
        text: '这是一个包含多种元素的复杂文档示例。',
      },
      {
        type: 'list',
        listType: 'unordered',
        items: [
          '项目1',
          { text: '项目2', level: 1 },
          '项目3',
        ],
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
  errorDemo: {
    version: '1.0',
    metadata: {
      title: '错误处理示例',
      author: 'JSON2Docs',
      created: '2025-07-24',
      description: '演示各种错误情况和处理方式',
    },
    content: [
      {
        type: 'heading',
        level: 1,
        text: '错误处理演示',
      },
      {
        type: 'paragraph',
        text: '本示例展示了常见的错误情况和系统的处理方式。',
      },
      {
        type: 'list',
        listType: 'ordered',
        items: [
          '格式验证错误',
          '内容块类型错误',
          '数据结构错误',
          '转换过程错误',
        ],
      },
    ],
  },
}

const copyStatus = ref('')

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    copyStatus.value = '复制成功！'
    setTimeout(() => {
      copyStatus.value = ''
    }, 2000)
  }).catch(() => {
    copyStatus.value = '复制失败，请手动复制'
    setTimeout(() => {
      copyStatus.value = ''
    }, 3000)
  })
}
</script>

<template>
  <div class="usage-guide">
    <div class="mb-6">
      <h2 class="mb-4 text-2xl text-gray-900 font-bold">
        使用指南
      </h2>
      <p class="text-gray-600">
        了解如何使用JSON文档转换器，包括格式规范、示例数据和最佳实践。
      </p>
    </div>

    <!-- 标签页导航 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="flex -mb-px space-x-8">
        <button
          class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
          :class="activeTab === 'overview'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          @click="activeTab = 'overview'"
        >
          概述
        </button>
        <button
          class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
          :class="activeTab === 'format'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          @click="activeTab = 'format'"
        >
          格式规范
        </button>
        <button
          class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
          :class="activeTab === 'examples'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          @click="activeTab = 'examples'"
        >
          示例数据
        </button>
        <button
          class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
          :class="activeTab === 'tips'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          @click="activeTab = 'tips'"
        >
          使用技巧
        </button>
        <button
          class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
          :class="activeTab === 'troubleshooting'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          @click="activeTab = 'troubleshooting'"
        >
          故障排除
        </button>
      </nav>
    </div>

    <!-- 概述标签页 -->
    <div v-if="activeTab === 'overview'" class="tab-content">
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-lg text-gray-900 font-semibold">
          什么是JSON文档转换器？
        </h3>
        <p class="mb-4 text-gray-600">
          JSON文档转换器是一个强大的工具，可以将结构化的JSON文档数据转换为HTML、PDF和DOCX格式。
          它支持常见的文档元素，如标题、段落、列表、表格和图片。
        </p>

        <h4 class="text-md mb-3 text-gray-900 font-medium">
          主要特性
        </h4>
        <ul class="mb-6 text-gray-600 space-y-2">
          <li class="flex items-start">
            <div class="i-carbon-checkmark-filled mr-2 mt-1 text-green-500" />
            支持多种输出格式：HTML、PDF、DOCX
          </li>
          <li class="flex items-start">
            <div class="i-carbon-checkmark-filled mr-2 mt-1 text-green-500" />
            丰富的文档元素支持：标题、段落、列表、表格、图片
          </li>
          <li class="flex items-start">
            <div class="i-carbon-checkmark-filled mr-2 mt-1 text-green-500" />
            实时JSON格式验证和错误提示
          </li>
          <li class="flex items-start">
            <div class="i-carbon-checkmark-filled mr-2 mt-1 text-green-500" />
            转换进度指示和状态反馈
          </li>
          <li class="flex items-start">
            <div class="i-carbon-checkmark-filled mr-2 mt-1 text-green-500" />
            样式自定义和格式化选项
          </li>
        </ul>

        <h4 class="text-md mb-3 text-gray-900 font-medium">
          使用流程
        </h4>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="mb-2 flex items-center">
              <div class="mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                1
              </div>
              <h5 class="text-gray-900 font-medium">
                输入JSON
              </h5>
            </div>
            <p class="text-sm text-gray-600">
              在左侧编辑器中输入或粘贴符合规范的JSON文档数据
            </p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="mb-2 flex items-center">
              <div class="mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                2
              </div>
              <h5 class="text-gray-900 font-medium">
                选择格式
              </h5>
            </div>
            <p class="text-sm text-gray-600">
              选择目标输出格式（HTML、PDF或DOCX）
            </p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="mb-2 flex items-center">
              <div class="mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                3
              </div>
              <h5 class="text-gray-900 font-medium">
                转换下载
              </h5>
            </div>
            <p class="text-sm text-gray-600">
              点击转换按钮，等待处理完成后下载结果文件
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 格式规范标签页 -->
    <div v-if="activeTab === 'format'" class="tab-content">
      <div class="space-y-6">
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg text-gray-900 font-semibold">
            JSON文档格式规范
          </h3>

          <h4 class="text-md mb-3 text-gray-900 font-medium">
            基础结构
          </h4>
          <div class="mb-4 rounded-md bg-gray-50 p-4">
            <pre class="text-sm text-gray-800"><code>{
  "version": "1.0",
  "metadata": {
    "title": "文档标题",
    "author": "作者",
    "created": "2025-07-24",
    "description": "文档描述"
  },
  "content": [
    // 内容块数组
  ],
  "styles": {
    // 可选的样式配置
  }
}</code></pre>
          </div>

          <h4 class="text-md mb-3 text-gray-900 font-medium">
            支持的内容块类型
          </h4>

          <div class="space-y-4">
            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="mb-2 text-gray-900 font-medium">
                标题 (heading)
              </h5>
              <div class="mb-2 rounded-md bg-gray-50 p-3">
                <pre class="text-sm text-gray-800"><code>{
  "type": "heading",
  "level": 1,  // 1-6
  "text": "标题文本"
}</code></pre>
              </div>
              <p class="text-sm text-gray-600">
                level字段指定标题级别（1-6），对应HTML的h1-h6标签。
              </p>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="mb-2 text-gray-900 font-medium">
                段落 (paragraph)
              </h5>
              <div class="mb-2 rounded-md bg-gray-50 p-3">
                <pre class="text-sm text-gray-800"><code>{
  "type": "paragraph",
  "text": "段落文本",
  "alignment": "left"  // left, center, right, justify
}</code></pre>
              </div>
              <p class="text-sm text-gray-600">
                支持文本对齐方式设置，默认为左对齐。
              </p>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="mb-2 text-gray-900 font-medium">
                列表 (list)
              </h5>
              <div class="mb-2 rounded-md bg-gray-50 p-3">
                <pre class="text-sm text-gray-800"><code>{
  "type": "list",
  "listType": "unordered",  // ordered, unordered
  "items": [
    "简单项目",
    {
      "text": "嵌套项目",
      "level": 1  // 嵌套层级
    }
  ]
}</code></pre>
              </div>
              <p class="text-sm text-gray-600">
                支持有序和无序列表，以及多层嵌套。
              </p>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="mb-2 text-gray-900 font-medium">
                表格 (table)
              </h5>
              <div class="mb-2 rounded-md bg-gray-50 p-3">
                <pre class="text-sm text-gray-800"><code>{
  "type": "table",
  "headers": ["列1", "列2", "列3"],
  "rows": [
    ["数据1", "数据2", "数据3"],
    ["数据4", "数据5", "数据6"]
  ]
}</code></pre>
              </div>
              <p class="text-sm text-gray-600">
                表格的每一行数据数量应与表头列数保持一致。
              </p>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <h5 class="mb-2 text-gray-900 font-medium">
                图片 (image)
              </h5>
              <div class="mb-2 rounded-md bg-gray-50 p-3">
                <pre class="text-sm text-gray-800"><code>{
  "type": "image",
  "src": "图片URL或base64数据",
  "alt": "替代文本",
  "width": 300,
  "height": 200
}</code></pre>
              </div>
              <p class="text-sm text-gray-600">
                支持URL链接和base64编码的图片数据。建议提供alt文本以提高可访问性。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 示例数据标签页 -->
    <div v-if="activeTab === 'examples'" class="tab-content">
      <div class="space-y-6">
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg text-gray-900 font-semibold">
            示例JSON数据
          </h3>

          <div class="space-y-6">
            <div>
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-md text-gray-900 font-medium">
                  简单文档示例
                </h4>
                <button
                  class="btn-sm btn btn-secondary"
                  :class="{ 'btn-success': copyStatus }"
                  @click="copyToClipboard(JSON.stringify(examples.simple, null, 2))"
                >
                  <div class="i-carbon-copy mr-1" />
                  {{ copyStatus || '复制' }}
                </button>
              </div>
              <div class="rounded-md bg-gray-50 p-4">
                <pre class="overflow-x-auto text-sm text-gray-800"><code>{{ JSON.stringify(examples.simple, null, 2) }}</code></pre>
              </div>
            </div>

            <div>
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-md text-gray-900 font-medium">
                  复杂文档示例
                </h4>
                <button
                  class="btn-sm btn btn-secondary"
                  :class="{ 'btn-success': copyStatus }"
                  @click="copyToClipboard(JSON.stringify(examples.complex, null, 2))"
                >
                  <div class="i-carbon-copy mr-1" />
                  {{ copyStatus || '复制' }}
                </button>
              </div>
              <div class="rounded-md bg-gray-50 p-4">
                <pre class="overflow-x-auto text-sm text-gray-800"><code>{{ JSON.stringify(examples.complex, null, 2) }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用技巧标签页 -->
    <div v-if="activeTab === 'tips'" class="tab-content">
      <div class="space-y-6">
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg text-gray-900 font-semibold">
            使用技巧和最佳实践
          </h3>

          <div class="space-y-6">
            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-idea mr-2 inline-block text-blue-500" />
                JSON编写技巧
              </h4>
              <ul class="text-gray-600 space-y-2">
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  使用JSON编辑器的格式化功能保持代码整洁
                </li>
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  先从简单示例开始，逐步添加复杂元素
                </li>
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  注意JSON语法：字符串使用双引号，对象和数组的逗号分隔
                </li>
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  利用实时验证功能及时发现和修复错误
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-warning mr-2 inline-block text-yellow-500" />
                常见错误和解决方案
              </h4>
              <div class="space-y-3">
                <div class="border border-yellow-200 rounded-lg bg-yellow-50 p-4">
                  <h5 class="mb-1 text-yellow-800 font-medium">
                    JSON语法错误
                  </h5>
                  <p class="mb-2 text-sm text-yellow-700">
                    常见原因：多余的逗号、缺少引号、括号不匹配
                  </p>
                  <p class="text-sm text-yellow-700">
                    解决方案：使用格式化功能，检查语法高亮提示
                  </p>
                </div>

                <div class="border border-yellow-200 rounded-lg bg-yellow-50 p-4">
                  <h5 class="mb-1 text-yellow-800 font-medium">
                    内容块类型错误
                  </h5>
                  <p class="mb-2 text-sm text-yellow-700">
                    常见原因：使用了不支持的type值
                  </p>
                  <p class="text-sm text-yellow-700">
                    解决方案：确保type值为：heading, paragraph, list, table, image
                  </p>
                </div>

                <div class="border border-yellow-200 rounded-lg bg-yellow-50 p-4">
                  <h5 class="mb-1 text-yellow-800 font-medium">
                    表格数据不匹配
                  </h5>
                  <p class="mb-2 text-sm text-yellow-700">
                    常见原因：表格行的列数与表头不一致
                  </p>
                  <p class="text-sm text-yellow-700">
                    解决方案：确保每行数据的数量与headers数组长度相同
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-rocket mr-2 inline-block text-green-500" />
                性能优化建议
              </h4>
              <ul class="text-gray-600 space-y-2">
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  对于大型文档，建议分段处理，避免单个JSON过大
                </li>
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  图片建议使用适当的尺寸，避免过大的base64数据
                </li>
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  利用缓存机制，相同的JSON和格式组合会复用转换结果
                </li>
                <li class="flex items-start">
                  <div class="i-carbon-dot-mark mr-2 mt-1 text-gray-400" />
                  转换过程中避免频繁修改JSON，等编辑完成后再转换
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-settings mr-2 inline-block text-purple-500" />
                格式特定建议
              </h4>
              <div class="grid gap-4 md:grid-cols-3">
                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    HTML格式
                  </h5>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• 适合网页展示</li>
                    <li>• 支持实时预览</li>
                    <li>• 可自定义CSS样式</li>
                  </ul>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    PDF格式
                  </h5>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• 适合打印和分享</li>
                    <li>• 固定布局格式</li>
                    <li>• 跨平台兼容性好</li>
                  </ul>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    DOCX格式
                  </h5>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• 适合进一步编辑</li>
                    <li>• Word兼容性</li>
                    <li>• 支持复杂格式</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 故障排除标签页 -->
    <div v-if="activeTab === 'troubleshooting'" class="tab-content">
      <div class="space-y-6">
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg text-gray-900 font-semibold">
            故障排除指南
          </h3>

          <div class="space-y-6">
            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-debug mr-2 inline-block text-red-500" />
                常见错误及解决方案
              </h4>

              <div class="space-y-4">
                <div class="border border-red-200 rounded-lg bg-red-50 p-4">
                  <h5 class="mb-2 text-red-800 font-medium">
                    🚨 JSON语法错误
                  </h5>
                  <div class="mb-2 text-sm text-red-700">
                    <strong>常见表现:</strong> "Unexpected token", "Unexpected end of JSON input"
                  </div>
                  <div class="mb-3 text-sm text-red-700">
                    <strong>可能原因:</strong>
                    <ul class="ml-4 mt-1 list-disc">
                      <li>多余的逗号（如对象或数组最后一个元素后的逗号）</li>
                      <li>缺少引号或引号不匹配</li>
                      <li>括号不配对（{} 或 []）</li>
                      <li>使用了单引号而非双引号</li>
                    </ul>
                  </div>
                  <div class="text-sm text-red-700">
                    <strong>解决方案:</strong>
                    <ul class="ml-4 mt-1 list-disc">
                      <li>使用"格式化"按钮检查语法</li>
                      <li>确保所有字符串使用双引号</li>
                      <li>检查括号配对</li>
                      <li>移除多余的逗号</li>
                    </ul>
                  </div>
                </div>

                <div class="border border-yellow-200 rounded-lg bg-yellow-50 p-4">
                  <h5 class="mb-2 text-yellow-800 font-medium">
                    ⚠️ 文档结构错误
                  </h5>
                  <div class="mb-2 text-sm text-yellow-700">
                    <strong>常见表现:</strong> "缺少type字段", "不支持的类型", "必须是数组"
                  </div>
                  <div class="mb-3 text-sm text-yellow-700">
                    <strong>解决方案:</strong>
                    <ul class="ml-4 mt-1 list-disc">
                      <li>确保每个内容块都有type字段</li>
                      <li>使用支持的类型：heading, paragraph, list, table, image</li>
                      <li>检查content字段是否为数组格式</li>
                      <li>参考示例数据了解正确格式</li>
                    </ul>
                  </div>
                </div>

                <div class="border border-blue-200 rounded-lg bg-blue-50 p-4">
                  <h5 class="mb-2 text-blue-800 font-medium">
                    ℹ️ 转换失败
                  </h5>
                  <div class="mb-2 text-sm text-blue-700">
                    <strong>常见表现:</strong> "转换失败", "生成错误"
                  </div>
                  <div class="mb-3 text-sm text-blue-700">
                    <strong>解决方案:</strong>
                    <ul class="ml-4 mt-1 list-disc">
                      <li>检查网络连接</li>
                      <li>尝试刷新页面重新转换</li>
                      <li>简化文档内容后重试</li>
                      <li>检查图片链接是否有效</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-tools mr-2 inline-block text-blue-500" />
                调试工具和技巧
              </h4>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    实时验证
                  </h5>
                  <p class="mb-2 text-sm text-gray-600">
                    输入JSON时会实时显示验证结果，包括错误和警告信息。
                  </p>
                  <div class="text-xs text-gray-500">
                    💡 绿色表示有效，红色表示错误，黄色表示警告
                  </div>
                </div>

                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    格式化工具
                  </h5>
                  <p class="mb-2 text-sm text-gray-600">
                    使用"格式化"按钮可以自动整理JSON格式，便于查看和调试。
                  </p>
                  <div class="text-xs text-gray-500">
                    💡 格式化后更容易发现语法错误
                  </div>
                </div>

                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    示例数据
                  </h5>
                  <p class="mb-2 text-sm text-gray-600">
                    提供多种示例数据，可以作为参考或起始模板。
                  </p>
                  <div class="text-xs text-gray-500">
                    💡 从简单示例开始，逐步添加复杂元素
                  </div>
                </div>

                <div class="border border-gray-200 rounded-lg p-4">
                  <h5 class="mb-2 text-gray-900 font-medium">
                    错误统计
                  </h5>
                  <p class="mb-2 text-sm text-gray-600">
                    系统会记录错误统计信息，帮助识别常见问题。
                  </p>
                  <div class="text-xs text-gray-500">
                    💡 在浏览器控制台输入 __getErrorStats() 查看
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-help mr-2 inline-block text-green-500" />
                获取帮助
              </h4>

              <div class="rounded-lg bg-gray-50 p-4">
                <div class="space-y-3">
                  <div class="flex items-start">
                    <div class="i-carbon-document mr-2 mt-1 text-blue-500" />
                    <div>
                      <div class="text-sm text-gray-900 font-medium">
                        查看文档
                      </div>
                      <div class="text-xs text-gray-600">
                        参考格式规范和示例数据了解正确用法
                      </div>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="i-carbon-debug mr-2 mt-1 text-red-500" />
                    <div>
                      <div class="text-sm text-gray-900 font-medium">
                        开发者工具
                      </div>
                      <div class="text-xs text-gray-600">
                        按F12打开浏览器开发者工具查看详细错误信息
                      </div>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="i-carbon-reset mr-2 mt-1 text-orange-500" />
                    <div>
                      <div class="text-sm text-gray-900 font-medium">
                        重置应用
                      </div>
                      <div class="text-xs text-gray-600">
                        如果遇到持续问题，尝试刷新页面或清除浏览器缓存
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-md mb-3 text-gray-900 font-medium">
                <div class="i-carbon-code mr-2 inline-block text-purple-500" />
                错误示例演示
              </h4>

              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm text-gray-700">点击按钮复制错误示例到剪贴板，用于测试错误处理：</span>
                <button
                  class="btn-sm btn btn-secondary"
                  :class="{ 'btn-success': copyStatus }"
                  @click="copyToClipboard(JSON.stringify(examples.errorDemo, null, 2))"
                >
                  <div class="i-carbon-copy mr-1" />
                  {{ copyStatus || '复制错误示例' }}
                </button>
              </div>

              <div class="rounded-md bg-gray-50 p-4">
                <pre class="overflow-x-auto text-sm text-gray-800"><code>{{ JSON.stringify(examples.errorDemo, null, 2) }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  min-height: 400px;
}

pre code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.4;
}
</style>
