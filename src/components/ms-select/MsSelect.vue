<template>
  <div class="ms-select-wrapper">
    <i v-if="iconLeft" :class="['ms-select-icon-left', iconLeft]"></i>
    <Select
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'ms-select',
        { 'has-icon-left': iconLeft },
        { 'has-icon-right': iconRight },
        selectClass,
      ]"
      variant="filled"
    />
    <i v-if="iconRight" :class="['ms-select-icon-right', iconRight]"></i>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Chọn...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selectClass: {
    type: String,
    default: '',
  },
  iconLeft: {
    type: String,
    default: '',
  },
  iconRight: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.ms-select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.ms-select-icon-left {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
  pointer-events: none;
  z-index: 1;
}

.ms-select-icon-right {
  position: absolute;
  right: 36px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
  pointer-events: none;
  z-index: 1;
}

.ms-select.has-icon-left :deep(.p-select) {
  padding-left: 36px;
}

.ms-select.has-icon-right :deep(.p-select) {
  padding-right: 60px;
}
</style>
