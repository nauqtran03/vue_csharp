<template>
  <thead class="ms-table-header">
    <tr>
      <!-- Checkbox column -->
      <th class="checkbox-col">
        <input
          type="checkbox"
          :checked="isAllSelected"
          @change="$emit('select-all', $event.target.checked)"
        />
      </th>

      <!-- STT column -->
      <th class="stt-col">STT</th>

      <!-- Dynamic columns -->
      <th
        v-for="field in fields"
        :key="field.key"
        :style="{
          width: colWidths[field.key] || field.width || 'auto'
        }"
        :class="['resizable-col', field.type === 'number' ? 'text-right' : 'text-left']"
      >
        <slot :name="`header-${field.key}`" :field="field">
          {{ field.label }}
        </slot>
        <div
          class="resizer"
          @mousedown.stop="onResizeStart($event, field.key)"
        ></div>
      </th>

      <!-- Action column -->
      <th class="action-col">Chức năng</th>
    </tr>
  </thead>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  colWidths: {
    type: Object,
    default: () => ({})
  },
  isAllSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:colWidths', 'select-all'])

const isResizing = ref(false)
const currentColumn = ref(null)
const startX = ref(0)
const startWidth = ref(0)

const onResizeStart = (event, columnKey) => {
  isResizing.value = true
  currentColumn.value = columnKey
  startX.value = event.pageX

  const th = event.target.parentElement
  startWidth.value = th.offsetWidth

  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
  event.preventDefault()
}

const onResizeMove = (event) => {
  if (!isResizing.value) return

  const diff = event.pageX - startX.value
  const field = props.fields.find(f => f.key === currentColumn.value)
  const minWidth = field?.minWidth ? parseInt(field.minWidth) : 80
  const newWidth = Math.max(minWidth, startWidth.value + diff)

  emit('update:colWidths', {
    ...props.colWidths,
    [currentColumn.value]: `${newWidth}px`
  })
}

const onResizeEnd = () => {
  isResizing.value = false
  currentColumn.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
}
</script>

<style scoped>
.ms-table-header {
  background-color: #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
}

.ms-table-header tr {
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  height: 38px;
}

.ms-table-header th {
  padding: 10px 8px;
  font-weight: 700;
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  user-select: none;
  box-sizing: border-box;
  height: 38px;
}

/* Width phải giống với tbody */
.checkbox-col {
  width: 36px !important;
  min-width: 36px !important;
  max-width: 36px !important;
  text-align: center;
  padding: 10px !important;
}

.checkbox-col input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
  vertical-align: middle;
  width: 16px;
  height: 16px;
}

.stt-col {
  width: 50px !important;
  min-width: 50px !important;
  max-width: 50px !important;
  text-align: center;
  padding: 10px !important;
}

.action-col {
  width: 100px !important;
  min-width: 100px !important;
  max-width: 100px !important;
  text-align: center;
}

.resizable-col {
  position: relative;
  min-width: 80px;
}

.text-left {
  text-align: left !important;
}

.text-right {
  text-align: right !important;
}

.header-content {
  display: inline-block;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
  background: transparent;
  z-index: 20;
}

.resizer:hover {
  background: #ddd;
}


</style>
