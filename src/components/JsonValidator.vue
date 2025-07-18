<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  jsonText: {
    type: String,
    required: true,
  },
  validateSchema: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['validationChange', 'quickFix'])

const validationResult = ref({
  valid: false,
  errors: [],
  warnings: [],
})

// 防抖处理，避免频繁验证
let validationTimer = null
const isValidating = ref(false)

// 监听JSON文本变化
watch(() => props.jsonText, (newValue) => {
  // 清除之前的定时器
  if (validationTimer) {
    clearTimeout(validationTimer)
  }

  // 如果文本为空，立即验证
  if (!newValue.trim()) {
    validateJson(newValue)
    return
  }

  // 显示验证中状态
  isValidating.value = true

  // 否则延迟验证，提供更好的用户体验
  validationTimer = setTimeout(() => {
    validateJson(newValue)
    isValidating.value = false
  }, 300)
}, { immediate: true })

// 验证JSON
function validateJson(jsonText) {
  const result = {
    valid: false,
    errors: [],
    warnings: [],
  }

  // 检查是否为空
  if (!jsonText.trim()) {
    result.errors.push('JSON不能为空')
    validationResult.value = result
    emit('validationChange', result)
    return
  }

  // 验证JSON语法
  try {
    const parsedJson = JSON.parse(jsonText)
    result.valid = true

    // 基本结构验证
    if (props.validateSchema) {
      // 检查版本
      if (!parsedJson.version) {
        result.warnings.push('缺少文档版本信息，建议添加version字段')
      }
      else if (parsedJson.version !== '1.0') {
        result.warnings.push(`文档版本为${parsedJson.version}，推荐使用1.0`)
      }

      // 检查元数据
      if (!parsedJson.metadata) {
        result.warnings.push('缺少文档元数据，建议添加metadata字段')
      }
      else {
        if (!parsedJson.metadata.title) {
          result.warnings.push('缺少文档标题，建议在metadata中添加title字段')
        }
        if (!parsedJson.metadata.author) {
          result.warnings.push('缺少文档作者信息')
        }
        if (!parsedJson.metadata.created) {
          result.warnings.push('缺少文档创建时间')
        }
      }

      // 检查内容
      if (!Array.isArray(parsedJson.content)) {
        result.valid = false
        result.errors.push('文档内容必须是数组格式')
      }
      else if (parsedJson.content.length === 0) {
        result.warnings.push('文档内容为空，建议添加至少一个内容块')
      }
      else {
        // 检查内容块类型和结构
        const validTypes = ['heading', 'paragraph', 'list', 'table', 'image']
        let invalidBlockCount = 0
        parsedJson.content.forEach((block, index) => {
          if (!block.type) {
            result.errors.push(`内容块${index + 1}缺少type字段`)
          }
          else if (!validTypes.includes(block.type)) {
            invalidBlockCount++
            result.warnings.push(`内容块${index + 1}使用了不支持的类型: ${block.type}`)
          }
          else {
            // 验证特定类型的必需字段
            validateContentBlock(block, index + 1, result)
          }
        })

        if (invalidBlockCount > 0) {
          result.warnings.push(`支持的内容块类型: ${validTypes.join(', ')}`)
        }
      }

      // 检查样式
      if (parsedJson.styles && typeof parsedJson.styles !== 'object') {
        result.warnings.push('样式配置应该是对象格式')
      }
    }
  }
  catch (error) {
    result.errors.push(`JSON解析错误: ${error.message}`)

    // 提供更详细的错误信息
    if (error.message.includes('Unexpected token')) {
      result.errors.push('提示: 检查是否有多余的逗号、缺少引号或括号不匹配')
    }
    else if (error.message.includes('Unexpected end')) {
      result.errors.push('提示: JSON可能不完整，检查是否缺少结束括号')
    }
  }

  validationResult.value = result
  emit('validationChange', result)
}

// 验证内容块的具体结构
function validateContentBlock(block, blockIndex, result) {
  switch (block.type) {
    case 'heading':
      if (!block.text) {
        result.errors.push(`标题块${blockIndex}缺少text字段`)
      }
      if (!block.level || block.level < 1 || block.level > 6) {
        result.warnings.push(`标题块${blockIndex}的level应该在1-6之间`)
      }
      break

    case 'paragraph':
      if (!block.text) {
        result.errors.push(`段落块${blockIndex}缺少text字段`)
      }
      if (block.alignment && !['left', 'center', 'right', 'justify'].includes(block.alignment)) {
        result.warnings.push(`段落块${blockIndex}的alignment值无效`)
      }
      break

    case 'list':
      if (!Array.isArray(block.items)) {
        result.errors.push(`列表块${blockIndex}的items必须是数组`)
      }
      else if (block.items.length === 0) {
        result.warnings.push(`列表块${blockIndex}为空`)
      }
      if (!['ordered', 'unordered'].includes(block.listType)) {
        result.warnings.push(`列表块${blockIndex}的listType应该是ordered或unordered`)
      }
      break

    case 'table':
      if (!Array.isArray(block.headers)) {
        result.errors.push(`表格块${blockIndex}的headers必须是数组`)
      }
      if (!Array.isArray(block.rows)) {
        result.errors.push(`表格块${blockIndex}的rows必须是数组`)
      }
      else if (block.headers && block.rows.length > 0) {
        const headerCount = block.headers.length
        const invalidRows = block.rows.filter(row => row.length !== headerCount)
        if (invalidRows.length > 0) {
          result.warnings.push(`表格块${blockIndex}中有${invalidRows.length}行的列数与表头不匹配`)
        }
      }
      break

    case 'image':
      if (!block.src) {
        result.errors.push(`图片块${blockIndex}缺少src字段`)
      }
      if (!block.alt) {
        result.warnings.push(`图片块${blockIndex}建议添加alt字段以提高可访问性`)
      }
      break
  }
}

// 获取错误修复建议
function getFixSuggestion(error) {
  if (error.includes('Unexpected token')) {
    return '检查是否有多余的逗号、缺少引号或括号不匹配'
  }
  if (error.includes('Unexpected end')) {
    return 'JSON可能不完整，检查是否缺少结束括号'
  }
  if (error.includes('缺少type字段')) {
    return '每个内容块都需要指定type字段，如：heading, paragraph, list等'
  }
  if (error.includes('必须是数组')) {
    return '该字段应该使用方括号[]包围，如：["item1", "item2"]'
  }
  if (error.includes('列数与表头不匹配')) {
    return '确保表格每行的数据数量与headers数组长度相同'
  }
  if (error.includes('不支持的类型')) {
    return '使用支持的内容块类型：heading, paragraph, list, table, image'
  }
  if (error.includes('level应该在1-6之间')) {
    return '标题级别必须是1到6之间的整数'
  }
  return null
}

// 获取常见解决方案
function getCommonSolutions(error) {
  const solutions = []

  if (error.includes('Unexpected token') || error.includes('Unexpected end')) {
    solutions.push('使用JSON格式化工具检查语法')
    solutions.push('确保所有字符串都用双引号包围')
    solutions.push('检查对象和数组的括号是否正确配对')
  }

  if (error.includes('缺少') && error.includes('字段')) {
    solutions.push('参考文档格式规范添加必需字段')
    solutions.push('查看示例数据了解正确格式')
  }

  if (error.includes('数组') || error.includes('对象')) {
    solutions.push('检查数据类型是否正确')
    solutions.push('确保使用正确的JSON语法')
  }

  if (error.includes('表格') || error.includes('列数')) {
    solutions.push('检查表格headers和rows的数据一致性')
    solutions.push('确保每行数据数量相同')
  }

  return solutions
}
</script>

<template>
  <div class="json-validator">
    <!-- 验证中状态 -->
    <div v-if="isValidating" class="validation-loading">
      <div class="mb-2 flex items-center rounded-md bg-blue-50 p-3 text-blue-700">
        <div class="i-svg-spinners-180-ring-with-bg mr-2 animate-spin text-blue-500" />
        <span class="font-medium">正在验证JSON格式...</span>
      </div>
    </div>

    <!-- 验证成功状态 -->
    <div v-else-if="validationResult.valid" class="validation-success">
      <div class="mb-2 flex items-center rounded-md bg-green-50 p-3 text-green-700">
        <div class="i-carbon-checkmark-filled mr-2 text-green-500" />
        <span class="font-medium">JSON格式有效</span>
        <div class="ml-auto text-sm text-green-600">
          {{ props.jsonText.split('\n').length }} 行
        </div>
      </div>

      <!-- 警告信息 -->
      <div v-if="validationResult.warnings.length > 0" class="space-y-2">
        <div class="text-sm text-yellow-700 font-medium">
          <div class="i-carbon-warning mr-1 inline-block" />
          建议优化 ({{ validationResult.warnings.length }})
        </div>
        <div class="space-y-1">
          <div
            v-for="(warning, index) in validationResult.warnings"
            :key="index"
            class="flex items-start rounded-md bg-yellow-50 p-2 text-sm text-yellow-700"
          >
            <div class="i-carbon-warning-alt mr-2 mt-0.5 text-yellow-500" />
            <span>{{ warning }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 验证失败状态 -->
    <div v-else-if="validationResult.errors.length > 0" class="validation-error">
      <div class="mb-3 flex items-center rounded-md bg-red-50 p-3 text-red-700">
        <div class="i-carbon-error-filled mr-2 text-red-500" />
        <span class="font-medium">JSON格式无效</span>
        <div class="ml-auto text-sm text-red-600">
          {{ validationResult.errors.length }} 个错误
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="(error, index) in validationResult.errors"
          :key="index"
          class="rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          <div class="flex items-start">
            <div class="i-carbon-close-filled mr-2 mt-0.5 text-red-500" />
            <div class="flex-1">
              <div class="font-medium">
                {{ error }}
              </div>
              <!-- 提供修复建议 -->
              <div v-if="getFixSuggestion(error)" class="mt-2 rounded bg-red-100 p-2 text-xs text-red-600">
                <div class="i-carbon-idea mr-1 inline-block" />
                <strong>修复建议:</strong> {{ getFixSuggestion(error) }}
              </div>
              <!-- 常见解决方案 -->
              <div v-if="getCommonSolutions(error).length > 0" class="mt-2">
                <div class="mb-1 text-xs text-red-600 font-medium">
                  常见解决方案:
                </div>
                <ul class="text-xs text-red-600 space-y-1">
                  <li v-for="(solution, sIndex) in getCommonSolutions(error)" :key="sIndex" class="flex items-start">
                    <div class="i-carbon-dot-mark mr-1 mt-0.5" />
                    {{ solution }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速修复按钮 -->
      <div class="mt-3 flex gap-2">
        <button
          class="btn-sm btn btn-secondary"
          @click="$emit('quickFix', 'format')"
        >
          <div class="i-carbon-code mr-1" />
          自动格式化
        </button>
        <button
          class="btn-sm btn btn-secondary"
          @click="$emit('quickFix', 'example')"
        >
          <div class="i-carbon-document-add mr-1" />
          加载示例
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="validation-empty">
      <div class="flex items-center rounded-md bg-gray-50 p-3 text-gray-500">
        <div class="i-carbon-document mr-2" />
        <span>请输入JSON数据进行验证</span>
      </div>
    </div>
  </div>
</template>
