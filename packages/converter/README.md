# @json2docs/converter

JSON文档转换器是一个用于将JSON结构化文档数据转换为HTML、PDF和DOCX格式的JavaScript库。

## 功能特点

- 支持将JSON文档转换为HTML、PDF和DOCX格式
- 提供统一的API接口
- 支持自定义样式和格式
- 完整的错误处理机制
- 零依赖的HTML生成
- 使用pdf-lib生成PDF文件
- 使用docx库生成DOCX文件

## 安装

```bash
npm install @json2docs/converter
# 或
pnpm add @json2docs/converter
```

## 基本用法

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
  ],
  styles: {
    // 自定义样式
  }
}

// 转换为HTML
const htmlResult = await converter.convert(jsonDocument, 'html')
console.log(htmlResult.data) // HTML字符串

// 转换为PDF
const pdfResult = await converter.convert(jsonDocument, 'pdf')
// pdfResult.data 是 Uint8Array，可以保存为文件

// 转换为DOCX
const docxResult = await converter.convert(jsonDocument, 'docx')
// docxResult.data 是 Uint8Array，可以保存为文件
```

## JSON文档格式规范

JSON文档应遵循以下结构：

```javascript
{
  "version": "1.0",
  "metadata": {
    "title": "文档标题",
    "author": "作者",
    "created": "2025-01-24",
    "description": "文档描述"
  },
  "content": [
    // 内容块数组
  ],
  "styles": {
    // 样式定义
  }
}
```

详细的格式规范请参考 [JSON文档格式规范](./docs/json-format-spec.md)。

### 支持的内容块类型

#### 标题块

```javascript
{
  "type": "heading",
  "level": 1, // 1-6
  "text": "标题文本",
  "id": "heading-id" // 可选
}
```

#### 段落块

```javascript
{
  "type": "paragraph",
  "text": "段落文本",
  "alignment": "left" // left, center, right, justify
}
```

#### 列表块

```javascript
{
  "type": "list",
  "listType": "ordered", // ordered, unordered
  "items": [
    {
      "text": "列表项文本",
      "level": 0 // 嵌套层级
    }
  ]
}
```

#### 表格块

```javascript
{
  "type": "table",
  "headers": ["列1", "列2", "列3"],
  "rows": [
    ["数据1", "数据2", "数据3"]
  ]
}
```

#### 图片块

```javascript
{
  "type": "image",
  "src": "图片URL或base64",
  "alt": "替代文本",
  "width": 300, // 可选
  "height": 200 // 可选
}
```

### 验证JSON文档

可以使用`DocumentValidator`类验证JSON文档是否符合规范：

```javascript
import { DocumentValidator } from '@json2docs/converter'

try {
  DocumentValidator.validate(jsonData)
  console.log('文档验证通过')
}
catch (error) {
  console.error(`文档验证失败: ${error.message}`)
}
```

## API参考

### DocumentConverter

主要的转换器类，用于将JSON文档转换为不同格式。

#### 方法

- `convert(jsonData, outputFormat, options)`: 转换JSON文档到指定格式
- `validateJsonDocument(jsonData)`: 验证JSON文档格式
- `getSupportedFormats()`: 获取支持的输出格式列表

### ConversionResult

转换结果类，包含转换后的数据和元数据。

#### 方法

- `toBlob()`: 将结果转换为Blob对象
- `getFileName()`: 获取推荐的文件名

## 错误处理

库使用`DocumentConverterError`类处理错误，包含以下错误代码：

- `INVALID_JSON`: 无效的JSON文档
- `UNSUPPORTED_FORMAT`: 不支持的输出格式
- `CONVERSION_FAILED`: 转换失败
- `VALIDATION_ERROR`: 验证错误

## 许可证

MIT
