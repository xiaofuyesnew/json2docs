<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'html',
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedFormat = ref(props.modelValue)

const formats = [
  {
    value: 'html',
    label: 'HTML',
    icon: 'i-carbon-code',
    color: 'text-blue-600',
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: 'i-carbon-document-pdf',
    color: 'text-red-600',
  },
  {
    value: 'docx',
    label: 'DOCX',
    icon: 'i-carbon-document',
    color: 'text-green-600',
  },
]

watch(selectedFormat, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <div class="format-selector">
    <div class="flex gap-4">
      <label
        v-for="format in formats"
        :key="format.value"
        class="format-option"
        :class="{ selected: modelValue === format.value }"
      >
        <input
          v-model="selectedFormat"
          type="radio"
          :value="format.value"
          class="hidden"
        >
        <div
          class="cursor-pointer border rounded-md p-4 transition-all hover:border-blue-300"
          :class="modelValue === format.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
        >
          <div class="mb-2 text-center">
            <div :class="`${format.icon} text-2xl mx-auto ${format.color}`" />
          </div>
          <div class="text-center font-medium">{{ format.label }}</div>
        </div>
      </label>
    </div>
  </div>
</template>
