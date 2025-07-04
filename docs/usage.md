# JSON2Docs 使用说明

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 使用示例

#### 基本用法

```typescript
import Json2Docs, { Document, GeneratorConfig } from './src/index';

// 创建文档数据
const document: Document = {
  metadata: {
    title: "我的文档",
    author: "作者名",
    subject: "文档主题"
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
    },
    {
      type: "list",
      listType: "unordered",
      items: ["项目1", "项目2", "项目3"]
    }
  ]
};

// 配置生成器
const config: GeneratorConfig = {
  outputFormat: 'html',
  outputPath: './output/my-document.html'
};

// 生成文档
const json2docs = new Json2Docs();
const result = await json2docs.generate(document, config);

if (result.success) {
  console.log(`文档生成成功: ${result.outputPath}`);
} else {
  console.error(`生成失败: ${result.error}`);
}

// 生成PDF
const pdfConfig: GeneratorConfig = {
  outputFormat: 'pdf',
  outputPath: './output/my-document.pdf'
};

const pdfResult = await json2docs.generate(document, pdfConfig);
if (pdfResult.success) {
  console.log(`PDF生成成功: ${pdfResult.outputPath}`);
}
```

#### 测试HTML生成

```bash
node test-html.js
```

这将在 `output/` 目录下生成一个示例HTML文件。

#### 测试PDF生成

```bash
node test-pdf.js
```

这将在 `output/` 目录下生成一个示例PDF文件。

**注意**：PDF生成需要中文字体支持，请参考 [字体配置说明](./fonts-setup.md)。

## 支持的元素类型

### 1. 文本元素 (text)
```json
{
  "type": "text",
  "content": "文本内容",
  "fontSize": "16px",
  "fontWeight": "bold",
  "color": "#333"
}
```

### 2. 标题元素 (heading)
```json
{
  "type": "heading",
  "level": 1,
  "content": "标题内容",
  "color": "#2c3e50"
}
```

### 3. 段落元素 (paragraph)
```json
{
  "type": "paragraph",
  "content": "段落内容",
  "textAlign": "justify",
  "lineHeight": "1.8"
}
```

### 4. 列表元素 (list)
```json
{
  "type": "list",
  "listType": "unordered",
  "items": ["项目1", "项目2", "项目3"],
  "style": "disc"
}
```

### 5. 表格元素 (table)
```json
{
  "type": "table",
  "headers": ["列1", "列2", "列3"],
  "rows": [
    ["数据1", "数据2", "数据3"],
    ["数据4", "数据5", "数据6"]
  ],
  "borderWidth": "1px",
  "borderColor": "#ddd"
}
```

### 6. 图片元素 (image)
```json
{
  "type": "image",
  "src": "path/to/image.jpg",
  "alt": "图片描述",
  "width": "300px",
  "height": "200px",
  "caption": "图片标题"
}
```

### 7. 分割线元素 (divider)
```json
{
  "type": "divider",
  "style": "dashed",
  "color": "#ddd",
  "width": "100%"
}
```

### 8. 容器元素 (container)
```json
{
  "type": "container",
  "layout": "vertical",
  "children": [
    {
      "type": "heading",
      "level": 2,
      "content": "容器内的标题"
    },
    {
      "type": "paragraph",
      "content": "容器内的段落"
    }
  ],
  "padding": "20px",
  "backgroundColor": "#f8f9fa"
}
```

## 样式配置

### 文档样式
```json
{
  "style": {
    "fontFamily": "'Microsoft YaHei', Arial, sans-serif",
    "fontSize": "16px",
    "lineHeight": "1.6",
    "color": "#333",
    "backgroundColor": "#fff",
    "pageSize": "A4",
    "orientation": "portrait"
  }
}
```

### 元素样式
每个元素都可以通过 `style` 属性设置CSS样式：

```json
{
  "type": "paragraph",
  "content": "带样式的段落",
  "style": {
    "color": "#e74c3c",
    "fontSize": "18px",
    "fontWeight": "bold",
    "textAlign": "center",
    "marginTop": "20px",
    "padding": "10px",
    "backgroundColor": "#f8f9fa",
    "borderRadius": "5px"
  }
}
```

## 输出格式

目前支持的输出格式：
- ✅ HTML DOM
- ✅ PDF
- 📋 DOCX (开发中)
- 📋 Vue SFC (开发中)
- 📋 React组件 (开发中)

## 项目结构

```
json2docs/
├── src/
│   ├── core/           # 核心转换引擎
│   │   └── BaseGenerator.ts
│   ├── generators/     # 各种格式生成器
│   │   └── HtmlGenerator.ts
│   ├── types/          # 类型定义
│   │   └── index.ts
│   └── index.ts        # 主入口
├── examples/           # 示例数据
│   └── sample-document.json
├── output/             # 生成的文件
├── docs/               # 文档
└── tests/              # 测试文件
```

## 开发计划

请参考 [README.md](../README.md) 中的开发计划部分。