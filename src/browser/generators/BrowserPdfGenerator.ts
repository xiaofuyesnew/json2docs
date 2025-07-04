import { Document, GeneratorConfig, GenerationResult } from '../../types';

// 扩展GenerationResult以支持Blob
interface BrowserGenerationResult extends GenerationResult {
  blob?: Blob;
}

export class BrowserPdfGenerator {
  private config: GeneratorConfig;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  async generate(document: Document): Promise<BrowserGenerationResult> {
    try {
      if (!this.validateDocument(document)) {
        return this.createErrorResult('Invalid document structure');
      }

      // 动态导入pdfmake（浏览器环境）
      const pdfMake = await this.loadPdfMake();
      const docDefinition = this.createPdfDefinition(document);

      return new Promise((resolve) => {
        const pdfDoc = pdfMake.createPdf(docDefinition);

        pdfDoc.getBlob((blob: Blob) => {
          resolve(this.createSuccessResult(blob));
        });
      });
    } catch (error) {
      return this.createErrorResult(`PDF generation failed: ${error.message}`);
    }
  }

  private async loadPdfMake(): Promise<any> {
    // 在浏览器环境中动态加载pdfmake
    if (typeof window !== 'undefined') {
      // 检查是否已经加载
      if ((window as any).pdfMake) {
        return (window as any).pdfMake;
      }

      // 动态加载pdfmake
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
        script.onload = () => {
          const fontsScript = document.createElement('script');
          fontsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
          fontsScript.onload = () => {
            resolve((window as any).pdfMake);
          };
          fontsScript.onerror = reject;
          document.head.appendChild(fontsScript);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    throw new Error('Browser environment not detected');
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

  private createSuccessResult(blob?: Blob): BrowserGenerationResult {
    return {
      success: true,
      blob
    };
  }

  private createErrorResult(error: string): BrowserGenerationResult {
    return {
      success: false,
      error
    };
  }

  private createPdfDefinition(document: Document) {
    const { metadata, style, content } = document;

    return {
      info: {
        title: metadata.title,
        author: metadata.author || '',
        subject: metadata.subject || '',
        keywords: metadata.keywords || [],
        creator: 'JSON2Docs',
        producer: 'JSON2Docs'
      },
      pageSize: style?.pageSize || 'A4',
      pageOrientation: style?.orientation || 'portrait',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        fontSize: parseInt(style?.fontSize || '12'),
        lineHeight: parseFloat(style?.lineHeight || '1.6'),
        color: style?.color || '#333333'
      },
      content: [
        // 标题页
        {
          text: metadata.title,
          style: 'documentTitle',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        // 元信息
        ...this.createMetadataSection(metadata),
        // 内容
        ...content.map(element => this.convertElement(element))
      ],
      styles: this.createStyles()
    };
  }

  private createMetadataSection(metadata: any) {
    const sections = [];

    if (metadata.author) {
      sections.push({
        text: `Author: ${metadata.author}`,
        style: 'metadata',
        alignment: 'center'
      });
    }

    if (metadata.subject) {
      sections.push({
        text: `Subject: ${metadata.subject}`,
        style: 'metadata',
        alignment: 'center'
      });
    }

    if (metadata.createdAt) {
      sections.push({
        text: `Created: ${metadata.createdAt}`,
        style: 'metadata',
        alignment: 'center'
      });
    }

    if (sections.length > 0) {
      sections.push({ text: '', margin: [0, 20] }); // 添加间距
    }

    return sections;
  }

  private convertElement(element: any): any {
    switch (element.type) {
      case 'text':
        return this.convertTextElement(element);
      case 'heading':
        return this.convertHeadingElement(element);
      case 'paragraph':
        return this.convertParagraphElement(element);
      case 'list':
        return this.convertListElement(element);
      case 'table':
        return this.convertTableElement(element);
      case 'image':
        return this.convertImageElement(element);
      case 'divider':
        return this.convertDividerElement(element);
      case 'container':
        return this.convertContainerElement(element);
      default:
        return { text: '' };
    }
  }

  private convertTextElement(element: any): any {
    return {
      text: element.content,
      style: {
        fontSize: parseInt(element.fontSize || '12'),
        bold: element.fontWeight === 'bold',
        color: element.color || '#333333',
        alignment: element.textAlign || 'left'
      }
    };
  }

  private convertHeadingElement(element: any): any {
    const headingStyles = {
      1: 'heading1',
      2: 'heading2',
      3: 'heading3',
      4: 'heading4',
      5: 'heading5',
      6: 'heading6'
    };

    return {
      text: element.content,
      style: headingStyles[element.level] || 'heading1',
      color: element.color || '#2c3e50',
      margin: [0, 20, 0, 10]
    };
  }

  private convertParagraphElement(element: any): any {
    return {
      text: element.content,
      style: {
        alignment: element.textAlign || 'justify',
        lineHeight: parseFloat(element.lineHeight || '1.6'),
        margin: [0, 0, 0, 10]
      }
    };
  }

  private convertListElement(element: any): any {
    return {
      ul: element.listType === 'unordered' ? element.items : undefined,
      ol: element.listType === 'ordered' ? element.items : undefined,
      style: {
        margin: [0, 0, 0, 10]
      }
    };
  }

  private convertTableElement(element: any): any {
    const body = [
      // 表头
      element.headers.map((header: string) => ({
        text: header,
        style: 'tableHeader'
      })),
      // 数据行
      ...element.rows.map((row: string[]) =>
        row.map(cell => ({
          text: cell,
          style: 'tableCell'
        }))
      )
    ];

    return {
      table: {
        headerRows: 1,
        widths: element.headers.map(() => '*'),
        body
      },
      style: {
        margin: [0, 10, 0, 10]
      }
    };
  }

  private convertImageElement(element: any): any {
    const imageObj: any = {
      image: element.src,
      width: parseInt(element.width || '300'),
      height: parseInt(element.height || '200'),
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };

    if (element.caption) {
      return [
        imageObj,
        {
          text: element.caption,
          style: 'imageCaption',
          alignment: 'center'
        }
      ];
    }

    return imageObj;
  }

  private convertDividerElement(element: any): any {
    return {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 515, // A4宽度减去边距
          y2: 0,
          lineWidth: 1,
          lineColor: element.color || '#dddddd'
        }
      ],
      margin: [0, 20, 0, 20]
    };
  }

  private convertContainerElement(element: any): any {
    const children = element.children.map((child: any) => this.convertElement(child));

    return {
      stack: children,
      style: {
        margin: [0, 10, 0, 10]
      }
    };
  }

  private createStyles() {
    return {
      documentTitle: {
        fontSize: 24,
        bold: true,
        color: '#2c3e50',
        margin: [0, 0, 0, 30]
      },
      metadata: {
        fontSize: 10,
        color: '#7f8c8d',
        margin: [0, 5, 0, 5]
      },
      heading1: {
        fontSize: 20,
        bold: true,
        color: '#2c3e50',
        margin: [0, 20, 0, 10]
      },
      heading2: {
        fontSize: 18,
        bold: true,
        color: '#34495e',
        margin: [0, 15, 0, 8]
      },
      heading3: {
        fontSize: 16,
        bold: true,
        color: '#34495e',
        margin: [0, 12, 0, 6]
      },
      heading4: {
        fontSize: 14,
        bold: true,
        color: '#34495e',
        margin: [0, 10, 0, 5]
      },
      heading5: {
        fontSize: 12,
        bold: true,
        color: '#34495e',
        margin: [0, 8, 0, 4]
      },
      heading6: {
        fontSize: 11,
        bold: true,
        color: '#34495e',
        margin: [0, 6, 0, 3]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: '#2c3e50',
        fillColor: '#f8f9fa',
        alignment: 'center'
      },
      tableCell: {
        fontSize: 10,
        color: '#333333'
      },
      imageCaption: {
        fontSize: 10,
        color: '#7f8c8d',
        italics: true,
        margin: [0, 5, 0, 10]
      }
    };
  }
}