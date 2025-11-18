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
      iconDisplay="input"
      @update:modelValue="emit('update:modelValue', $event)"
      :class="[error_message && 'date-error']"
      :pt="{
        pcInputText: { root: { tabindex: tabindex } },
      }">
      <template #inputicon>
        <span class="icon calendar-icon"></span>
      </template>
    </DatePicker>

    <small v-if="error_message" :class="['error-text', 'show']">{{
      error_message
    }}</small>
  </div>
</template>

  <script setup>
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
//#region Props
const props = defineProps({
  tabindex: Number,
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
//#endregion Props
//#region State
const { t } = useI18n()
const dp = ref(null)
const date = ref(props.modelValue || new Date())

//#endregion State

//#region Emits
const emit = defineEmits(['update:modelValue'])
//#endregion Emits

// Xử lý truyền modelValue ra ngoài
onMounted(() => {
  emit('update:modelValue', date.value)
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

.p-datepicker-header {
  padding: 0 !important;
  border: none !important;
  padding-left: 12px !important;
}

.p-datepicker:has(.p-datepicker-input-icon-container) .p-datepicker-input {
  padding: 0 14px 0 14px;
  width: 100%;
  outline: none;
  border: 1px solid #afafaf !important;
  border-radius: 2.5px;
  font-size: 13px;
  color: var(--text-color);
  height: 35px;
}

.p-datepicker:has(.p-datepicker-input-icon-container) .p-datepicker-input:hover,
.p-datepicker:has(.p-datepicker-input-icon-container) .p-datepicker-input:focus {
  border: 1px solid #888 !important;
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
