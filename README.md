# JSON2Docs

一个通用的JSON结构化文档数据转换器，支持将JSON文档转换为HTML、PDF和DOCX格式。

## 项目结构

本项目采用monorepo结构，包含以下部分：

- **转换器库**: 位于`packages/converter`目录，提供核心转换功能
- **Vue3 SPA应用**: 位于根目录，提供可视化界面和演示功能

## 技术栈

- **前端**: Vue3, Vue Router, Pinia, UnoCSS
- **构建工具**: Vite
- **代码规范**: ESLint (@antfu/eslint-config)
- **包管理**: pnpm workspace
- **Git钩子**: simple-git-hooks + lint-staged
- **PDF生成**: pdf-lib
- **DOCX生成**: docx

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

## 转换器库使用方法

```javascript
import { DocumentConverter } from '@json2docs/converter'

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

// 转换为PDF
const pdfResult = await converter.convert(jsonDocument, 'pdf')

// 转换为DOCX
const docxResult = await converter.convert(jsonDocument, 'docx')
```

## JSON文档格式规范

详细的JSON文档格式规范请参考[转换器库文档](./packages/converter/README.md)。

## 许可证

MIT
