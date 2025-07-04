import { Document, GeneratorConfig, GenerationResult } from '../../types';

export class BrowserHtmlGenerator {
  private config: GeneratorConfig;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  async generate(document: Document): Promise<GenerationResult> {
    try {
      if (!this.validateDocument(document)) {
        return this.createErrorResult('Invalid document structure');
      }

      const html = this.generateHtml(document);
      return this.createSuccessResult(undefined, html);
    } catch (error) {
      return this.createErrorResult(`HTML generation failed: ${error.message}`);
    }
  }

  private validateDocument(document: Document): boolean {
    if (!document.metadata || !document.metadata.title) {
      return false;
    }
    if (!document.content || !Array.isArray(document.content)) {
      return false;
    }
    return true;
  }

  private createSuccessResult(outputPath?: string, content?: string): GenerationResult {
    return {
      success: true,
      outputPath,
      content
    };
  }

  private createErrorResult(error: string): GenerationResult {
    return {
      success: false,
      error
    };
  }

  private generateHtml(document: Document): string {
    const { metadata, style, content } = document;

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <style>
        ${this.generateStyles(style)}
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
            ${content.map(element => this.renderElement(element)).join('\n')}
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

  private generateStyles(style?: any): string {
    const defaultStyles = `
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

        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
        }

        .image-caption {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
            margin-top: 10px;
        }

        .divider {
            border: none;
            height: 1px;
            background-color: #ddd;
            margin: 30px 0;
        }

        .container {
            margin: 20px 0;
        }

        .container-vertical {
            display: flex;
            flex-direction: column;
        }

        .container-horizontal {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }
    `;

    if (!style) {
      return defaultStyles;
    }

    const customStyles = `
        body {
            font-family: ${style.fontFamily || "'Microsoft YaHei', Arial, sans-serif"};
            font-size: ${style.fontSize || '16px'};
            line-height: ${style.lineHeight || '1.6'};
            color: ${style.color || '#333'};
            background-color: ${style.backgroundColor || '#fff'};
            margin: ${style.margin || '0'};
            padding: ${style.padding || '20px'};
        }
    `;

    return defaultStyles + customStyles;
  }

  private renderElement(element: any): string {
    switch (element.type) {
      case 'text':
        return this.renderTextElement(element);
      case 'heading':
        return this.renderHeadingElement(element);
      case 'paragraph':
        return this.renderParagraphElement(element);
      case 'list':
        return this.renderListElement(element);
      case 'table':
        return this.renderTableElement(element);
      case 'image':
        return this.renderImageElement(element);
      case 'divider':
        return this.renderDividerElement(element);
      case 'container':
        return this.renderContainerElement(element);
      default:
        return '';
    }
  }

  private renderTextElement(element: any): string {
    const style = this.buildStyleString(element.style);
    return `<span class="${element.className || ''}" style="${style}">${element.content}</span>`;
  }

  private renderHeadingElement(element: any): string {
    const style = this.buildStyleString(element.style);
    return `<h${element.level} class="${element.className || ''}" style="${style}">${element.content}</h${element.level}>`;
  }

  private renderParagraphElement(element: any): string {
    const style = this.buildStyleString(element.style);
    return `<p class="${element.className || ''}" style="${style}">${element.content}</p>`;
  }

  private renderListElement(element: any): string {
    const tag = element.listType === 'ordered' ? 'ol' : 'ul';
    const style = this.buildStyleString(element.style);
    const listStyle = element.style ? `list-style-type: ${element.style};` : '';

    const items = element.items.map((item: string) => `<li>${item}</li>`).join('');
    return `<${tag} class="${element.className || ''}" style="${style} ${listStyle}">${items}</${tag}>`;
  }

  private renderTableElement(element: any): string {
    const style = this.buildStyleString(element.style);
    const borderStyle = element.borderWidth ? `border: ${element.borderWidth} solid ${element.borderColor || '#ddd'};` : '';

    const headers = element.headers.map((header: string) => `<th style="${borderStyle}">${header}</th>`).join('');
    const rows = element.rows.map((row: string[]) =>
      `<tr>${row.map(cell => `<td style="${borderStyle}">${cell}</td>`).join('')}</tr>`
    ).join('');

    return `<table class="${element.className || ''}" style="${style}">${headers}${rows}</table>`;
  }

  private renderImageElement(element: any): string {
    const style = this.buildStyleString(element.style);
    const imgStyle = `max-width: ${element.width || '100%'}; height: ${element.height || 'auto'};`;

    let html = `<img src="${element.src}" alt="${element.alt || ''}" class="${element.className || ''}" style="${style} ${imgStyle}">`;

    if (element.caption) {
      html += `<p class="image-caption">${element.caption}</p>`;
    }

    return html;
  }

  private renderDividerElement(element: any): string {
    const style = this.buildStyleString(element.style);
    const borderStyle = `border-style: ${element.style || 'solid'}; border-color: ${element.color || '#ddd'};`;
    return `<hr class="${element.className || 'divider'}" style="${style} ${borderStyle}">`;
  }

  private renderContainerElement(element: any): string {
    const style = this.buildStyleString(element.style);
    const layoutClass = element.layout === 'horizontal' ? 'container-horizontal' : 'container-vertical';
    const gapStyle = element.gap ? `gap: ${element.gap};` : '';

    const children = element.children.map((child: any) => this.renderElement(child)).join('\n');

    return `<div class="${element.className || 'container'} ${layoutClass}" style="${style} ${gapStyle}">${children}</div>`;
  }

  private buildStyleString(style?: Record<string, string>): string {
    if (!style) return '';
    return Object.entries(style)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  }
}