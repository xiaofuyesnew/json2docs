# @json2docs/core

JSON2Docs 核心转换引擎，提供将结构化 JSON 配置转换为多种文档格式的功能。

## 安装

```bash
npm install @json2docs/core
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

### 基本用法

```javascript
import { Json2Docs } from '@json2docs/core';

// 创建实例（可选配置选项）
const json2docs = new Json2Docs({
  defaultFontSize: 14,
  defaultFont: 'Arial',
  enableSourceMap: true
});

const config = {
  content: [
    { text: '文档标题', style: 'header' },
    { text: '这是正文内容...' },
    {
      table: {
        headerRows: 1,
        body: [
          ['列1', '列2'],
          ['数据1', '数据2']
        ]
      }
    },
    {
      ul: ['项目1', '项目2', '项目3']
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50',
      alignment: 'center'
    }
  },
  output: {
    format: 'html' // 'pdf' | 'docx' | 'html'
  }
};

const result = await json2docs.generate(config);
console.log(result.content);
```

### 高级功能

```javascript
// 获取文档统计信息
const stats = json2docs.getDocumentStats(config);
console.log('文档统计:', stats);

// 验证样式配置
const styleValidation = json2docs.validateStyles(config.styles);
console.log('样式验证:', styleValidation);

// 检查格式支持
console.log('支持的格式:', json2docs.getSupportedFormats());
console.log('PDF 支持:', json2docs.isFormatSupported('pdf'));

// 设置选项
json2docs.setOptions({ defaultFontSize: 16 });

// 清除样式缓存
json2docs.clearStyleCache();
```

### 生成 PDF

```javascript
const pdfConfig = {
  ...config,
  output: {
    format: 'pdf',
    options: {
      filename: 'document.pdf' // 可选，指定输出文件名
    }
  }
};

const pdfResult = await json2docs.generate(pdfConfig);
// pdfResult.outputPath 包含文件路径
```

### 生成 DOCX

```javascript
const docxConfig = {
  ...config,
  output: {
    format: 'docx',
    options: {
      filename: 'document.docx' // 可选，指定输出文件名
    }
  }
};

const docxResult = await json2docs.generate(docxConfig);
// docxResult.outputPath 包含文件路径
```

## 测试

```bash
# 运行基础测试
pnpm test

# 运行高级功能测试
pnpm test:advanced

# 运行所有测试
pnpm test:all

# 运行示例
node example.js
```

## 核心功能特性

### ✅ 已实现功能

- **多格式支持**: HTML、PDF、DOCX
- **配置验证**: 完整的配置和内容验证
- **样式系统**: 支持丰富的样式属性
- **性能优化**: 样式缓存机制
- **配置预处理**: 自动应用默认样式
- **文档统计**: 详细的内容分析
- **样式验证**: 配置质量检查
- **错误处理**: 完善的错误信息

### 🎨 支持的样式属性

- `fontSize` - 字体大小
- `font` - 字体名称
- `bold` - 粗体
- `italic` - 斜体
- `color` - 颜色
- `alignment` - 对齐方式
- `margin` - 外边距
- `padding` - 内边距
- `background` - 背景色
- `border` - 边框
- `lineHeight` - 行高
- `textDecoration` - 文本装饰
- `opacity` - 透明度
- `fillColor` - 填充颜色

### 📊 文档内容支持

- 文本内容
- 表格（支持表头）
- 列表（有序/无序）
- 图片
- 堆叠布局
- 列布局
- 嵌套内容
