# @json2docs/react

JSON2Docs React 组件包，提供 React 组件用于渲染文档。

## 安装

```bash
npm install @json2docs/react
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

```jsx
import React from 'react';
import { Json2DocsRenderer } from '@json2docs/react';

function App() {
  const config = {
    content: [
      { text: 'React 文档', style: 'title' },
      { text: '通过组件渲染' }
    ],
    styles: {
      title: { fontSize: '20px', fontWeight: 'bold' }
    },
    output: { format: 'html' }
  };

  return (
    <div>
      <Json2DocsRenderer config={config} />
    </div>
  );
}

export default App;
```