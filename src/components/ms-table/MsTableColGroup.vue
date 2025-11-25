<template>
  <colgroup>
    <col :style="{ width: 'var(--table-checkbox-width)' }" />
    <col :style="{ width: 'var(--table-stt-width)' }" />
    <col
      v-for="field in fields"
      :key="field.key"
      :style="{ width: colWidths[field.key] || field.width || field.minWidth || '100px' }"
    />
    <col :style="{ width: '100px' }" />
  </colgroup>
</template>

<script setup>
defineProps({
  fields: {
    type: Array,
    required: true
  },
  colWidths: {
    type: Object,
    default: () => ({})
  }
})
</script>
