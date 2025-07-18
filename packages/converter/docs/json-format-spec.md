# JSON2Docs 文档格式规范

本文档定义了JSON2Docs转换器支持的JSON文档格式规范。

## 基本结构

JSON文档必须是一个包含以下字段的对象：

```json
{
  "version": "1.0",
  "metadata": {
    "title": "文档标题",
    "author": "作者",
    "created": "2025-07-24",
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

### 必需字段

- `version`: 文档版本号，格式为 `major.minor[.patch]`
- `content`: 内容块数组，至少包含一个内容块

### 可选字段

- `metadata`: 文档元数据
- `styles`: 文档样式定义

## 元数据

元数据是一个包含文档相关信息的对象：

```json
{
  "title": "文档标题",
  "author": "作者",
  "created": "2025-07-24",
  "description": "文档描述"
}
```

所有元数据字段都是可选的，但建议至少提供标题。

## 内容块

内容块是文档的基本组成单位，每个内容块都有一个 `type` 字段指定其类型。

### 标题块

```json
{
  "type": "heading",
  "level": 1,
  "text": "标题文本",
  "id": "heading-id"
}
```

- `level`: 标题级别，1-6
- `text`: 标题文本
- `id`: 可选，标题ID，可用于锚点链接

### 段落块

```json
{
  "type": "paragraph",
  "text": "段落文本",
  "alignment": "left"
}
```

- `text`: 段落文本
- `alignment`: 可选，文本对齐方式，可选值：`left`（默认）、`center`、`right`、`justify`
- `style`: 可选，自定义样式对象

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

- `listType`: 可选，列表类型，可选值：`ordered`（有序列表）、`unordered`（无序列表，默认）
- `items`: 列表项数组
  - `text`: 列表项文本
  - `level`: 可选，嵌套层级，默认为0

### 表格块

```json
{
  "type": "table",
  "headers": ["列1", "列2", "列3"],
  "rows": [
    ["数据1", "数据2", "数据3"],
    ["数据4", "数据5", "数据6"]
  ]
}
```

- `headers`: 表格列标题数组
- `rows`: 表格行数据数组，每行是一个字符串数组

### 图片块

```json
{
  "type": "image",
  "src": "图片URL或base64",
  "alt": "替代文本",
  "width": 300,
  "height": 200
}
```

- `src`: 图片URL或base64编码
- `alt`: 可选，图片替代文本
- `width`: 可选，图片宽度
- `height`: 可选，图片高度

## 样式

样式是一个包含文档样式定义的对象：

```json
{
  "fonts": {
    "default": "Arial, sans-serif",
    "heading": "Georgia, serif",
    "monospace": "Courier New, monospace"
  },
  "colors": {
    "text": "#333333",
    "background": "#ffffff",
    "heading": "#000000",
    "link": "#0066cc"
  },
  "sizes": {
    "baseFontSize": "16px",
    "h1": "2em",
    "h2": "1.5em",
    "h3": "1.17em",
    "h4": "1em",
    "h5": "0.83em",
    "h6": "0.67em"
  },
  "spacing": {
    "lineHeight": 1.5,
    "paragraphSpacing": "1em",
    "listItemSpacing": "0.5em"
  }
}
```

所有样式字段都是可选的，转换器会使用默认样式。

## 完整示例

```json
{
  "version": "1.0",
  "metadata": {
    "title": "示例文档",
    "author": "JSON2Docs",
    "created": "2025-07-24",
    "description": "这是一个示例文档"
  },
  "content": [
    {
      "type": "heading",
      "level": 1,
      "text": "文档标题",
      "id": "document-title"
    },
    {
      "type": "paragraph",
      "text": "这是一个段落示例。",
      "alignment": "left"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "列表示例",
      "id": "list-example"
    },
    {
      "type": "list",
      "listType": "unordered",
      "items": [
        {
          "text": "项目1",
          "level": 0
        },
        {
          "text": "项目2",
          "level": 1
        },
        {
          "text": "项目3",
          "level": 0
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "表格示例",
      "id": "table-example"
    },
    {
      "type": "table",
      "headers": ["列1", "列2", "列3"],
      "rows": [
        ["数据1", "数据2", "数据3"],
        ["数据4", "数据5", "数据6"]
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "图片示例",
      "id": "image-example"
    },
    {
      "type": "image",
      "src": "https://via.placeholder.com/300x200",
      "alt": "示例图片",
      "width": 300,
      "height": 200
    }
  ],
  "styles": {
    "fonts": {
      "default": "Arial, sans-serif",
      "heading": "Georgia, serif"
    },
    "colors": {
      "text": "#333333",
      "heading": "#000000"
    },
    "spacing": {
      "lineHeight": 1.5
    }
  }
}
```
