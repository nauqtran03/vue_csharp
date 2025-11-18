<template>
  <div class="ms-filter-field">
    <!-- Label -->
    <label v-if="label" class="ms-filter-label">
      {{ label }}
      <span v-if="isRequired" class="required-mark">*</span>
    </label>

    <!-- Filter Select Wrapper -->
    <div
      :class="['ms-filter-select-wrapper', size, { 'has-error': error_message }]"
      @click="handleWrapperClick"
    >
      <!-- Left icon -->
      <slot name="left-icon">
        <span v-if="leftIcon" class="icon" :class="leftIcon"></span>
      </slot>

      <!-- PrimeVue Select với filter -->
      <Select
        ref="selectRef"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="selectClass"
        class="ms-prime-select"
        filter
        filterPlaceholder="Tìm kiếm..."
      >
        <!-- Forward value slot -->
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps"></slot>
        </template>

        <!-- Forward option slot -->
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps"></slot>
        </template>
      </Select>

      <!-- Right icon -->
      <slot name="right-icon">
        <span v-if="rightIcon" class="icon" :class="rightIcon"></span>
      </slot>
    </div>

    <!-- Error message -->
    <span v-if="error_message" class="error-message">{{ error_message }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Select from 'primevue/select'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Chọn...'
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
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
  selectClass: {
    type: String,
    default: ''
  },
  filter: {
    type: Boolean,
    default: true
  },
  filterPlaceholder: {
    type: String,
    default: 'Tìm kiếm...'
  }
})

defineEmits(['update:modelValue'])

const selectRef = ref(null)

const handleWrapperClick = () => {
  if (!props.disabled && selectRef.value) {
    const button = selectRef.value.$el?.querySelector('button')
    if (button) {
      button.click()
    }
  }
}

defineExpose({
  toggle: handleWrapperClick
})
</script>

<style scoped>
.ms-filter-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.ms-filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.required-mark {
  color: #e74c3c;
  margin-left: 2px;
}

.ms-filter-select-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 2.5px;
  border: 1px solid #afafaf;
  padding: 0 8px;
  transition: border-color 0.2s;
}

.ms-filter-select-wrapper.large {
  height: 35px;
}

.ms-filter-select-wrapper.medium {
  height: 32px;
}

.ms-filter-select-wrapper.small {
  height: 28px;
}

.ms-filter-select-wrapper:hover {
  border-color: #888;
}

.ms-filter-select-wrapper.has-error {
  border-color: #e74c3c;
}

.ms-filter-select-wrapper:hover .icon {
  opacity: 0.7;
}

.error-message {
  font-size: 12px;
  color: #e74c3c;
  margin-top: 2px;
}

/* Override PrimeVue styles */
:deep(.ms-prime-select) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  font-size: 13px;
  flex: 1;
  min-height: auto !important;
}

:deep(.ms-prime-select button) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  width: 100%;
  text-align: left;
}

:deep(.ms-prime-select .p-select-label) {
  padding: 0 !important;
  font-size: 13px;
  color: #000;
}


:deep(.ms-prime-select .p-select-dropdown) {
  display: none !important;
}
</style>

