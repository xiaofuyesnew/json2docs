<script setup>
import { computed } from 'vue'
import VirtualScrollList from './VirtualScrollList.vue'

const props = defineProps({
  document: {
    type: Object,
    default: null,
  },
  useVirtualScroll: {
    type: Boolean,
    default: true,
  },
  maxItemsBeforeVirtualScroll: {
    type: Number,
    default: 100,
  },
})

// 判断是否需要使用虚拟滚动
const shouldUseVirtualScroll = computed(() => {
  return props.useVirtualScroll
    && props.document?.content?.length > props.maxItemsBeforeVirtualScroll
})

// 计算内容块的预估高度
function getBlockHeight(block) {
  switch (block.type) {
    case 'heading':
      return block.level <= 2 ? 60 : 40
    case 'paragraph':
      return Math.max(50, (block.text?.length || 0) / 80 * 20 + 30)
    case 'list':
      return (block.items?.length || 0) * 25 + 20
    case 'table':
      return (block.rows?.length || 0) * 35 + 50
    case 'image':
      return block.height || 200
    default:
      return 50
  }
}

// 处理列表项文本
function getItemText(item) {
  return typeof item === 'string' ? item : item.text
}

// 处理列表项级别
function getItemLevel(item) {
  return typeof item === 'object' && item.level ? item.level : 0
}

// 简单的Markdown格式化
function formatMarkdown(text) {
  if (!text)
    return ''

  // 转义HTML特殊字符
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 处理粗体 **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 处理斜体 *text*
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 处理代码 `code`
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')

  // 处理链接 [text](url)
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')

  return formatted
}
</script>

<template>
  <div class="document-preview">
    <div v-if="!document" class="py-8 text-center text-gray-500">
      没有可预览的文档
    </div>

    <!-- 大文档使用虚拟滚动 -->
    <div v-else-if="shouldUseVirtualScroll" class="preview-content">
      <div class="mb-2 text-sm text-gray-500">
        <div class="i-carbon-info mr-1 inline-block" />
        大型文档 ({{ document.content.length }} 个内容块) - 已启用虚拟滚动优化
      </div>

      <VirtualScrollList
        :items="document.content"
        :item-height="60"
        :container-height="500"
        :buffer="10"
      >
        <template #default="{ item: block }">
          <div class="preview-block" :style="{ minHeight: `${getBlockHeight(block)}px` }">
            <!-- 标题 -->
            <h1 v-if="block.type === 'heading' && block.level === 1" class="mb-4 text-2xl font-bold">
              {{ block.text }}
            </h1>
            <h2 v-else-if="block.type === 'heading' && block.level === 2" class="mb-3 text-xl font-bold">
              {{ block.text }}
            </h2>
            <h3 v-else-if="block.type === 'heading' && block.level === 3" class="mb-2 text-lg font-bold">
              {{ block.text }}
            </h3>
            <h4 v-else-if="block.type === 'heading' && block.level === 4" class="mb-2 text-base font-bold">
              {{ block.text }}
            </h4>
            <h5 v-else-if="block.type === 'heading' && block.level === 5" class="mb-2 text-sm font-bold">
              {{ block.text }}
            </h5>
            <h6 v-else-if="block.type === 'heading' && block.level === 6" class="mb-2 text-xs font-bold">
              {{ block.text }}
            </h6>

            <!-- 段落 -->
            <p v-else-if="block.type === 'paragraph'" class="mb-4" :style="{ textAlign: block.alignment || 'left' }">
              <span v-html="formatMarkdown(block.text)" />
            </p>

            <!-- 列表 -->
            <ul v-else-if="block.type === 'list' && block.listType === 'unordered'" class="mb-4 list-disc pl-5">
              <li
                v-for="(item, i) in block.items" :key="i"
                :style="{ marginLeft: `${getItemLevel(item) * 20}px` }"
                v-html="formatMarkdown(getItemText(item))"
              />
            </ul>
            <ol v-else-if="block.type === 'list' && block.listType === 'ordered'" class="mb-4 list-decimal pl-5">
              <li
                v-for="(item, i) in block.items" :key="i"
                :style="{ marginLeft: `${getItemLevel(item) * 20}px` }"
                v-html="formatMarkdown(getItemText(item))"
              />
            </ol>

            <!-- 表格 -->
            <table v-else-if="block.type === 'table'" class="mb-4 w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th
                    v-for="(header, i) in block.headers"
                    :key="i"
                    class="border border-gray-300 px-4 py-2"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in block.rows" :key="i" :class="i % 2 === 1 ? 'bg-gray-50' : ''">
                  <td
                    v-for="(cell, j) in row"
                    :key="j"
                    class="border border-gray-300 px-4 py-2"
                    v-html="formatMarkdown(cell)"
                  />
                </tr>
              </tbody>
            </table>

            <!-- 图片 -->
            <div v-else-if="block.type === 'image'" class="mb-4 text-center">
              <img
                :src="block.src"
                :alt="block.alt || ''"
                :width="block.width"
                :height="block.height"
                class="max-w-full"
              >
              <div v-if="block.alt" class="mt-1 text-sm text-gray-500">
                {{ block.alt }}
              </div>
            </div>
          </div>
        </template>
      </VirtualScrollList>
    </div>

    <!-- 小文档使用常规渲染 -->
    <div v-else class="preview-content">
      <div v-for="(block, index) in document.content" :key="index">
        <!-- 标题 -->
        <h1 v-if="block.type === 'heading' && block.level === 1" class="mb-4 text-2xl font-bold">
          {{ block.text }}
        </h1>
        <h2 v-else-if="block.type === 'heading' && block.level === 2" class="mb-3 text-xl font-bold">
          {{ block.text }}
        </h2>
        <h3 v-else-if="block.type === 'heading' && block.level === 3" class="mb-2 text-lg font-bold">
          {{ block.text }}
        </h3>
        <h4 v-else-if="block.type === 'heading' && block.level === 4" class="mb-2 text-base font-bold">
          {{ block.text }}
        </h4>
        <h5 v-else-if="block.type === 'heading' && block.level === 5" class="mb-2 text-sm font-bold">
          {{ block.text }}
        </h5>
        <h6 v-else-if="block.type === 'heading' && block.level === 6" class="mb-2 text-xs font-bold">
          {{ block.text }}
        </h6>

        <!-- 段落 -->
        <p v-else-if="block.type === 'paragraph'" class="mb-4" :style="{ textAlign: block.alignment || 'left' }">
          <span v-html="formatMarkdown(block.text)" />
        </p>

        <!-- 列表 -->
        <ul v-else-if="block.type === 'list' && block.listType === 'unordered'" class="mb-4 list-disc pl-5">
          <li
            v-for="(item, i) in block.items" :key="i"
            :style="{ marginLeft: `${getItemLevel(item) * 20}px` }"
            v-html="formatMarkdown(getItemText(item))"
          />
        </ul>
        <ol v-else-if="block.type === 'list' && block.listType === 'ordered'" class="mb-4 list-decimal pl-5">
          <li
            v-for="(item, i) in block.items" :key="i"
            :style="{ marginLeft: `${getItemLevel(item) * 20}px` }"
            v-html="formatMarkdown(getItemText(item))"
          />
        </ol>

        <!-- 表格 -->
        <table v-else-if="block.type === 'table'" class="mb-4 w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th
                v-for="(header, i) in block.headers"
                :key="i"
                class="border border-gray-300 px-4 py-2"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in block.rows" :key="i" :class="i % 2 === 1 ? 'bg-gray-50' : ''">
              <td
                v-for="(cell, j) in row"
                :key="j"
                class="border border-gray-300 px-4 py-2"
                v-html="formatMarkdown(cell)"
              />
            </tr>
          </tbody>
        </table>

        <!-- 图片 -->
        <div v-else-if="block.type === 'image'" class="mb-4 text-center">
          <img
            :src="block.src"
            :alt="block.alt || ''"
            :width="block.width"
            :height="block.height"
            class="max-w-full"
          >
          <div v-if="block.alt" class="mt-1 text-sm text-gray-500">
            {{ block.alt }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-block {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.preview-block:last-child {
  border-bottom: none;
}
</style>
