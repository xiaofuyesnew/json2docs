<template>
  <div class="json2docs-vue-renderer">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在渲染文档...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="document" v-html="renderedContent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { Document } from '../types';
import { HtmlGenerator } from '../generators/HtmlGenerator';

export default defineComponent({
  name: 'Json2DocsVueRenderer',
  props: {
    document: {
      type: Object as () => Document,
      required: true
    },
    theme: {
      type: String,
      default: 'default'
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['rendered', 'error'],
  setup(props, { emit }) {
    const loading = ref(true);
    const error = ref('');
    const renderedContent = ref('');

    const renderDocument = async () => {
      try {
        loading.value = true;
        error.value = '';

        // 使用HTML生成器渲染文档
        const generator = new HtmlGenerator({
          outputFormat: 'html'
        });

        const result = await generator.generate(props.document);

        if (result.success && result.content) {
          // 提取body内容，去除完整的HTML结构
          const content = extractBodyContent(result.content);
          renderedContent.value = content;
          emit('rendered', result);
        } else {
          throw new Error(result.error || '渲染失败');
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : '未知错误';
        emit('error', error.value);
      } finally {
        loading.value = false;
      }
    };

    const extractBodyContent = (html: string): string => {
      // 提取document-content部分的内容
      const match = html.match(/<main class="document-content">([\s\S]*?)<\/main>/);
      if (match) {
        return match[1];
      }
      return html;
    };

    // 监听document变化
    watch(() => props.document, renderDocument, { deep: true });

    onMounted(() => {
      renderDocument();
    });

    return {
      loading,
      error,
      renderedContent
    };
  }
});
</script>

<style scoped>
.json2docs-vue-renderer {
  width: 100%;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  padding: 20px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}

.document {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.document :deep(h1), .document :deep(h2), .document :deep(h3),
.document :deep(h4), .document :deep(h5), .document :deep(h6) {
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 15px;
}

.document :deep(h1) { font-size: 2em; }
.document :deep(h2) { font-size: 1.8em; }
.document :deep(h3) { font-size: 1.6em; }
.document :deep(h4) { font-size: 1.4em; }
.document :deep(h5) { font-size: 1.2em; }
.document :deep(h6) { font-size: 1em; }

.document :deep(p) {
  margin-bottom: 15px;
  text-align: justify;
}

.document :deep(ul), .document :deep(ol) {
  margin-bottom: 15px;
  padding-left: 30px;
}

.document :deep(li) {
  margin-bottom: 5px;
}

.document :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.document :deep(th), .document :deep(td) {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.document :deep(th) {
  background-color: #f8f9fa;
  font-weight: bold;
}

.document :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
}

.document :deep(.image-caption) {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 10px;
}

.document :deep(.divider) {
  border: none;
  height: 1px;
  background-color: #ddd;
  margin: 30px 0;
}

.document :deep(.container) {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}
</style>