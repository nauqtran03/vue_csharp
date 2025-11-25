<template>
  <div class="custom-datepicker" :class="[flexRow ? 'flex-row items-center' : 'flex-col', size]">
    <label v-if="label" class="text-primary">
      {{ label }}
      <span v-if="isRequired" class="required-icon">*</span>
    </label>
    <DatePicker
      dateFormat="dd/mm/yy"
      ref="dp"
      v-model="date"
      showIcon
      :placeholder="t('common.selectDate')"
      fluid
      @update:modelValue="handleDateChange"
      :class="[error_message && 'date-error']"
      :pt="{
        pcInputText: { root: { tabindex: tabindex } },
      }">
      <template #dropdownicon>
        <span class="icon calendar-icon"></span>
      </template>
    </DatePicker>

    <small v-if="error_message" :class="['error-text', 'show']">{{
      error_message
    }}</small>
  </div>
</template>

  <script setup>
import { ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  tabindex: [Number, String],
  size: {
    type: String,
    default: 'medium',
  },
  label: String,
  isRequired: Boolean,
  error_message: String,
  flexRow: Boolean,
  modelValue: {
    type: Date,
    default: () => new Date(),
  },
})

const emit = defineEmits(['update:modelValue'])

const date = ref(props.modelValue || new Date())

// Xử lý thay đổi ngày
const handleDateChange = (newDate) => {
  emit('update:modelValue', newDate)
}

// Watch modelValue để cập nhật khi giá trị thay đổi từ bên ngoài
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    date.value = newValue
  }
})
</script>

<style>
.custom-datepicker {
  display: flex;
  gap: 8px;
}


.custom-datepicker .text-primary {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.custom-datepicker.large .p-datepicker-input {
  height: 35px !important;
}

.custom-datepicker.medium .p-datepicker-input {
  height: 32px !important;
}

.custom-datepicker.small .p-datepicker-input {
  height: 28px !important;
}

:deep(.p-datepicker-header) {
  padding: 8px 12px !important;
  border: none !important;
}

:deep(.p-datepicker-panel) {
  border: 1px solid #ddd !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
}

.p-datepicker-input {
  padding: 0 40px 0 14px;
  width: 100%;
  outline: none;
  border: 1px solid #afafaf !important;
  border-radius: 2.5px;
  font-size: 13px !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
  color: var(--text-color);
  height: 35px;
}

.p-datepicker-input:hover,
.p-datepicker-input:focus {
  border: 1px solid #888 !important;
}

:deep(.p-datepicker-dropdown) {
  position: absolute !important;
  right: 1px !important;
  top: 1px !important;
  bottom: 1px !important;
  width: 35px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  background: transparent !important;
  border: none !important;
  border-left: 1px solid #afafaf !important;
}

:deep(.p-datepicker-dropdown:hover) {
  background: #f5f5f5 !important;
}

:deep(.calendar-icon) {
  cursor: pointer !important;
}

.p-datepicker {
  width: 100%;
}

.date-error .p-datepicker-input {
  border: 1px solid #e74c3c !important;
}

.required-icon {
  color: #e74c3c;
  margin-left: 2px;
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
</style>
