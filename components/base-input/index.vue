<template>
  <div class="relative">
    <label :for="id" class="sr-only">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
      :class="[
        'appearance-none rounded-md relative block w-full px-3 py-2 border-solid border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary',
        error ? 'border-red-500' : 'border-gray-300'
      ]"
      :placeholder="placeholder"
      :required="required"
    />
    <button
      v-if="modelValue && showClear"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
      @click.stop="handleClear"
    >
      <Icon name="mdi:close-circle" class="w-5 h-5" />
    </button>
  </div>
  <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showClear: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'clear'])

const handleClear = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  emit('update:modelValue', '')
  emit('clear')
}

</script> 
