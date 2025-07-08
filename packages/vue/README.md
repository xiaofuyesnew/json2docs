# @json2docs/vue

JSON2Docs Vue 组件包，提供 Vue 3 组件用于渲染文档。

## 安装

```bash
npm install @json2docs/vue
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 构建输出

构建后会在 `dist/` 目录生成以下文件：

- `index.es.js` - ES Module 格式
- `index.cjs.js` - CommonJS 格式
- `index.umd.js` - UMD 格式

## 使用示例

```vue
<template>
  <div>
    <Json2DocsRenderer :config="config" />
  </div>
</template>

<script>
import { Json2DocsRenderer } from '@json2docs/vue';

export default {
  components: {
    Json2DocsRenderer
  },
  data() {
    return {
      config: {
        content: [
          { text: 'Vue 文档', style: 'title' },
          { text: '通过组件渲染' }
        ],
        styles: {
          title: { fontSize: '20px', fontWeight: 'bold' }
        },
        output: { format: 'html' }
      }
    };
  }
};
</script>
```