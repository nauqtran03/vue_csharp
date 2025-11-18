<template>
  <div class="ms-table-wrapper">
    <div class="ms-table-scroll-wrapper">
      <table class="ms-table">
        <MsTableHeader
          :fields="fields"
          :colWidths="colWidths"
          :isAllSelected="isAllSelected"
          @update:colWidths="colWidths = $event"
          @select-all="handleSelectAll"
        />
        <tbody class="ms-table-body">
          <tr
            v-for="(row, index) in paginatedRows"
            :key="row.id || index"
            :class="{ 'selected': selectedRows.includes(row.id) }"
          >
            <!-- Checkbox -->
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="selectedRows.includes(row.id)"
                @change="handleSelectRow(row.id, $event.target.checked)"
              />
            </td>

            <!-- STT -->
            <td class="stt-col">{{ (currentPage - 1) * pageSize + index + 1 }}</td>

            <!-- Dynamic columns -->
            <td
              v-for="field in fields"
              :key="field.key"
              :title="formatValue(row[field.key], field.type)"
              :class="field.type === 'number' ? 'text-right' : 'text-left'"
            >
              <slot
                :name="`cell-${field.key}`"
                :row="row"
                :value="row[field.key]"
                :field="field"
              >
                {{ formatValue(row[field.key], field.type) }}
              </slot>
            </td>

            <!-- Actions -->
            <td class="action-col">
              <slot name="actions" :row="row">
                <div class="action-buttons">
                  <button class="action-btn edit-btn" @click="$emit('edit', row)">
                    <span class="icon edit-icon"></span>
                  </button>
                  <button class="action-btn copy-btn" @click="$emit('duplicate', row)">
                    <span class="icon duplicate-icon"></span>
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer riêng -->
    <table class="ms-table">
      <MsTableColGroup :fields="fields" :colWidths="colWidths" />
      <MsTableFooter
        :fields="fields"
        :colWidths="colWidths"
        :totalRows="rows.length"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :selectedCount="selectedRows.length"
        :totalAmount="totalAmount"
        :totalDepreciation="totalDepreciation"
        :totalValue="totalValue"
        @update:currentPage="currentPage = $event"
        @update:pageSize="pageSize = $event"
      />
    </table>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import MsTableHeader from './MsTableHeader.vue'
import MsTableFooter from './MsTableFooter.vue'
import MsTableColGroup from './MsTableColGroup.vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'duplicate', 'selection-change'])

const colWidths = ref({})
const selectedRows = ref([])
const currentPage = ref(1)
const pageSize = ref(20)

const isAllSelected = computed(() => {
  return props.rows.length > 0 && selectedRows.value.length === props.rows.length
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.rows.slice(start, end)
})

// Tính tổng (ví dụ)
const totalAmount = computed(() => {
  return props.rows.reduce((sum, row) => sum + (Number(row.nguyenGia) || 0), 0)
})

const totalDepreciation = computed(() => {
  return props.rows.reduce((sum, row) => sum + (Number(row.hmKhHaoKe) || 0), 0)
})

const totalValue = computed(() => {
  return props.rows.reduce((sum, row) => sum + (Number(row.giaTriConLai) || 0), 0)
})

const handleSelectAll = (checked) => {
  if (checked) {
    selectedRows.value = props.rows.map(row => row.id)
  } else {
    selectedRows.value = []
  }
  emit('selection-change', selectedRows.value)
}

const handleSelectRow = (id, checked) => {
  if (checked) {
    selectedRows.value.push(id)
  } else {
    selectedRows.value = selectedRows.value.filter(rowId => rowId !== id)
  }
  emit('selection-change', selectedRows.value)
}

const formatValue = (value, type) => {
  if (value === null || value === undefined) return ''

  switch (type) {
    case 'number':
      return Number(value).toLocaleString('vi-VN')
    case 'date':
      return new Date(value).toLocaleDateString('vi-VN')
    default:
      return value
  }
}
</script>

<style scoped>
.ms-table-wrapper {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.ms-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  flex-shrink: 0;
}

/* Wrapper cho table với scroll */
.ms-table-scroll-wrapper {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.ms-table-scroll-wrapper .ms-table {
  width: 100%;
}

/* Sticky header */
.ms-table-scroll-wrapper thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f5f5f5;
}

/* Các cột phải có width giống nhau ở cả thead và tbody */
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
  width: 16px;
  height: 16px;
}

.stt-col {
  width: 50px !important;
  min-width: 50px !important;
  max-width: 50px !important;
  text-align: center;
  font-weight: 700;
  padding: 10px !important;
}

.action-col {
  width: 100px !important;
  min-width: 100px !important;
  max-width: 100px !important;
  text-align: center;
}

/* Các cột động - tính toán width còn lại */
.ms-table td:not(.checkbox-col):not(.stt-col):not(.action-col),
.ms-table th:not(.checkbox-col):not(.stt-col):not(.action-col):not(.resizable-col) {
  width: auto;
}

.ms-table-body tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
  height: 40px;
}

.ms-table-body tr:hover {
  background-color: #f9f9f9;
}

.ms-table-body tr.selected {
  background-color: #e3f2fd;
}

.ms-table-body td {
  padding: 10px 8px;
  color: #333;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

/* Action buttons - ẩn mặc định, hiện khi hover row */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.ms-table-body tr:hover .action-buttons {
  opacity: 1;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  opacity: 0.7;
}

.icon {
  display: inline-block;
  width: 18px;
  height: 18px;
}

/* Custom scrollbar - vertical */
.ms-table-scroll-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.ms-table-scroll-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.ms-table-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.ms-table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
