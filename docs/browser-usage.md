# 浏览器环境使用说明

## 概述

JSON2Docs 完全支持浏览器环境，可以在前端应用中直接使用。浏览器版本提供了与Node.js版本相同的功能，但针对浏览器环境进行了优化。

## 安装

### 通过 npm 安装

```bash
npm install json2docs
```

### 通过 CDN 使用

```html
<!-- 引入库 -->
<script src="https://unpkg.com/json2docs@latest/dist/browser/index.js"></script>

<!-- 引入 pdfmake（PDF生成需要） -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
```

## 基本用法

### 1. HTML 生成

```javascript
import { Json2DocsBrowser } from 'json2docs/browser';

const json2docs = new Json2DocsBrowser();

const document = {
  metadata: {
    title: "我的文档",
    author: "作者名"
  },
  content: [
    {
      type: "heading",
      level: 1,
      content: "文档标题"
    },
    {
      type: "paragraph",
      content: "这是一个段落内容。"
    }
  ]
};

// 生成HTML字符串
const html = await json2docs.toHtml(document);
console.log(html);

// 在页面中显示
document.getElementById('output').innerHTML = html;
```

### 2. PDF 生成

```javascript
// 生成PDF Blob
const blob = await json2docs.toPdf(document);

// 在新窗口打开PDF
const url = URL.createObjectURL(blob);
window.open(url, '_blank');

// 或者下载PDF
const link = document.createElement('a');
link.href = url;
link.download = 'document.pdf';
link.click();
URL.revokeObjectURL(url);
```

### 3. 一键下载PDF

```javascript
// 自动下载PDF文件
await json2docs.downloadPdf(document, 'my-document.pdf');
```

## Vue 组件使用

```vue
<template>
  <div>
    <VueRenderer
      :document="documentData"
      @rendered="onRendered"
      @error="onError"
    />
  </div>
</template>

<script>
import { VueRenderer } from 'json2docs/browser';

export default {
  components: {
    VueRenderer
  },
  data() {
    return {
      documentData: {
        metadata: {
          title: "Vue组件测试",
          author: "Vue用户"
        },
        content: [
          {
            type: "heading",
            level: 1,
            content: "Vue组件渲染"
          },
          {
            type: "paragraph",
            content: "这是通过Vue组件渲染的内容。"
          }
        ]
      }
    };
  },
  methods: {
    onRendered(result) {
      console.log('渲染完成:', result);
    },
    onError(error) {
      console.error('渲染错误:', error);
    }
  }
};
</script>
```

## React 组件使用

```jsx
import React, { useState } from 'react';
import { ReactRenderer } from 'json2docs/browser';

const DocumentViewer = () => {
  const [document] = useState({
    metadata: {
      title: "React组件测试",
      author: "React用户"
    },
    content: [
      {
        type: "heading",
        level: 1,
        content: "React组件渲染"
      },
      {
        type: "paragraph",
        content: "这是通过React组件渲染的内容。"
      }
    ]
  });

  return (
    <div>
      <ReactRenderer
        document={document}
        onRendered={(result) => console.log('渲染完成:', result)}
        onError={(error) => console.error('渲染错误:', error)}
      />
    </div>
  );
};

export default DocumentViewer;
```

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>JSON2Docs 浏览器示例</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
</head>
<body>
    <div id="app">
        <h1>JSON2Docs 浏览器示例</h1>

        <button onclick="generateHtml()">生成 HTML</button>
        <button onclick="generatePdf()">生成 PDF</button>
        <button onclick="downloadPdf()">下载 PDF</button>

        <div id="output"></div>
    </div>

    <script type="module">
        import { Json2DocsBrowser } from 'json2docs/browser';

        const json2docs = new Json2DocsBrowser();

        const document = {
            metadata: {
                title: "浏览器示例文档",
                author: "示例用户"
            },
            content: [
                {
                    type: "heading",
                    level: 1,
                    content: "浏览器环境测试"
                },
                {
                    type: "paragraph",
                    content: "这是一个在浏览器中生成的文档。"
                },
                {
                    type: "list",
                    listType: "unordered",
                    items: ["HTML 生成", "PDF 生成", "组件渲染"]
                }
            ]
        };

        window.generateHtml = async function() {
            try {
                const html = await json2docs.toHtml(document);
                document.getElementById('output').innerHTML = html;
            } catch (error) {
                console.error('HTML生成失败:', error);
            }
        };

        window.generatePdf = async function() {
            try {
                const blob = await json2docs.toPdf(document);
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch (error) {
                console.error('PDF生成失败:', error);
            }
        };

        window.downloadPdf = async function() {
            try {
                await json2docs.downloadPdf(document, 'example.pdf');
            } catch (error) {
                console.error('PDF下载失败:', error);
            }
        };
    </script>
</body>
</html>
```

## 浏览器兼容性

### 支持的浏览器

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 功能支持

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| HTML 生成 | ✅ 完全支持 | 无需额外依赖 |
| PDF 生成 | ✅ 完全支持 | 需要 pdfmake CDN |
| Vue 组件 | ✅ 完全支持 | 需要 Vue 3.x |
| React 组件 | ✅ 完全支持 | 需要 React 18.x |

## 注意事项

### 1. PDF 生成依赖

浏览器环境中的PDF生成需要加载 pdfmake 库：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
```

### 2. 网络连接

PDF生成需要网络连接来加载 pdfmake 库。如果需要在离线环境使用，可以：

1. 下载 pdfmake 库到本地
2. 使用 Service Worker 缓存
3. 使用 Webpack 等打包工具内联

### 3. 文件大小

浏览器版本会自动加载必要的依赖，但会增加页面加载时间。建议：

1. 使用 CDN 加速
2. 按需加载功能
3. 使用代码分割

### 4. 安全性

在浏览器环境中使用时，注意：

1. 验证输入的JSON数据
2. 限制文件大小
3. 处理错误情况
4. 避免XSS攻击

## 性能优化

### 1. 懒加载

```javascript
// 按需加载PDF功能
const loadPdfFeature = async () => {
    const { Json2DocsBrowser } = await import('json2docs/browser');
    return new Json2DocsBrowser();
};
```

### 2. 缓存

```javascript
// 缓存生成的HTML
const htmlCache = new Map();

const getCachedHtml = (document) => {
    const key = JSON.stringify(document);
    if (htmlCache.has(key)) {
        return htmlCache.get(key);
    }

    const html = json2docs.toHtml(document);
    htmlCache.set(key, html);
    return html;
};
```

### 3. 防抖

```javascript
// 防抖处理
let debounceTimer;

const debouncedGenerate = (document) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        json2docs.toHtml(document);
    }, 300);
};
```

## 错误处理

```javascript
try {
    const html = await json2docs.toHtml(document);
    // 处理成功结果
} catch (error) {
    if (error.message.includes('Invalid document structure')) {
        // 处理文档结构错误
        console.error('文档结构无效');
    } else if (error.message.includes('PDF generation failed')) {
        // 处理PDF生成错误
        console.error('PDF生成失败，请检查网络连接');
    } else {
        // 处理其他错误
        console.error('未知错误:', error.message);
    }
}
```