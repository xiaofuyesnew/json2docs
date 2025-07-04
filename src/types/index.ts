// 基础元素接口
export interface BaseElement {
  id?: string;
  type: string;
  className?: string;
  style?: Record<string, string>;
}

// 文本元素
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

// 标题元素
export interface HeadingElement extends BaseElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
  color?: string;
}

// 段落元素
export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
  content: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
}

// 列表元素
export interface ListElement extends BaseElement {
  type: 'list';
  listType: 'ordered' | 'unordered';
  items: string[];
  style?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha';
}

// 表格元素
export interface TableElement extends BaseElement {
  type: 'table';
  headers: string[];
  rows: string[][];
  borderWidth?: string;
  borderColor?: string;
  headerBackground?: string;
  rowBackground?: string;
}

// 图片元素
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  caption?: string;
}

// 分割线元素
export interface DividerElement extends BaseElement {
  type: 'divider';
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  width?: string;
}

// 容器元素
export interface ContainerElement extends BaseElement {
  type: 'container';
  children: DocumentElement[];
  layout?: 'vertical' | 'horizontal';
  gap?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
}

// 所有文档元素的联合类型
export type DocumentElement =
  | TextElement
  | HeadingElement
  | ParagraphElement
  | ListElement
  | TableElement
  | ImageElement
  | DividerElement
  | ContainerElement;

// 文档元数据
export interface DocumentMetadata {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  createdAt?: string;
  updatedAt?: string;
  version?: string;
}

// 文档样式配置
export interface DocumentStyle {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  color?: string;
  backgroundColor?: string;
  margin?: string;
  padding?: string;
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
}

// 完整的文档结构
export interface Document {
  metadata: DocumentMetadata;
  style?: DocumentStyle;
  content: DocumentElement[];
}

// 生成器配置
export interface GeneratorConfig {
  outputFormat: 'pdf' | 'docx' | 'html' | 'vue' | 'react';
  template?: string;
  outputPath?: string;
  options?: Record<string, any>;
}

// 生成结果
export interface GenerationResult {
  success: boolean;
  outputPath?: string;
  content?: string;
  error?: string;
}