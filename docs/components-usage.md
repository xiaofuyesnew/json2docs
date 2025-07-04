# 组件使用说明

## Vue 组件使用

### 安装

```bash
npm install json2docs
```

### 基本用法

```vue
<template>
  <div>
    <h1>文档渲染器</h1>
    <VueRenderer
      :document="documentData"
      @rendered="onRendered"
      @error="onError"
    />
  </div>
</template>

<script>
import { VueRenderer } from 'json2docs';

export default {
  name: 'DocumentViewer',
  components: {
    VueRenderer
  },
  data() {
    return {
      documentData: {
        metadata: {
          title: "示例文档",
          author: "作者名"
        },
        content: [
          {
            type: "heading",
            level: 1,
            content: "文档标题"
          },
          {
            type: "paragraph",
            content: "这是一个段落内容。"
          },
          {
            type: "list",
            listType: "unordered",
            items: ["项目1", "项目2", "项目3"]
          }
        ]
      }
    };
  },
  methods: {
    onRendered(result) {
      console.log('文档渲染完成:', result);
    },
    onError(error) {
      console.error('渲染错误:', error);
    }
  }
};
</script>
```

### 使用 Composition API

```vue
<template>
  <div>
    <VueRenderer
      :document="document"
      :theme="theme"
      :class-name="customClass"
      @rendered="handleRendered"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueRenderer } from 'json2docs';

const document = ref({
  metadata: {
    title: "动态文档",
    author: "动态作者"
  },
  content: [
    {
      type: "heading",
      level: 1,
      content: "动态标题"
    },
    {
      type: "paragraph",
      content: "动态内容"
    }
  ]
});

const theme = ref('default');
const customClass = ref('my-custom-class');

const handleRendered = (result) => {
  console.log('渲染完成:', result);
};

const handleError = (error) => {
  console.error('渲染错误:', error);
};
</script>
```

## React 组件使用

### 安装

```bash
npm install json2docs
```

### 基本用法

```tsx
import React, { useState } from 'react';
import { ReactRenderer } from 'json2docs';

const DocumentViewer: React.FC = () => {
  const [documentData] = useState({
    metadata: {
      title: "示例文档",
      author: "作者名"
    },
    content: [
      {
        type: "heading",
        level: 1,
        content: "文档标题"
      },
      {
        type: "paragraph",
        content: "这是一个段落内容。"
      },
      {
        type: "list",
        listType: "unordered",
        items: ["项目1", "项目2", "项目3"]
      }
    ]
  });

  const handleRendered = (result: any) => {
    console.log('文档渲染完成:', result);
  };

  const handleError = (error: string) => {
    console.error('渲染错误:', error);
  };

  return (
    <div>
      <h1>文档渲染器</h1>
      <ReactRenderer
        document={documentData}
        theme="default"
        className="my-document"
        onRendered={handleRendered}
        onError={handleError}
      />
    </div>
  );
};

export default DocumentViewer;
```

### 使用 Hooks

```tsx
import React, { useState, useEffect } from 'react';
import { ReactRenderer } from 'json2docs';

const DynamicDocumentViewer: React.FC = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从API获取文档数据
    fetchDocumentData();
  }, []);

  const fetchDocumentData = async () => {
    try {
      const response = await fetch('/api/document');
      const data = await response.json();
      setDocument(data);
    } catch (error) {
      console.error('获取文档失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!document) {
    return <div>文档加载失败</div>;
  }

  return (
    <div>
      <h1>动态文档</h1>
      <ReactRenderer
        document={document}
        theme="modern"
        className="dynamic-document"
        onRendered={(result) => console.log('渲染完成:', result)}
        onError={(error) => console.error('渲染错误:', error)}
      />
    </div>
  );
};

export default DynamicDocumentViewer;
```

## 组件属性

### VueRenderer 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| document | Document | - | 要渲染的文档数据（必需） |
| theme | string | 'default' | 主题样式 |
| className | string | '' | 自定义CSS类名 |

### VueRenderer 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| rendered | result | 文档渲染完成时触发 |
| error | error | 渲染出错时触发 |

### ReactRenderer 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| document | Document | - | 要渲染的文档数据（必需） |
| theme | string | 'default' | 主题样式 |
| className | string | '' | 自定义CSS类名 |
| onRendered | function | - | 渲染完成回调 |
| onError | function | - | 错误回调 |

## 主题定制

组件支持主题定制，您可以通过CSS变量来自定义样式：

```css
/* 自定义主题 */
.json2docs-vue-renderer {
  --primary-color: #3498db;
  --text-color: #2c3e50;
  --background-color: #fff;
  --border-color: #ddd;
}

.json2docs-react-renderer {
  --primary-color: #3498db;
  --text-color: #2c3e50;
  --background-color: #fff;
  --border-color: #ddd;
}
```

## 性能优化

### 1. 使用 useMemo 优化 React 组件

```tsx
import React, { useMemo } from 'react';
import { ReactRenderer } from 'json2docs';

const OptimizedDocumentViewer: React.FC<{ data: any }> = ({ data }) => {
  const document = useMemo(() => {
    // 处理文档数据
    return processDocumentData(data);
  }, [data]);

  return <ReactRenderer document={document} />;
};
```

### 2. 使用 computed 优化 Vue 组件

```vue
<template>
  <VueRenderer :document="processedDocument" />
</template>

<script setup>
import { computed } from 'vue';
import { VueRenderer } from 'json2docs';

const props = defineProps(['rawData']);

const processedDocument = computed(() => {
  // 处理文档数据
  return processDocumentData(props.rawData);
});
</script>
```

## 错误处理

组件提供了完善的错误处理机制：

```vue
<template>
  <VueRenderer
    :document="document"
    @error="handleError"
  />
</template>

<script>
export default {
  methods: {
    handleError(error) {
      // 处理不同类型的错误
      if (error.includes('Invalid document structure')) {
        this.showMessage('文档结构无效');
      } else if (error.includes('JSON parsing failed')) {
        this.showMessage('JSON格式错误');
      } else {
        this.showMessage('渲染失败，请重试');
      }
    }
  }
};
</script>
```

## 注意事项

1. **Vue版本要求**: 需要 Vue 3.x
2. **React版本要求**: 需要 React 18.x
3. **文档格式**: 必须符合预定义的Document接口
4. **样式隔离**: 组件会自动注入必要的CSS样式
5. **异步渲染**: 文档渲染是异步的，会显示加载状态