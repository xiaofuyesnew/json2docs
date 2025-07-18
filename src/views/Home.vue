<script setup>
// 使用setup语法糖
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h2 class="mb-4 text-4xl text-gray-900 font-bold">
        JSON2Docs
      </h2>
      <p class="mx-auto max-w-3xl text-xl text-gray-600">
        通用的JSON结构化文档数据转换器，支持转换为HTML、PDF和DOCX格式。
        轻松实现文档格式转换，提高开发效率。
      </p>
      <div class="mt-8">
        <router-link
          to="/converter"
          class="btn btn-primary px-8 py-3 text-lg"
        >
          开始使用
        </router-link>
      </div>
    </div>

    <div class="grid mt-12 gap-6 md:grid-cols-3">
      <div class="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
        <div class="mb-4 text-blue-600">
          <div class="i-carbon-code text-3xl" />
        </div>
        <h4 class="mb-2 text-lg text-gray-900 font-semibold">
          HTML转换
        </h4>
        <p class="text-gray-600">
          将JSON文档转换为HTML格式，适用于网页展示和在线预览。支持自定义样式和布局。
        </p>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
        <div class="mb-4 text-red-600">
          <div class="i-carbon-document-pdf text-3xl" />
        </div>
        <h4 class="mb-2 text-lg text-gray-900 font-semibold">
          PDF转换
        </h4>
        <p class="text-gray-600">
          生成PDF文档，适用于打印和正式文档分发。使用pdf-lib库，无需服务器端支持。
        </p>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
        <div class="mb-4 text-green-600">
          <div class="i-carbon-document text-3xl" />
        </div>
        <h4 class="mb-2 text-lg text-gray-900 font-semibold">
          DOCX转换
        </h4>
        <p class="text-gray-600">
          生成Word文档格式，兼容Microsoft Word和其他办公软件。使用docx库实现。
        </p>
      </div>
    </div>

    <div class="mt-8 rounded-lg bg-white p-8 shadow-md">
      <h3 class="mb-4 text-2xl text-gray-900 font-semibold">
        为什么选择JSON2Docs？
      </h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex gap-3">
          <div class="text-blue-600">
            <div class="i-carbon-checkmark-outline text-xl" />
          </div>
          <div>
            <h4 class="text-gray-900 font-medium">
              统一的文档格式
            </h4>
            <p class="text-gray-600">
              使用JSON作为通用格式，一次定义，多种输出
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="text-blue-600">
            <div class="i-carbon-checkmark-outline text-xl" />
          </div>
          <div>
            <h4 class="text-gray-900 font-medium">
              纯前端实现
            </h4>
            <p class="text-gray-600">
              无需服务器支持，可在浏览器中直接运行
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="text-blue-600">
            <div class="i-carbon-checkmark-outline text-xl" />
          </div>
          <div>
            <h4 class="text-gray-900 font-medium">
              灵活的API
            </h4>
            <p class="text-gray-600">
              提供简单易用的API，方便集成到现有项目
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="text-blue-600">
            <div class="i-carbon-checkmark-outline text-xl" />
          </div>
          <div>
            <h4 class="text-gray-900 font-medium">
              丰富的文档元素
            </h4>
            <p class="text-gray-600">
              支持标题、段落、列表、表格、图片等多种元素
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
