<script setup>
import { ref } from 'vue'

const selectedSection = ref('introduction')

const sections = [
  { id: 'introduction', title: '介绍' },
  { id: 'installation', title: '安装' },
  { id: 'usage', title: '使用方法' },
  { id: 'format', title: 'JSON文档格式' },
  { id: 'api', title: 'API参考' },
]
</script>

<template>
  <div>
    <h2 class="mb-6 text-2xl text-gray-900 font-bold">
      文档
    </h2>

    <div class="rounded-lg bg-white p-6 shadow-md">
      <div class="mb-6 flex">
        <div class="w-64 border-r pr-6">
          <h3 class="mb-4 text-lg text-gray-900 font-semibold">
            目录
          </h3>
          <ul class="space-y-2">
            <li v-for="(section, index) in sections" :key="index">
              <a
                href="#"
                class="block rounded-md px-2 py-1 transition-colors"
                :class="selectedSection === section.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'"
                @click.prevent="selectedSection = section.id"
              >
                {{ section.title }}
              </a>
            </li>
          </ul>
        </div>

        <div class="flex-1 pl-6">
          <div v-if="selectedSection === 'introduction'">
            <h3 class="mb-4 text-xl text-gray-900 font-semibold">
              介绍
            </h3>
            <p class="mb-4 text-gray-600">
              JSON2Docs是一个通用的JSON结构化文档数据转换器，可以将JSON格式的文档数据转换为HTML、PDF和DOCX格式。
              它提供了一种统一的方式来定义文档结构，然后根据需要输出不同的格式。
            </p>
            <p class="mb-4 text-gray-600">
              主要特点：
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li>支持将JSON文档转换为HTML、PDF和DOCX格式</li>
              <li>提供统一的API接口</li>
              <li>支持自定义样式和格式</li>
              <li>完整的错误处理机制</li>
              <li>零依赖的HTML生成</li>
              <li>使用pdf-lib生成PDF文件</li>
              <li>使用docx库生成DOCX文件</li>
            </ul>
          </div>

          <div v-if="selectedSection === 'installation'">
            <h3 class="mb-4 text-xl text-gray-900 font-semibold">
              安装
            </h3>
            <p class="mb-4 text-gray-600">
              您可以通过npm或pnpm安装JSON2Docs：
            </p>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">npm install @json2docs/converter</pre>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">pnpm add @json2docs/converter</pre>
            <p class="mb-4 text-gray-600">
              或者直接在浏览器中使用：
            </p>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">&lt;script src="https://unpkg.com/@json2docs/converter"&gt;&lt;/script&gt;</pre>
          </div>

          <div v-if="selectedSection === 'usage'">
            <h3 class="mb-4 text-xl text-gray-900 font-semibold">
              使用方法
            </h3>
            <p class="mb-4 text-gray-600">
              基本用法示例：
            </p>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">import { DocumentConverter } from '@json2docs/converter'

// 创建转换器实例
const converter = new DocumentConverter()

// 准备JSON文档数据
const jsonDocument = {
  version: '1.0',
  metadata: {
    title: '示例文档',
    author: '作者名称',
    created: '2025-07-24',
    description: '这是一个示例文档'
  },
  content: [
    {
      type: 'heading',
      level: 1,
      text: '文档标题'
    },
    {
      type: 'paragraph',
      text: '这是一个段落内容示例。',
      alignment: 'left'
    }
  ]
}

// 转换为HTML
const htmlResult = await converter.convert(jsonDocument, 'html')
console.log(htmlResult.data) // HTML字符串

// 转换为PDF
const pdfResult = await converter.convert(jsonDocument, 'pdf')
// pdfResult.data 是 Uint8Array，可以保存为文件

// 转换为DOCX
const docxResult = await converter.convert(jsonDocument, 'docx')
// docxResult.data 是 Uint8Array，可以保存为文件</pre>
          </div>

          <div v-if="selectedSection === 'format'">
            <h3 class="mb-4 text-xl text-gray-900 font-semibold">
              JSON文档格式
            </h3>
            <p class="mb-4 text-gray-600">
              JSON文档应遵循以下结构：
            </p>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">{
  "version": "1.0",
  "metadata": {
    "title": "文档标题",
    "author": "作者",
    "created": "2025-01-24",
    "description": "文档描述"
  },
  "content": [
    // 内容块数组
  ],
  "styles": {
    // 样式定义
  }
}</pre>
            <p class="mb-4 text-gray-600">
              支持的内容块类型：
            </p>
            <h4 class="mb-2 text-gray-900 font-semibold">
              标题块
            </h4>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">{
  "type": "heading",
  "level": 1, // 1-6
  "text": "标题文本",
  "id": "heading-id" // 可选
}</pre>
            <h4 class="mb-2 text-gray-900 font-semibold">
              段落块
            </h4>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">{
  "type": "paragraph",
  "text": "段落文本",
  "alignment": "left" // left, center, right, justify
}</pre>
            <h4 class="mb-2 text-gray-900 font-semibold">
              列表块
            </h4>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">{
  "type": "list",
  "listType": "ordered", // ordered, unordered
  "items": [
    {
      "text": "列表项文本",
      "level": 0 // 嵌套层级
    }
  ]
}</pre>
            <h4 class="mb-2 text-gray-900 font-semibold">
              表格块
            </h4>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">{
  "type": "table",
  "headers": ["列1", "列2", "列3"],
  "rows": [
    ["数据1", "数据2", "数据3"]
  ]
}</pre>
            <h4 class="mb-2 text-gray-900 font-semibold">
              图片块
            </h4>
            <pre class="mb-4 rounded-md bg-gray-50 p-4">{
  "type": "image",
  "src": "图片URL或base64",
  "alt": "替代文本",
  "width": 300, // 可选
  "height": 200 // 可选
}</pre>
          </div>

          <div v-if="selectedSection === 'api'">
            <h3 class="mb-4 text-xl text-gray-900 font-semibold">
              API参考
            </h3>
            <h4 class="mb-2 text-gray-900 font-semibold">
              DocumentConverter
            </h4>
            <p class="mb-4 text-gray-600">
              主要的转换器类，用于将JSON文档转换为不同格式。
            </p>
            <h5 class="mb-1 text-gray-900 font-medium">
              构造函数
            </h5>
            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">constructor(options = {})</pre>
            <p class="mb-4 text-gray-600">
              创建一个新的DocumentConverter实例。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>options</code> (可选): 转换器选项对象</li>
            </ul>

            <h5 class="mb-1 text-gray-900 font-medium">
              方法
            </h5>
            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">async convert(jsonData, outputFormat, options = {})</pre>
            <p class="mb-4 text-gray-600">
              转换JSON文档到指定格式。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>jsonData</code> (必需): JSON文档数据对象</li>
              <li><code>outputFormat</code> (必需): 输出格式 ('html', 'pdf', 'docx')</li>
              <li><code>options</code> (可选): 转换选项对象</li>
              <li>返回: <code>Promise&lt;ConversionResult&gt;</code> 转换结果</li>
            </ul>

            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">validateJsonDocument(jsonData)</pre>
            <p class="mb-4 text-gray-600">
              验证JSON文档格式。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>jsonData</code> (必需): 要验证的JSON文档数据对象</li>
              <li>如果验证失败，抛出 <code>DocumentConverterError</code> 异常</li>
            </ul>

            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">getSupportedFormats()</pre>
            <p class="mb-4 text-gray-600">
              获取支持的输出格式列表。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li>返回: <code>string[]</code> 支持的格式列表</li>
            </ul>

            <h4 class="mb-2 mt-6 text-gray-900 font-semibold">
              ConversionResult
            </h4>
            <p class="mb-4 text-gray-600">
              转换结果类，包含转换后的数据和元数据。
            </p>
            <h5 class="mb-1 text-gray-900 font-medium">
              构造函数
            </h5>
            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">constructor(format, data, metadata = {})</pre>
            <p class="mb-4 text-gray-600">
              创建一个新的ConversionResult实例。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>format</code> (必需): 输出格式</li>
              <li><code>data</code> (必需): 输出数据</li>
              <li><code>metadata</code> (可选): 结果元数据</li>
            </ul>

            <h5 class="mb-1 text-gray-900 font-medium">
              属性
            </h5>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>format</code>: 输出格式</li>
              <li><code>data</code>: 输出数据</li>
              <li><code>metadata</code>: 结果元数据</li>
              <li><code>timestamp</code>: 转换时间戳</li>
            </ul>

            <h5 class="mb-1 text-gray-900 font-medium">
              方法
            </h5>
            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">toBlob()</pre>
            <p class="mb-4 text-gray-600">
              将结果转换为Blob对象。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li>返回: <code>Blob</code> 数据Blob</li>
            </ul>

            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">getFileName()</pre>
            <p class="mb-4 text-gray-600">
              获取推荐的文件名。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li>返回: <code>string</code> 文件名</li>
            </ul>

            <h4 class="mb-2 mt-6 text-gray-900 font-semibold">
              DocumentConverterError
            </h4>
            <p class="mb-4 text-gray-600">
              文档转换器错误类。
            </p>
            <h5 class="mb-1 text-gray-900 font-medium">
              构造函数
            </h5>
            <pre class="mb-3 rounded-md bg-gray-50 p-3 text-sm">constructor(message, code, details = {})</pre>
            <p class="mb-4 text-gray-600">
              创建一个新的DocumentConverterError实例。
            </p>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>message</code> (必需): 错误消息</li>
              <li><code>code</code> (必需): 错误代码</li>
              <li><code>details</code> (可选): 错误详情</li>
            </ul>

            <h5 class="mb-1 text-gray-900 font-medium">
              错误代码
            </h5>
            <ul class="mb-4 list-disc pl-5 text-gray-600">
              <li><code>INVALID_JSON</code>: 无效的JSON文档</li>
              <li><code>UNSUPPORTED_FORMAT</code>: 不支持的输出格式</li>
              <li><code>CONVERSION_FAILED</code>: 转换失败</li>
              <li><code>VALIDATION_ERROR</code>: 验证错误</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
