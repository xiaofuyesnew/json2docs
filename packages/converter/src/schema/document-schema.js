/**
 * JSON文档格式规范定义
 */

/**
 * 文档版本
 * @type {object}
 */
export const versionSchema = {
  type: 'string',
  pattern: '^\\d+\\.\\d+(\\.\\d+)?$',
  description: '文档版本号，格式为 major.minor[.patch]',
}

/**
 * 元数据模式
 * @type {object}
 */
export const metadataSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: '文档标题',
    },
    author: {
      type: 'string',
      description: '文档作者',
    },
    created: {
      type: 'string',
      format: 'date',
      description: '创建日期，格式为 YYYY-MM-DD',
    },
    description: {
      type: 'string',
      description: '文档描述',
    },
  },
  additionalProperties: true,
  description: '文档元数据',
}

/**
 * 标题块模式
 * @type {object}
 */
export const headingBlockSchema = {
  type: 'object',
  required: ['type', 'text', 'level'],
  properties: {
    type: {
      type: 'string',
      enum: ['heading'],
      description: '内容块类型',
    },
    level: {
      type: 'integer',
      minimum: 1,
      maximum: 6,
      description: '标题级别，1-6',
    },
    text: {
      type: 'string',
      description: '标题文本',
    },
    id: {
      type: 'string',
      description: '标题ID，可用于锚点链接',
    },
  },
  additionalProperties: false,
  description: '标题块',
}

/**
 * 段落块模式
 * @type {object}
 */
export const paragraphBlockSchema = {
  type: 'object',
  required: ['type', 'text'],
  properties: {
    type: {
      type: 'string',
      enum: ['paragraph'],
      description: '内容块类型',
    },
    text: {
      type: 'string',
      description: '段落文本',
    },
    alignment: {
      type: 'string',
      enum: ['left', 'center', 'right', 'justify'],
      default: 'left',
      description: '文本对齐方式',
    },
    style: {
      type: 'object',
      description: '自定义样式',
      additionalProperties: true,
    },
  },
  additionalProperties: false,
  description: '段落块',
}

/**
 * 列表项模式
 * @type {object}
 */
export const listItemSchema = {
  type: 'object',
  required: ['text'],
  properties: {
    text: {
      type: 'string',
      description: '列表项文本',
    },
    level: {
      type: 'integer',
      minimum: 0,
      default: 0,
      description: '嵌套层级',
    },
  },
  additionalProperties: false,
  description: '列表项',
}

/**
 * 列表块模式
 * @type {object}
 */
export const listBlockSchema = {
  type: 'object',
  required: ['type', 'items'],
  properties: {
    type: {
      type: 'string',
      enum: ['list'],
      description: '内容块类型',
    },
    listType: {
      type: 'string',
      enum: ['ordered', 'unordered'],
      default: 'unordered',
      description: '列表类型：有序或无序',
    },
    items: {
      type: 'array',
      items: listItemSchema,
      minItems: 1,
      description: '列表项数组',
    },
  },
  additionalProperties: false,
  description: '列表块',
}

/**
 * 表格块模式
 * @type {object}
 */
export const tableBlockSchema = {
  type: 'object',
  required: ['type', 'headers', 'rows'],
  properties: {
    type: {
      type: 'string',
      enum: ['table'],
      description: '内容块类型',
    },
    headers: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: '表格列标题',
    },
    rows: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      description: '表格行数据',
    },
  },
  additionalProperties: false,
  description: '表格块',
}

/**
 * 图片块模式
 * @type {object}
 */
export const imageBlockSchema = {
  type: 'object',
  required: ['type', 'src'],
  properties: {
    type: {
      type: 'string',
      enum: ['image'],
      description: '内容块类型',
    },
    src: {
      type: 'string',
      description: '图片URL或base64编码',
    },
    alt: {
      type: 'string',
      description: '图片替代文本',
    },
    width: {
      type: ['integer', 'string'],
      description: '图片宽度',
    },
    height: {
      type: ['integer', 'string'],
      description: '图片高度',
    },
  },
  additionalProperties: false,
  description: '图片块',
}

/**
 * 内容块模式（联合类型）
 * @type {object}
 */
export const contentBlockSchema = {
  oneOf: [
    headingBlockSchema,
    paragraphBlockSchema,
    listBlockSchema,
    tableBlockSchema,
    imageBlockSchema,
  ],
  discriminator: {
    propertyName: 'type',
    mapping: {
      heading: '#/definitions/headingBlock',
      paragraph: '#/definitions/paragraphBlock',
      list: '#/definitions/listBlock',
      table: '#/definitions/tableBlock',
      image: '#/definitions/imageBlock',
    },
  },
  description: '内容块（联合类型）',
}

/**
 * 字体样式模式
 * @type {object}
 */
export const fontsStyleSchema = {
  type: 'object',
  properties: {
    default: {
      type: 'string',
      description: '默认字体',
    },
    heading: {
      type: 'string',
      description: '标题字体',
    },
    monospace: {
      type: 'string',
      description: '等宽字体',
    },
  },
  additionalProperties: true,
  description: '字体样式',
}

/**
 * 颜色样式模式
 * @type {object}
 */
export const colorsStyleSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: '文本颜色',
    },
    background: {
      type: 'string',
      description: '背景颜色',
    },
    heading: {
      type: 'string',
      description: '标题颜色',
    },
    link: {
      type: 'string',
      description: '链接颜色',
    },
  },
  additionalProperties: true,
  description: '颜色样式',
}

/**
 * 尺寸样式模式
 * @type {object}
 */
export const sizesStyleSchema = {
  type: 'object',
  properties: {
    baseFontSize: {
      type: 'string',
      description: '基础字体大小',
    },
    h1: {
      type: 'string',
      description: 'h1标题大小',
    },
    h2: {
      type: 'string',
      description: 'h2标题大小',
    },
    h3: {
      type: 'string',
      description: 'h3标题大小',
    },
    h4: {
      type: 'string',
      description: 'h4标题大小',
    },
    h5: {
      type: 'string',
      description: 'h5标题大小',
    },
    h6: {
      type: 'string',
      description: 'h6标题大小',
    },
  },
  additionalProperties: true,
  description: '尺寸样式',
}

/**
 * 间距样式模式
 * @type {object}
 */
export const spacingStyleSchema = {
  type: 'object',
  properties: {
    lineHeight: {
      type: ['number', 'string'],
      description: '行高',
    },
    paragraphSpacing: {
      type: 'string',
      description: '段落间距',
    },
    listItemSpacing: {
      type: 'string',
      description: '列表项间距',
    },
  },
  additionalProperties: true,
  description: '间距样式',
}

/**
 * 样式模式
 * @type {object}
 */
export const stylesSchema = {
  type: 'object',
  properties: {
    fonts: fontsStyleSchema,
    colors: colorsStyleSchema,
    sizes: sizesStyleSchema,
    spacing: spacingStyleSchema,
  },
  additionalProperties: true,
  description: '文档样式',
}

/**
 * 完整文档模式
 * @type {object}
 */
export const documentSchema = {
  type: 'object',
  required: ['version', 'content'],
  properties: {
    version: versionSchema,
    metadata: metadataSchema,
    content: {
      type: 'array',
      items: contentBlockSchema,
      minItems: 1,
      description: '文档内容块数组',
    },
    styles: stylesSchema,
  },
  additionalProperties: false,
  description: 'JSON文档格式',
}

/**
 * 定义
 * @type {object}
 */
export const definitions = {
  headingBlock: headingBlockSchema,
  paragraphBlock: paragraphBlockSchema,
  listBlock: listBlockSchema,
  tableBlock: tableBlockSchema,
  imageBlock: imageBlockSchema,
}

/**
 * 完整JSON Schema（包含定义）
 * @type {object}
 */
export const fullDocumentSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...documentSchema,
  definitions,
}
