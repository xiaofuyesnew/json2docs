<template>
  <div class="container">
    <div class="header">
      <h1>JSON2Docs - Vue 组件示例</h1>
      <p>Vue 3 组件集成演示</p>
    </div>

    <div class="nav">
      <a href="../basic/index.html">基础示例</a>
      <a href="index.html" class="active">Vue 组件</a>
      <a href="../react/index.html">React 组件</a>
    </div>

    <div class="content">
      <div class="demo-section">
        <h2>Vue 组件渲染示例</h2>
        <p>使用 Vue 组件渲染 JSON 配置的文档内容。</p>

        <div class="demo-controls">
          <label for="jsonInput">JSON 配置：</label>
          <textarea
            id="jsonInput"
            class="json-editor"
            v-model="jsonConfig"
            placeholder="请输入 JSON 配置..."
          ></textarea>
        </div>

        <div class="demo-controls">
          <button @click="loadSampleData">加载示例数据</button>
          <button @click="clearDocument">清空文档</button>
          <button @click="updateDocument">更新文档</button>
        </div>

        <div class="demo-controls">
          <label>Vue 组件渲染结果：</label>
          <div class="vue-renderer">
            <vue-renderer
              :document="documentData"
              @rendered="onRendered"
              @error="onError"
            />
          </div>
        </div>

        <div v-if="renderStatus" class="demo-controls">
          <div v-if="renderStatus.success" class="success">
            ✅ {{ renderStatus.message }}
          </div>
          <div v-else class="error">
            ❌ {{ renderStatus.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueRenderer from '../../../packages/vue/src/index.js';

// 示例数据
const sampleData = {
  metadata: {
    title: 'Vue 组件示例文档',
    author: 'JSON2Docs',
    createdAt: new Date().toISOString()
  },
  content: [
    {
      type: 'heading',
      level: 1,
      content: 'Vue 组件示例文档',
      style: { color: '#42b883', textAlign: 'center' }
    },
    {
      type: 'paragraph',
      content: '这是一个使用 Vue 组件渲染的文档示例。'
    },
    {
      type: 'heading',
      level: 2,
      content: '功能特点'
    },
    {
      type: 'list',
      listType: 'unordered',
      items: [
        '响应式数据绑定',
        '实时文档更新',
        '支持多种文档元素',
        '可自定义样式'
      ]
    },
    {
      type: 'table',
      headers: ['特性', '描述', '状态'],
      rows: [
        ['响应式', '数据变化自动更新', '✅ 支持'],
        ['样式', '可自定义 CSS 样式', '✅ 支持'],
        ['交互', '支持用户交互', '✅ 支持'],
        ['性能', '高效的渲染性能', '✅ 支持']
      ]
    }
  ]
};

export default {
  name: 'App',
  components: {
    VueRenderer
  },
  data() {
    return {
      jsonConfig: JSON.stringify(sampleData, null, 2),
      documentData: sampleData,
      renderStatus: null
    };
  },
  methods: {
    loadSampleData() {
      this.jsonConfig = JSON.stringify(sampleData, null, 2);
      this.documentData = sampleData;
    },
    clearDocument() {
      this.documentData = {
        metadata: { title: '空文档' },
        content: []
      };
      this.jsonConfig = JSON.stringify(this.documentData, null, 2);
    },
    updateDocument() {
      try {
        const newData = JSON.parse(this.jsonConfig);
        this.documentData = newData;
        this.renderStatus = {
          success: true,
          message: '文档更新成功！'
        };
      } catch (error) {
        this.renderStatus = {
          success: false,
          message: `JSON 解析错误：${error.message}`
        };
      }
    },
    onRendered(result) {
      this.renderStatus = {
        success: true,
        message: '文档渲染完成！'
      };
    },
    onError(error) {
      this.renderStatus = {
        success: false,
        message: `渲染错误：${error}`
      };
    }
  }
};
</script>

<style scoped>
.content {
  padding: 30px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h2 {
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.demo-controls {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.demo-controls label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #495057;
}

.demo-controls button {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}

.demo-controls button:hover {
  background-color: #369870;
}

.json-editor {
  width: 100%;
  height: 300px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 10px;
  resize: vertical;
}

.vue-renderer {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 20px;
  background: white;
  min-height: 200px;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}
</style>