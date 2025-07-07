# JSON2Docs - 结构化数据转换库

一个强大的 JavaScript 库，用于将结构化 JSON 配置数据转换为多种格式（PDF、DOCX、HTML DOM），支持与 pdfmake 兼容的文档配置格式。

## 核心设计理念

JSON2Docs 的核心是一个接收 JSON 配置数据的函数，配置包含两个主要部分：

1. **文档内容配置** - 与 pdfmake 配置格式保持一致
2. **转换目标配置** - 指定输出格式（PDF、DOCX、HTML）

### 转换流程

- **PDF 输出**：文档配置直接交给 pdfmake 处理
- **DOCX 输出**：文档配置经过转换后交给 docx 库处理
- **HTML 输出**：生成 HTML DOM 字符串，样式用 `<style>` 标签包裹，不包含 `<html>`、`<body>`、`<head>` 等标签，专注于文档结构，可直接用于 `v-html` 指令

## 安装

```bash
npm install @json2docs/core
```

## 基本用法

```javascript
import { Json2Docs } from '@json2docs/core';

const json2docs = new Json2Docs();

// 配置数据
const config = {
  // 文档内容配置（pdfmake 格式）
  content: [
    { text: '文档标题', style: 'header' },
    { text: '这是正文内容...', margin: [0, 10, 0, 0] },
    {
      table: {
        body: [
          ['列1', '列2', '列3'],
          ['数据1', '数据2', '数据3']
        ]
      }
    }
  ],

  // 样式定义
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    }
  },

  // 转换目标配置
  output: {
    format: 'html', // 'pdf' | 'docx' | 'html'
    options: {
      // 格式特定选项
    }
  }
};

// 生成文档
const result = await json2docs.generate(config);
console.log(result.content); // HTML DOM 字符串或文件路径
```

## 支持的输出格式

### 1. PDF 输出

```javascript
const config = {
  content: [
    { text: 'PDF 文档', style: 'title' },
    { text: '使用 pdfmake 生成' }
  ],
  styles: {
    title: { fontSize: 20, bold: true }
  },
  output: {
    format: 'pdf',
    options: {
      filename: 'document.pdf'
    }
  }
};

const result = await json2docs.generate(config);
// result.outputPath 包含生成的 PDF 文件路径
```

### 2. DOCX 输出

```javascript
const config = {
  content: [
    { text: 'Word 文档', style: 'title' },
    { text: '使用 docx 库生成' }
  ],
  styles: {
    title: { fontSize: 20, bold: true }
  },
  output: {
    format: 'docx',
    options: {
      filename: 'document.docx'
    }
  }
};

const result = await json2docs.generate(config);
// result.outputPath 包含生成的 DOCX 文件路径
```

### 3. HTML DOM 输出

```javascript
const config = {
  content: [
    { text: 'HTML 文档', style: 'title' },
    { text: '可直接用于 v-html' }
  ],
  styles: {
    title: { fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }
  },
  output: {
    format: 'html'
  }
};

const result = await json2docs.generate(config);
// result.content 包含 HTML DOM 字符串，可直接用于 v-html
```

## 在 Vue 中使用

```vue
<template>
  <div v-html="htmlContent"></div>
</template>

<script>
import { Json2Docs } from '@json2docs/core';

export default {
  data() {
    return {
      htmlContent: ''
    };
  },
  async mounted() {
    const json2docs = new Json2Docs();
    const config = {
      content: [
        { text: 'Vue 中的文档', style: 'title' },
        { text: '通过 v-html 渲染' }
      ],
      styles: {
        title: { fontSize: '20px', fontWeight: 'bold' }
      },
      output: { format: 'html' }
    };

    const result = await json2docs.generate(config);
    this.htmlContent = result.content;
  }
};
</script>
```

## 在 React 中使用

```jsx
import React, { useState, useEffect } from 'react';
import { Json2Docs } from '@json2docs/core';

function DocumentRenderer() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const generateDocument = async () => {
      const json2docs = new Json2Docs();
      const config = {
        content: [
          { text: 'React 中的文档', style: 'title' },
          { text: '通过 dangerouslySetInnerHTML 渲染' }
        ],
        styles: {
          title: { fontSize: '20px', fontWeight: 'bold' }
        },
        output: { format: 'html' }
      };

      const result = await json2docs.generate(config);
      setHtmlContent(result.content);
    };

    generateDocument();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
```

## 配置格式说明

### 文档内容配置

完全兼容 pdfmake 的配置格式，支持：

- **文本元素**：`{ text: '内容' }`
- **表格**：`{ table: { body: [...] } }`
- **图片**：`{ image: 'url' }`
- **列表**：`{ ul: ['项目1', '项目2'] }`
- **样式**：`{ style: 'styleName' }`

### 样式定义

```javascript
styles: {
  title: {
    fontSize: 18,
    bold: true,
    color: '#2c3e50',
    margin: [0, 0, 0, 10]
  },
  subtitle: {
    fontSize: 14,
    bold: true,
    color: '#7f8c8d'
  }
}
```

### 输出配置

```javascript
output: {
  format: 'html', // 'pdf' | 'docx' | 'html'
  options: {
    filename: 'output.pdf', // PDF/DOCX 文件名
    // 其他格式特定选项
  }
}
```

## 项目结构

```shell
json2docs/
├── packages/
│   ├── core/              # 核心转换引擎
│   ├── react/             # React 组件包
│   └── vue/               # Vue 组件包
├── src/
│   ├── core/              # 核心生成器
│   ├── generators/        # 格式生成器
│   ├── browser/           # 浏览器兼容版本
│   └── components/        # 前端组件
├── examples/              # 使用示例
└── docs/                  # 文档
```

## 技术栈

- **JavaScript** - 核心语言
- **pdfmake** - PDF 生成
- **docx** - DOCX 生成
- **Vue 3** - Vue 组件支持
- **React 18** - React 组件支持

## 开发计划

### 已完成 ✅

- [x] 项目基础架构
- [x] 核心转换引擎设计
- [x] HTML DOM 生成器
- [x] 基础类型定义

### 进行中 🔄

- [ ] PDF 生成器（pdfmake 集成）
- [ ] DOCX 生成器（docx 库集成）
- [ ] 样式转换引擎

### 计划中 📋

- [ ] Vue 组件包
- [ ] React 组件包
- [ ] CLI 工具
- [ ] 完整文档和示例

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
