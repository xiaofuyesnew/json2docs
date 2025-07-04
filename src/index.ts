// 浏览器环境的主入口文件
export * from '../types';

// 导出浏览器兼容的生成器
export { BrowserHtmlGenerator } from './generators/BrowserHtmlGenerator';
export { BrowserPdfGenerator } from './generators/BrowserPdfGenerator';

// 导出组件
export { default as VueRenderer } from '../components/VueRenderer.vue';
export { default as ReactRenderer } from '../components/ReactRenderer';

// 浏览器环境的主类
export class Json2DocsBrowser {
  private generators: Map<string, any> = new Map();

  constructor() {
    this.registerGenerators();
  }

  private registerGenerators() {
    // 注册浏览器兼容的生成器
    this.generators.set('html', BrowserHtmlGenerator);
    this.generators.set('pdf', BrowserPdfGenerator);
  }

  /**
   * 生成HTML内容（返回字符串）
   */
  async toHtml(document: Document): Promise<string> {
    const generator = new BrowserHtmlGenerator({ outputFormat: 'html' });
    const result = await generator.generate(document);

    if (result.success && result.content) {
      return result.content;
    } else {
      throw new Error(result.error || 'HTML generation failed');
    }
  }

  /**
   * 生成PDF Blob（用于下载）
   */
  async toPdf(document: Document): Promise<Blob> {
    const generator = new BrowserPdfGenerator({ outputFormat: 'pdf' });
    const result = await generator.generate(document);

    if (result.success && result.blob) {
      return result.blob;
    } else {
      throw new Error(result.error || 'PDF generation failed');
    }
  }

  /**
   * 下载PDF文件
   */
  async downloadPdf(document: Document, filename?: string): Promise<void> {
    const blob = await this.toPdf(document);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${document.metadata.title}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 获取支持的输出格式
   */
  getSupportedFormats(): string[] {
    return Array.from(this.generators.keys());
  }
}

// 默认导出
export default Json2DocsBrowser;