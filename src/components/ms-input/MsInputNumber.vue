
<template>
  <div class="form-input flex flex-1" :class="[flexRow ? 'flex-row items-center' : 'flex-col', size]">
    <label v-if="label" class="text-primary">
      {{ label }}
      <span v-if="isRequired" class="required-icon">*</span>
    </label>
    <InputNumber
      ref="inputNumberRef"
      style="text-align: end"
      :min="0"
      :mode="mode"
      locale="vi-VN"
      :showButtons="hasButton"
      :class="[error_message && 'input-number-error']"
      :name="name"
      :type="type"
      :modelValue="modelValue"
      :disabled="disabled"
      :minFractionDigits="0"
      :maxFractionDigits="numType === 'decimal' ? 22 : 0"
      @update:modelValue="(val) => emit('update:modelValue', val)"
      @keyup="handleKeyup"
      
    >
      <template #incrementicon>
        <span class="icon up-icon" tabindex="-1"></span>
      </template>
      <template #decrementicon>
        <span class="icon dropdown-icon" tabindex="-1"></span>
      </template>
    </InputNumber>
    <small v-if="error_message" :class="['error-text', 'show']">{{
      error_message
    }}</small>
  </div>
</template>

<script setup>
import InputNumber from 'primevue/inputnumber'
import { ref, onMounted, onBeforeUnmount } from 'vue'

//#region Props
defineProps({
  label: String,
  type: String,
  name: String,
  placeholder: String,
  isRequired: Boolean,
  size: {
    type: String,
    default: 'medium',
  },
  modelValue: [String, Number],
  error_message: String,
  flexRow: Boolean,
  hasButton: Boolean,
  mode: {
    type: String,
    default: 'decimal', // 'decimal' để có dấu phân cách hàng nghìn
  },
  numType: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
//#endregion Props

//#region Emits
const emit = defineEmits(['update:modelValue'])
//#endregion Emits

const inputNumberRef = ref(null)

const handleInput = (event) => {
  const raw = event?.target?.value ?? ''
  if (raw === '') {
    emit('update:modelValue', null)
    return
  }
  // Loại bỏ dấu chấm (phân cách hàng nghìn) và thay dấu phẩy (thập phân) bằng dấu chấm chuẩn JS
  const normalized = String(raw).replace(/\./g, '').replace(/,/g, '.')
  const num = Number(normalized)
  if (!Number.isNaN(num)) {
    emit('update:modelValue', num)
  }
}

const handleKeyup = () => {
  // Tìm input element và lấy giá trị thô khi gõ phím
  if (inputNumberRef.value) {
    const inputEl = inputNumberRef.value.$el?.querySelector('input')
    if (inputEl) {
      const raw = inputEl.value ?? ''
      if (raw === '') {
        emit('update:modelValue', null)
        return
      }
      // Parse giá trị: bỏ dấu chấm (ngàn), đổi phẩy (thập phân) thành dấu chấm
      const normalized = String(raw).replace(/\./g, '').replace(/,/g, '.')
      const num = Number(normalized)
      if (!Number.isNaN(num)) {
        emit('update:modelValue', num)
      }
    }
  }
}

onMounted(() => {
  if (inputNumberRef.value) {
    // Tìm input element thật bên trong component PrimeVue
    const inputEl = inputNumberRef.value.$el.querySelector('input')
    if (inputEl) {
      inputEl.addEventListener('input', handleInput)
    }
  }
})

onBeforeUnmount(() => {
  if (inputNumberRef.value) {
    const inputEl = inputNumberRef.value.$el.querySelector('input')
    if (inputEl) {
      inputEl.removeEventListener('input', handleInput)
    }
  }
})
</script>
<style>
.form-input {
  gap: 8px;
}

.form-input .text-primary {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.form-input .p-inputnumber {
  width: 100%;
}

.p-inputnumber-input {
  text-align: end;
}

.form-input input {
  padding: 0 14px 0 14px;
  width: 100%;
  outline: none;
  border: 1px solid #afafaf !important;
  border-radius: 2.5px;
  font-size: 13px;
  color: var(--text-color);
  height: 35px;
}

.form-input.large input {
  height: 35px;
}

.form-input.medium input {
  height: 32px;
}

.form-input.small input {
  height: 28px;
}

.p-inputtext {
  border: 1px solid #afafaf !important;
}

.input-number-error .p-inputtext {
  border: 1px solid #e74c3c !important;
}

/* focus */
input:focus:not(:disabled),
input:hover:not(:disabled) {
  outline: none;
}

.p-inputnumber-stacked .p-inputnumber-input {
  padding-inline-end: 36px !important;
}

.error-text {
  color: #e74c3c;
  font-size: 12px;
  min-height: 16px;
  display: none;
}

.error-text.show {
  display: block;
}

.required-icon {
  color: #e74c3c;
  margin-left: 2px;
}

.form-input input:disabled {
  cursor: not-allowed;
}

button.p-inputnumber-button.p-inputnumber-decrement-button {
  width: 32px !important;
}

button.p-inputnumber-button.p-inputnumber-increment-button {
  width: 32px !important;
}

.p-inputnumber-stacked .p-inputnumber-button-group {
  height: 20px !important;
  inset-block-start: 8px !important;
}

.p-inputnumber-button:not(:disabled):hover {
  background: none !important;
}

.p-inputtext:enabled:hover,
.p-inputtext:enabled:focus {
  border: 1px solid #888 !important;
  outline: none;
}
</style>
