# JSON Document Converter API

本文档描述了JSON文档转换器库的API接口。

## 主要类和接口

### DocumentConverter

主要的转换器类，用于将JSON文档转换为不同格式。

```javascript
import { DocumentConverter } from '@json2docs/converter'

const converter = new DocumentConverter(options)
```

#### 构造函数选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `validateInput` | `boolean` | `true` | 是否在转换前验证输入JSON |
| `errorOnInvalid` | `boolean` | `true` | 验证失败时是否抛出错误 |

#### 方法

##### convert(jsonData, outputFormat, options)

将JSON文档转换为指定格式。

```javascript
const result = await converter.convert(jsonDocument, 'html', options)
```

**参数:**

- `jsonData`: JSON文档对象
- `outputFormat`: 输出格式，可选值: 'html', 'pdf', 'docx'
- `options`: 转换选项（可选）

**返回值:**

返回一个`ConversionResult`对象，包含:

- `format`: 输出格式
- `data`: 转换结果数据
- `metadata`: 元数据
- `timestamp`: 转换时间戳

##### validateJsonDocument(jsonData)

验证JSON文档格式是否正确。

```javascript
const validationResult = converter.validateJsonDocument(jsonDocument)
```

**参数:**

- `jsonData`: 要验证的JSON文档对象

**返回值:**

返回一个验证结果对象，包含:

- `valid`: 是否有效
- `errors`: 错误信息数组（如果无效）

##### getSupportedFormats()

获取支持的输出格式列表。

```javascript
const formats = converter.getSupportedFormats()
// 返回: ['html', 'pdf', 'docx']
```

### HTMLGenerator

HTML格式生成器。

```javascript
import { HTMLGenerator } from '@json2docs/converter'

const generator = new HTMLGenerator(options)
const htmlResult = await generator.generate(documentData)
```

### PDFGenerator

PDF格式生成器。

```javascript
import { PDFGenerator } from '@json2docs/converter'

const generator = new PDFGenerator(options)
const pdfResult = await generator.generate(documentData)
```

### DOCXGenerator

DOCX格式生成器。

```javascript
import { DOCXGenerator } from '@json2docs/converter'

const generator = new DOCXGenerator(options)
const docxResult = await generator.generate(documentData)
```

### DocumentModel

文档数据模型。

```javascript
import { DocumentModel } from '@json2docs/converter'

const document = new DocumentModel(jsonData)
document.validate() // 验证文档
```

### ConversionResult

转换结果模型。

```javascript
import { ConversionResult } from '@json2docs/converter'

const result = new ConversionResult('html', htmlData, metadata)
const blob = result.toBlob() // 转换为Blob对象用于下载
```

### DocumentConverterError

自定义错误类。

```javascript
import { DocumentConverterError, ERROR_CODES } from '@json2docs/converter'

try {
  // 转换代码
}
catch (error) {
  if (error instanceof DocumentConverterError) {
    console.error(`错误代码: ${error.code}, 消息: ${error.message}`)
  }
}
```

#### 错误代码

- `INVALID_JSON`: JSON格式无效
- `UNSUPPORTED_FORMAT`: 不支持的输出格式
- `CONVERSION_FAILED`: 转换过程失败
- `VALIDATION_ERROR`: 验证错误

## JSON文档格式规范

详细的JSON文档格式规范请参考[文档格式规范](./document-format.md)。
