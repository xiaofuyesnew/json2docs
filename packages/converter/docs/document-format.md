# JSON文档格式规范

本文档描述了JSON文档转换器支持的文档格式规范。

## 基础文档结构

```json
{
  "version": "1.0",
  "metadata": {
    "title": "文档标题",
    "author": "作者",
    "created": "2025-01-24",
    "description": "文档描述"
  },
  "content": [
    // 文档内容块数组
  ],
  "styles": {
    // 样式定义
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `version` | `string` | 是 | 文档格式版本，当前为"1.0" |
| `metadata` | `object` | 是 | 文档元数据 |
| `content` | `array` | 是 | 文档内容块数组 |
| `styles` | `object` | 否 | 文档样式定义 |

### 元数据字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `title` | `string` | 是 | 文档标题 |
| `author` | `string` | 否 | 文档作者 |
| `created` | `string` | 否 | 创建日期，格式为"YYYY-MM-DD" |
| `description` | `string` | 否 | 文档描述 |

## 内容块类型

### 标题块

```json
{
  "type": "heading",
  "level": 1,
  "text": "标题文本",
  "id": "heading-id"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"heading" |
| `level` | `number` | 是 | 标题级别，1-6 |
| `text` | `string` | 是 | 标题文本 |
| `id` | `string` | 否 | 标题ID，用于锚点链接 |

### 段落块

```json
{
  "type": "paragraph",
  "text": "段落文本",
  "alignment": "left"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"paragraph" |
| `text` | `string` | 是 | 段落文本 |
| `alignment` | `string` | 否 | 对齐方式，可选值: "left", "center", "right", "justify"，默认为"left" |

### 列表块

```json
{
  "type": "list",
  "listType": "ordered",
  "items": [
    {
      "text": "列表项文本",
      "level": 0
    },
    {
      "text": "嵌套列表项",
      "level": 1
    }
  ]
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"list" |
| `listType` | `string` | 是 | 列表类型，可选值: "ordered", "unordered" |
| `items` | `array` | 是 | 列表项数组 |

列表项字段:

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `text` | `string` | 是 | 列表项文本 |
| `level` | `number` | 否 | 嵌套层级，默认为0 |

### 表格块

```json
{
  "type": "table",
  "headers": ["列1", "列2", "列3"],
  "rows": [
    ["数据1", "数据2", "数据3"],
    ["数据4", "数据5", "数据6"]
  ],
  "caption": "表格标题"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"table" |
| `headers` | `array` | 否 | 表头数组，每个元素为列标题 |
| `rows` | `array` | 是 | 行数组，每个元素为一行数据数组 |
| `caption` | `string` | 否 | 表格标题 |

### 图片块

```json
{
  "type": "image",
  "src": "图片URL或base64",
  "alt": "替代文本",
  "width": 300,
  "height": 200,
  "caption": "图片说明"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"image" |
| `src` | `string` | 是 | 图片URL或base64编码 |
| `alt` | `string` | 否 | 替代文本 |
| `width` | `number` | 否 | 图片宽度 |
| `height` | `number` | 否 | 图片高度 |
| `caption` | `string` | 否 | 图片说明 |

### 分隔线块

```json
{
  "type": "divider"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"divider" |

### 代码块

```json
{
  "type": "code",
  "language": "javascript",
  "code": "console.log('Hello World');"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | `string` | 是 | 固定为"code" |
| `language` | `string` | 否 | 代码语言 |
| `code` | `string` | 是 | 代码内容 |

## 样式定义

样式定义用于自定义文档的外观。

```json
"styles": {
  "headings": {
    "fontFamily": "Arial, sans-serif",
    "color": "#333333"
  },
  "paragraphs": {
    "fontSize": "14px",
    "lineHeight": "1.5"
  },
  "tables": {
    "borderColor": "#dddddd",
    "headerBackground": "#f5f5f5"
  }
}
```

样式定义是可选的，如果未提供，将使用默认样式。
