import { Document, GeneratorConfig, GenerationResult } from '../types';

export abstract class BaseGenerator {
  protected config: GeneratorConfig;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  /**
   * 生成文档的抽象方法
   */
  abstract generate(document: Document): Promise<GenerationResult>;

  /**
   * 验证文档结构
   */
  protected validateDocument(document: Document): boolean {
    if (!document.metadata || !document.metadata.title) {
      return false;
    }
    if (!document.content || !Array.isArray(document.content)) {
      return false;
    }
    return true;
  }

  /**
   * 创建成功结果
   */
  protected createSuccessResult(outputPath?: string, content?: string): GenerationResult {
    return {
      success: true,
      outputPath,
      content
    };
  }

  /**
   * 创建错误结果
   */
  protected createErrorResult(error: string): GenerationResult {
    return {
      success: false,
      error
    };
  }

  /**
   * 获取输出路径
   */
  protected getOutputPath(document: Document): string {
    if (this.config.outputPath) {
      return this.config.outputPath;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const title = document.metadata.title.replace(/[^a-zA-Z0-9]/g, '_');
    return `./output/${title}_${timestamp}.${this.config.outputFormat}`;
  }

  /**
   * 确保输出目录存在
   */
  protected async ensureOutputDirectory(outputPath: string): Promise<void> {
    const fs = await import('fs-extra');
    const path = await import('path');
    const dir = path.dirname(outputPath);
    await fs.ensureDir(dir);
  }
}