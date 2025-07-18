<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="app-footer border-t bg-white">
    <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8 sm:px-6">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="mb-3 text-sm text-gray-900 font-semibold">
            关于
          </h3>
          <p class="text-sm text-gray-600">
            JSON2Docs是一个通用的JSON结构化文档数据转换器，支持转换为HTML、PDF和DOCX格式。
          </p>
        </div>

        <div>
          <h3 class="mb-3 text-sm text-gray-900 font-semibold">
            链接
          </h3>
          <ul class="text-sm space-y-2">
            <li>
              <router-link to="/" class="text-gray-600 hover:text-blue-600">
                首页
              </router-link>
            </li>
            <li>
              <router-link to="/converter" class="text-gray-600 hover:text-blue-600">
                转换器
              </router-link>
            </li>
            <li>
              <router-link to="/examples" class="text-gray-600 hover:text-blue-600">
                示例
              </router-link>
            </li>
            <li>
              <router-link to="/docs" class="text-gray-600 hover:text-blue-600">
                文档
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 text-sm text-gray-900 font-semibold">
            资源
          </h3>
          <ul class="text-sm space-y-2">
            <li>
              <a href="https://github.com/json2docs/converter" target="_blank" rel="noopener" class="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                <div class="i-carbon-logo-github" />
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/@json2docs/converter" target="_blank" rel="noopener" class="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                <div class="i-carbon-package" />
                NPM
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 border-t border-gray-200 pt-6 text-center">
        <p class="text-sm text-gray-500">
          © {{ currentYear }} JSON2Docs. 通用的JSON结构化文档数据转换器。
        </p>
      </div>
    </div>
  </footer>
</template>
