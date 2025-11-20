<template>
  <button
    :type="type"
    :class="['ms-button', sizeClass, typeClass, buttonClass]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="leftIcon" class="icon" :class="leftIcon"></span>
    <slot></slot>
    <span v-if="rightIcon" class="icon" :class="rightIcon"></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  size: {
    type: String,
    default: 'medium'
  },
  buttonType: {
    type: String,
    default: 'default' // default, primary, outline, sub, toggle, danger
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
  buttonClass: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const sizeClass = computed(() => `ms-button-${props.size}`)
const typeClass = computed(() => `ms-button-${props.buttonType}`)
</script>

<style scoped>
.ms-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.ms-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Sizes */
.ms-button-small {
  padding: 4px 12px;
  font-size: var(--font-size-small);
  height: var(--button-height-small);
}

.ms-button-medium {
  padding: 8px 16px;
  font-size: var(--font-size-base);
  height: var(--button-height);
}

.ms-button-large {
  padding: 10px 20px;
  font-size: var(--font-size-large);
  height: var(--button-height-large);
  width: 100px;
}

/* Types */
.ms-button-default {
  background: #ffffff;
  color: #000;
}

.ms-button-default:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #b0b0b0;
}

.ms-button-primary {
  background: #1aa4c8;
  color: #ffffff;
  border-color: #1aa4c8;
}

.ms-button-primary:hover:not(:disabled) {
  background: #0d8ab8;
  border-color: #0d8ab8;
}

.ms-button-outline {
  background: #ffffff;
  color: #333;
  border-color: #d0d0d0;
}

.ms-button-outline:hover:not(:disabled) {
  background: #f9f9f9;
  border-color: #1aa4c8;
  color: #1aa4c8;
}

.ms-button-sub {
  background: #f5f5f5;
  color: #666;
  border-color: #e0e0e0;
}

.ms-button-sub:hover:not(:disabled) {
  background: #e8e8e8;
  border-color: #d0d0d0;
}

.ms-button-toggle {
  background: transparent;
  border: none;
  padding: 4px;
}

.ms-button-toggle:hover:not(:disabled) {
  opacity: 0.8;
}

.ms-button-danger {
  background: #ffffff;
  color: #000;
  border-color: transparent;
}

.ms-button-danger:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #b0b0b0;
}

.ms-button-secondary {
  background: #ff3131;
  color: #ffffff;
}

.ms-button-secondary:hover:not(:disabled) {
  background: #b61919;
  border-color: #ffffff;
}
</style>

