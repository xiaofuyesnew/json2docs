<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '在此输入JSON...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const textarea = ref(null)

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}

// 格式化JSON
function formatJson() {
  try {
    if (!props.modelValue)
      return

    const parsed = JSON.parse(props.modelValue)
    const formatted = JSON.stringify(parsed, null, 2)

    emit('update:modelValue', formatted)
  }
  catch (error) {
    // 如果JSON无效，不进行格式化
    console.error('Invalid JSON:', error)
  }
}

// 暴露方法给父组件
defineExpose({
  formatJson,
  focus: () => textarea.value?.focus(),
})
</script>

<template>
  <div class="json-editor">
    <textarea
      ref="textarea"
      class="h-full w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="updateValue"
    />
  </div>
</template>
