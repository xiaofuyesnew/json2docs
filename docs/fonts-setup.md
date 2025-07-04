# 中文字体配置说明

## 问题说明

pdfmake 默认不包含中文字体，当文档包含中文内容时，会显示为方框或乱码。要解决这个问题，需要配置中文字体。

## 解决方案

### 1. 准备字体文件

您需要准备以下字体文件：
- `SimSun.ttf` - 宋体（推荐）
- `SimHei.ttf` - 黑体
- `MicrosoftYaHei.ttf` - 微软雅黑

### 2. 字体文件放置位置

将字体文件放置在项目根目录的 `fonts/` 文件夹中：

```
json2docs/
├── fonts/
│   ├── SimSun.ttf
│   ├── SimHei.ttf
│   └── MicrosoftYaHei.ttf
├── src/
├── examples/
└── ...
```

### 3. 更新PDF生成器配置

在 `src/generators/PdfGenerator.ts` 中，更新字体配置：

```typescript
// 在 createPdfDefinition 方法中
fonts: {
  SimSun: {
    normal: 'fonts/SimSun.ttf',
    bold: 'fonts/SimSun.ttf',
    italics: 'fonts/SimSun.ttf',
    bolditalics: 'fonts/SimSun.ttf'
  },
  SimHei: {
    normal: 'fonts/SimHei.ttf',
    bold: 'fonts/SimHei.ttf',
    italics: 'fonts/SimHei.ttf',
    bolditalics: 'fonts/SimHei.ttf'
  },
  MicrosoftYaHei: {
    normal: 'fonts/MicrosoftYaHei.ttf',
    bold: 'fonts/MicrosoftYaHei.ttf',
    italics: 'fonts/MicrosoftYaHei.ttf',
    bolditalics: 'fonts/MicrosoftYaHei.ttf'
  }
}
```

### 4. 字体文件来源

您可以从以下位置获取字体文件：

1. **Windows 系统**：
   - `C:\Windows\Fonts\SimSun.ttc` → 重命名为 `SimSun.ttf`
   - `C:\Windows\Fonts\SimHei.ttc` → 重命名为 `SimHei.ttf`
   - `C:\Windows\Fonts\msyh.ttc` → 重命名为 `MicrosoftYaHei.ttf`

2. **在线下载**：
   - 从官方网站下载免费字体
   - 注意字体版权问题

### 5. 测试字体配置

运行测试命令验证字体配置：

```bash
node test-pdf.js
```

如果配置正确，生成的PDF文件中的中文应该正常显示。

## 注意事项

1. **字体版权**：确保您有权使用所选字体
2. **文件大小**：字体文件会增加项目体积
3. **跨平台**：不同操作系统的字体文件可能不同
4. **性能**：字体文件会影响PDF生成速度

## 替代方案

如果不想使用本地字体文件，可以考虑：

1. **使用系统默认字体**：pdfmake 会尝试使用系统可用字体
2. **使用 Web 字体**：通过 CDN 加载字体（需要网络连接）
3. **使用图片**：将中文内容转换为图片（不推荐）

## 推荐配置

对于中文文档，推荐使用以下配置：

```typescript
defaultStyle: {
  font: 'SimSun', // 宋体，适合正文
  fontSize: 12,
  lineHeight: 1.6
},
styles: {
  heading1: {
    font: 'SimHei', // 黑体，适合标题
    fontSize: 20,
    bold: true
  }
}
```