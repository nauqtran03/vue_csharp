<template>
  <div class="ms-input-wrapper" :class="flexRow ? 'flex-row items-center' : 'flex-col'">
    <!-- Label -->
    <label v-if="label" class="ms-input-label">
      {{ label }}
      <span v-if="isRequired" class="required-mark">*</span>
    </label>

    <!-- Input Container -->
    <div :class="['ms-input-container', size, { 'has-error': error_message }]">
      <span v-if="leftIcon" class="icon" :class="leftIcon"></span>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="inputClass"
        class="ms-input-field"
        :disabled="disabled"
        :readonly="readonly"
      />
      <span v-if="rightIcon" class="icon" :class="rightIcon"></span>
    </div>

    <!-- Error message -->
    <small v-if="error_message" class="error-message">{{ error_message }}</small>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  error_message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium'
  },
  flexRow: {
    type: Boolean,
    default: false
  },
  leftIcon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  inputClass: {
    type: String,
    default: ''
  },
  tabindex: {
    type: [Number, String],
    default: undefined
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.ms-input-wrapper {
  display: flex;
  gap: 8px;
  width: 100%;
}

.ms-input-wrapper.flex-row {
  flex-direction: row;
  align-items: center;
}

.ms-input-wrapper.flex-col {
  flex-direction: column;
}

.ms-input-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.required-mark {
  color: #e74c3c;
  margin-left: 2px;
}

.ms-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border-radius: 2.5px;
  border: 1px solid #afafaf;
  padding: 0 8px;
  transition: border-color 0.2s;
  width: 100%;
}

.ms-input-container.large {
  height: 35px;
}

.ms-input-container.medium {
  height: 34px;
}

.ms-input-container.small {
  height: 28px;
}

.ms-input-container:hover:not(:has(input:disabled)) {
  border-color: #888;
}

.ms-input-container:focus-within {
  border-color: var(--btn-primary, #1890ff);
}

.ms-input-container.has-error {
  border-color: #e74c3c;
}

.ms-input-field {
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  flex: 1;
  width: 100%;
}

.ms-input-field::placeholder {
  color: #999;
  font-style: italic;
}

.ms-input-field:disabled {
  cursor: not-allowed;
  padding: 10px;
  margin: 0 -9px;
  background-color: #00000014;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  min-height: 16px;
}
</style>
