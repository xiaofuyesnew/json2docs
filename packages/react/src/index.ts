import React from 'react';
import { generate, GenerateOptions, GenerateResult } from '@json2docs/core';

export { generate, GenerateOptions, GenerateResult };

export interface Json2DocsReactRendererProps {
  json: any;
  options: GenerateOptions;
}

export function Json2DocsReactRenderer({ json, options }: Json2DocsReactRendererProps) {
  const result = generate(json, options);
  if (options.format === 'html') {
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: result.data } });
  }
  return React.createElement('div', null, '暂不支持该格式的预览');
}