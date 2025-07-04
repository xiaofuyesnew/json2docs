import React, { useState, useEffect, useCallback } from 'react';
import { Document } from '../types';
import { HtmlGenerator } from '../generators/HtmlGenerator';

interface ReactRendererProps {
  document: Document;
  theme?: string;
  className?: string;
  onRendered?: (result: any) => void;
  onError?: (error: string) => void;
}

interface RenderState {
  loading: boolean;
  error: string;
  content: string;
}

const ReactRenderer: React.FC<ReactRendererProps> = ({
  document,
  theme = 'default',
  className = '',
  onRendered,
  onError
}) => {
  const [state, setState] = useState<RenderState>({
    loading: true,
    error: '',
    content: ''
  });

  const renderDocument = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: '' }));

      // 使用HTML生成器渲染文档
      const generator = new HtmlGenerator({
        outputFormat: 'html'
      });

      const result = await generator.generate(document);

      if (result.success && result.content) {
        // 提取body内容，去除完整的HTML结构
        const content = extractBodyContent(result.content);
        setState({
          loading: false,
          error: '',
          content
        });
        onRendered?.(result);
      } else {
        throw new Error(result.error || '渲染失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setState({
        loading: false,
        error: errorMessage,
        content: ''
      });
      onError?.(errorMessage);
    }
  }, [document, onRendered, onError]);

  const extractBodyContent = (html: string): string => {
    // 提取document-content部分的内容
    const match = html.match(/<main class="document-content">([\s\S]*?)<\/main>/);
    if (match) {
      return match[1];
    }
    return html;
  };

  useEffect(() => {
    renderDocument();
  }, [renderDocument]);

  if (state.loading) {
    return (
      <div className={`json2docs-react-renderer ${className}`}>
        <div className="loading">
          <div className="spinner"></div>
          <p>正在渲染文档...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={`json2docs-react-renderer ${className}`}>
        <div className="error">
          <p>{state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`json2docs-react-renderer ${className}`}>
      <div
        className="document"
        dangerouslySetInnerHTML={{ __html: state.content }}
      />
    </div>
  );
};

// 样式定义
const styles = `
.json2docs-react-renderer {
  width: 100%;
}

.json2docs-react-renderer .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.json2docs-react-renderer .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.json2docs-react-renderer .error {
  padding: 20px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}

.json2docs-react-renderer .document {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.json2docs-react-renderer .document h1,
.json2docs-react-renderer .document h2,
.json2docs-react-renderer .document h3,
.json2docs-react-renderer .document h4,
.json2docs-react-renderer .document h5,
.json2docs-react-renderer .document h6 {
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 15px;
}

.json2docs-react-renderer .document h1 { font-size: 2em; }
.json2docs-react-renderer .document h2 { font-size: 1.8em; }
.json2docs-react-renderer .document h3 { font-size: 1.6em; }
.json2docs-react-renderer .document h4 { font-size: 1.4em; }
.json2docs-react-renderer .document h5 { font-size: 1.2em; }
.json2docs-react-renderer .document h6 { font-size: 1em; }

.json2docs-react-renderer .document p {
  margin-bottom: 15px;
  text-align: justify;
}

.json2docs-react-renderer .document ul,
.json2docs-react-renderer .document ol {
  margin-bottom: 15px;
  padding-left: 30px;
}

.json2docs-react-renderer .document li {
  margin-bottom: 5px;
}

.json2docs-react-renderer .document table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.json2docs-react-renderer .document th,
.json2docs-react-renderer .document td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.json2docs-react-renderer .document th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.json2docs-react-renderer .document img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
}

.json2docs-react-renderer .document .image-caption {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 10px;
}

.json2docs-react-renderer .document .divider {
  border: none;
  height: 1px;
  background-color: #ddd;
  margin: 30px 0;
}

.json2docs-react-renderer .document .container {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}
`;

// 注入样式
if (typeof document !== 'undefined') {
  const styleId = 'json2docs-react-styles';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

export default ReactRenderer;