import { BaseGenerator } from '../core/BaseGenerator';
import { Document, DocumentElement, TextElement, HeadingElement, ParagraphElement, ListElement, TableElement, ImageElement, DividerElement, ContainerElement } from '../types';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// 注册字体
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export class PdfGenerator extends BaseGenerator {
  async generate(document: Document): Promise<GenerationResult> {
    try {
      if (!this.validateDocument(document)) {
        return this.createErrorResult('Invalid document structure');
      }

      const docDefinition = this.createPdfDefinition(document);
      const outputPath = this.getOutputPath(document);

      await this.ensureOutputDirectory(outputPath);

      return new Promise((resolve) => {
        const pdfDoc = pdfMake.createPdf(docDefinition);

        pdfDoc.getBuffer((buffer) => {
          const fs = require('fs-extra');
          fs.writeFileSync(outputPath, buffer);
          resolve(this.createSuccessResult(outputPath));
        });
      });
    } catch (error) {
      return this.createErrorResult(`PDF generation failed: ${error.message}`);
    }
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
        font: 'SimSun', // 使用宋体支持中文
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
      styles: this.createStyles(),
      fonts: {
        SimSun: {
          normal: 'SimSun.ttf',
          bold: 'SimSun.ttf',
          italics: 'SimSun.ttf',
          bolditalics: 'SimSun.ttf'
        }
      }
    };
  }

  private createMetadataSection(metadata: any) {
    const sections = [];

    if (metadata.author) {
      sections.push({
        text: `作者: ${metadata.author}`,
        style: 'metadata',
        alignment: 'center'
      });
    }

    if (metadata.subject) {
      sections.push({
        text: `主题: ${metadata.subject}`,
        style: 'metadata',
        alignment: 'center'
      });
    }

    if (metadata.createdAt) {
      sections.push({
        text: `创建时间: ${metadata.createdAt}`,
        style: 'metadata',
        alignment: 'center'
      });
    }

    if (sections.length > 0) {
      sections.push({ text: '', margin: [0, 20] }); // 添加间距
    }

    return sections;
  }

  private convertElement(element: DocumentElement): any {
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

  private convertTextElement(element: TextElement): any {
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

  private convertHeadingElement(element: HeadingElement): any {
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

  private convertParagraphElement(element: ParagraphElement): any {
    return {
      text: element.content,
      style: {
        alignment: element.textAlign || 'justify',
        lineHeight: parseFloat(element.lineHeight || '1.6'),
        margin: [0, 0, 0, 10]
      }
    };
  }

  private convertListElement(element: ListElement): any {
    const listType = element.listType === 'ordered' ? 'decimal' : 'disc';

    return {
      ul: element.listType === 'unordered' ? element.items : undefined,
      ol: element.listType === 'ordered' ? element.items : undefined,
      style: {
        margin: [0, 0, 0, 10]
      }
    };
  }

  private convertTableElement(element: TableElement): any {
    const body = [
      // 表头
      element.headers.map(header => ({
        text: header,
        style: 'tableHeader'
      })),
      // 数据行
      ...element.rows.map(row =>
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

  private convertImageElement(element: ImageElement): any {
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

  private convertDividerElement(element: DividerElement): any {
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

  private convertContainerElement(element: ContainerElement): any {
    const children = element.children.map(child => this.convertElement(child));

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