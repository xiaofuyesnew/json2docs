const fs = require('fs');
const path = require('path');

// 读取示例数据
const sampleData = JSON.parse(fs.readFileSync('./examples/sample-document.json', 'utf-8'));

// 简单的HTML生成函数（用于测试）
function generateHtml(document) {
  const { metadata, style, content } = document;

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #fff;
        }

        .document {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 40px;
        }

        .document-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }

        .document-title {
            font-size: 2.5em;
            color: #2c3e50;
            margin: 0 0 10px 0;
        }

        .document-author, .document-subject {
            color: #7f8c8d;
            margin: 5px 0;
        }

        .document-content {
            margin-bottom: 40px;
        }

        .document-footer {
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }

        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }

        h1 { font-size: 2em; }
        h2 { font-size: 1.8em; }
        h3 { font-size: 1.6em; }
        h4 { font-size: 1.4em; }
        h5 { font-size: 1.2em; }
        h6 { font-size: 1em; }

        p {
            margin-bottom: 15px;
            text-align: justify;
        }

        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }

        li {
            margin-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }

        .container {
            margin: 20px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .divider {
            border: none;
            height: 1px;
            background-color: #ddd;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="document">
        <header class="document-header">
            <h1 class="document-title">${metadata.title}</h1>
            ${metadata.author ? `<p class="document-author">作者: ${metadata.author}</p>` : ''}
            ${metadata.subject ? `<p class="document-subject">主题: ${metadata.subject}</p>` : ''}
        </header>

        <main class="document-content">
            ${content.map(element => renderElement(element)).join('\n')}
        </main>

        <footer class="document-footer">
            ${metadata.createdAt ? `<p>创建时间: ${metadata.createdAt}</p>` : ''}
            ${metadata.updatedAt ? `<p>更新时间: ${metadata.updatedAt}</p>` : ''}
        </footer>
    </div>
</body>
</html>`;

  return html;
}

function renderElement(element) {
  switch (element.type) {
    case 'text':
      return `<span style="${buildStyleString(element.style)}">${element.content}</span>`;
    case 'heading':
      return `<h${element.level} style="${buildStyleString(element.style)}">${element.content}</h${element.level}>`;
    case 'paragraph':
      return `<p style="${buildStyleString(element.style)}">${element.content}</p>`;
    case 'list':
      const tag = element.listType === 'ordered' ? 'ol' : 'ul';
      const items = element.items.map(item => `<li>${item}</li>`).join('');
      return `<${tag} style="${buildStyleString(element.style)}">${items}</${tag}>`;
    case 'table':
      const headers = element.headers.map(header => `<th>${header}</th>`).join('');
      const rows = element.rows.map(row =>
        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
      ).join('');
      return `<table style="${buildStyleString(element.style)}"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    case 'container':
      const children = element.children.map(child => renderElement(child)).join('\n');
      return `<div class="container" style="${buildStyleString(element.style)}">${children}</div>`;
    case 'divider':
      return `<hr class="divider" style="${buildStyleString(element.style)}">`;
    default:
      return '';
  }
}

function buildStyleString(style) {
  if (!style) return '';
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}

// 生成HTML
const html = generateHtml(sampleData);

// 确保输出目录存在
const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 写入HTML文件
const outputPath = path.join(outputDir, 'sample-document.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log(`HTML文件已生成: ${outputPath}`);
console.log('请在浏览器中打开该文件查看效果');