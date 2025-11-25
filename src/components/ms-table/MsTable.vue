<template>
  <div class="ms-table-wrapper" @keydown="handleKeyDown" tabindex="0">
    <div class="ms-table-scroll-wrapper" ref="scrollWrapper">
      <table class="ms-table">
        <MsTableColGroup :fields="fields" :colWidths="colWidths" />
        <MsTableHeader
          :fields="fields"
          :colWidths="colWidths"
          :isAllSelected="isAllSelected"
          @update:colWidths="colWidths = $event"
          @select-all="handleSelectAll"
        />
        <tbody>
          <!-- Loading state -->
          <tr v-if="loading" class="loading-row">
            <td :colspan="fields.length + 3" class="loading-cell">
              <div class="loading-state">
                <div class="spinner"></div>
                <p class="loading-text">Đang tải dữ liệu...</p>
              </div>
            </td>
          </tr>

          <!-- Empty state khi không có dữ liệu -->
          <tr v-else-if="paginatedRows.length === 0" class="empty-row">
            <td :colspan="fields.length + 3" class="empty-cell">
              <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p class="empty-text">Không có bản ghi nào</p>
              </div>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="(row, index) in paginatedRows"
            :key="row[rowKey] || index"
            :class="{ 'selected': selectedRows.includes(row[rowKey]), 'focused': focusedRowIndex === index }"
            @click="handleRowClick(row[rowKey], index, $event)"
            @contextmenu.prevent="handleContextMenu(row, index, $event)"
          >
            <!-- Checkbox -->
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="row[rowKey] != null && selectedRows.includes(row[rowKey])"
                :disabled="row[rowKey] == null"
                @change="handleSelectRow(row[rowKey], $event.target.checked)"
              />
            </td>

            <!-- STT -->
            <td class="stt-col">{{ (props.currentPage - 1) * props.pageSize + index + 1 }}</td>

            <!-- Dynamic columns -->
            <td
              v-for="field in fields"
              :key="field.key"
              :title="formatValue(row[field.key], field.type)"
              :class="['number', 'currency'].includes(field.type) ? 'text-right' : 'text-left'"
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
    <div class="ms-table-footer-wrapper" ref="footerWrapper" :style="{ paddingRight: scrollbarWidth + 'px' }">
      <table class="ms-table">
        <MsTableColGroup :fields="fields" :colWidths="colWidths" />
        <MsTableFooter
          :fields="fields"
          :colWidths="colWidths"
          :totalRows="totalRecords || rows.length"
          :currentPage="props.currentPage"
          :pageSize="props.pageSize"
          :selectedCount="summary?.quantityTotal || selectedRows.length"
          :totalAmount="totalAmount"
          :totalDepreciation="totalDepreciation"
          :totalValue="totalValue"
          @update:currentPage="emit('update:currentPage', $event)"
          @update:pageSize="emit('update:pageSize', $event)"
        />
      </table>
    </div>

    <!-- Context Menu -->
    <Teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="context-menu"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
        @click.stop
      >
        <div class="context-menu-item" @click="handleContextAction('add')">
          <span>Thêm</span>
        </div>
        <div class="context-menu-item" @click="handleContextAction('edit')">
          <span>Sửa</span>
        </div>
        <div class="context-menu-item" @click="handleContextAction('duplicate')">
          <span>Nhân bản</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item danger" @click="handleContextAction('delete')">
          <span>Xóa</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import MsTableHeader from '@/components/ms-table/MsTableHeader.vue'
import MsTableFooter from '@/components/ms-table/MsTableFooter.vue'
import MsTableColGroup from '@/components/ms-table/MsTableColGroup.vue'
import { formatter } from '@/utils/formatter'

const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  selectionMode: {
    type: String,
    default: 'multiple' // 'multiple' | 'single'
  },
  summary: {
    type: Object,
    default: () => ({
      quantityTotal: 0,
      priceTotal: 0,
      annualDepreciationTotal: 0,
      remainingValueTotal: 0
    })
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'duplicate', 'delete', 'add', 'selection-change', 'update:currentPage', 'update:pageSize'])

const scrollWrapper = ref(null)
const footerWrapper = ref(null)
const scrollbarWidth = ref(0)
const colWidths = ref({})
const selectedRows = ref([])
const focusedRowIndex = ref(-1)
const lastSelectedIndex = ref(-1)
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  row: null,
  index: -1
})

const isAllSelected = computed(() => {
  return props.rows.length > 0 && selectedRows.value.length === props.rows.length
})

// Server-side pagination: rows đã được phân trang từ BE
const paginatedRows = computed(() => {
  return props.rows
})

// Sử dụng summary từ BE (server-side) thay vì tính client-side
const totalAmount = computed(() => {
  return props.summary?.priceTotal || 0
})

const totalDepreciation = computed(() => {
  return props.summary?.annualDepreciationTotal || 0
})

const totalValue = computed(() => {
  return props.summary?.remainingValueTotal || 0
})

// Đảm bảo single-select luôn chỉ có tối đa 1 id được chọn
watch(
  () => props.selectionMode,
  (mode) => {
    if (mode === 'single' && selectedRows.value.length > 1) {
      selectedRows.value = selectedRows.value.slice(0, 1)
      emit('selection-change', selectedRows.value)
    }
  }
)

// Khi rows thay đổi, loại bỏ các id không còn tồn tại và đảm bảo single-select
watch(
  () => props.rows,
  (rows) => {
    const ids = new Set(rows.map(r => r[props.rowKey]))
    selectedRows.value = selectedRows.value.filter(id => ids.has(id))
    if (props.selectionMode === 'single' && selectedRows.value.length > 1) {
      selectedRows.value = selectedRows.value.slice(0, 1)
    }
    emit('selection-change', selectedRows.value)
  },
  { deep: true }
)

/**
 * Xử lý chọn/bỏ chọn tất cả các dòng trong table
 * @param {boolean} checked - True nếu chọn tất cả, false nếu bỏ chọn
 */
const handleSelectAll = (checked) => {
  if (props.selectionMode === 'single') {
    if (checked) {
      const first = props.rows[0]
      const fid = first ? first[props.rowKey] : undefined
      selectedRows.value = fid != null ? [fid] : []
    } else {
      selectedRows.value = []
    }
  } else {
    if (checked) {
      selectedRows.value = props.rows
        .map(row => row[props.rowKey])
        .filter(id => id != null)
    } else {
      selectedRows.value = []
    }
  }
  emit('selection-change', selectedRows.value)
}

/**
 * Xử lý chọn/bỏ chọn một dòng cụ thể
 * @param {string|number} id - ID của row cần chọn/bỏ chọn
 * @param {boolean} checked - True nếu chọn, false nếu bỏ chọn
 */
const handleSelectRow = (id, checked) => {
  if (id == null) return
  if (props.selectionMode === 'single') {
    selectedRows.value = checked ? [id] : []
  } else {
    if (checked) {
      if (!selectedRows.value.includes(id)) selectedRows.value.push(id)
    } else {
      selectedRows.value = selectedRows.value.filter(rowId => rowId !== id)
    }
  }
  emit('selection-change', selectedRows.value)
}

/**
 * Xử lý click vào row với Ctrl/Shift
 * @param {string|number} id - ID của row
 * @param {number} index - Index của row trong danh sách
 * @param {Event} event - Click event
 */
const handleRowClick = (id, index, event) => {
  if (id == null) return

  focusedRowIndex.value = index

  // Nếu click vào checkbox thì không xử lý
  if (event.target.type === 'checkbox') return

  // Normal click: Select single
  selectedRows.value = [id]
  lastSelectedIndex.value = index

  emit('selection-change', selectedRows.value)
}

/**
 * Xử lý phím để di chuyển, chọn tất cả và xóa
 * @param {KeyboardEvent} event - Keyboard event
 */
const handleKeyDown = (event) => {
  if (props.rows.length === 0) return

  // Ctrl: Select all
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    selectedRows.value = props.rows
      .map(row => row[props.rowKey])
      .filter(rowId => rowId != null)
    emit('selection-change', selectedRows.value)
    return
  }

  // Shift: Delete selected
  if (event.shiftKey) {
    event.preventDefault()
    if (selectedRows.value.length > 0) {
      emit('delete', selectedRows.value)
    }
    return
  }

  // Arrow Up/Down
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()

    let newIndex = focusedRowIndex.value

    if (event.key === 'ArrowUp') {
      newIndex = Math.max(0, focusedRowIndex.value - 1)
    } else if (event.key === 'ArrowDown') {
      newIndex = Math.min(props.rows.length - 1, focusedRowIndex.value + 1)
    }

    if (newIndex !== focusedRowIndex.value) {
      focusedRowIndex.value = newIndex
      const rowId = props.rows[newIndex]?.[props.rowKey]

      if (rowId != null) {
        // Chọn dòng mới
        selectedRows.value = [rowId]
        lastSelectedIndex.value = newIndex
        emit('selection-change', selectedRows.value)

        // Scroll to focused row
        scrollToRow(newIndex)
      }
    }
  }
}

/**
 * Scroll đến row được focus
 * @param {number} index - Index của row
 */
const scrollToRow = (index) => {
  if (!scrollWrapper.value) return

  const rows = scrollWrapper.value.querySelectorAll('tbody tr')
  const targetRow = rows[index]

  if (targetRow) {
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

/**
 * Xử lý context menu (chuột phải)
 * @param {Object} row - Row data
 * @param {number} index - Row index
 * @param {Event} event - Context menu event
 */
const handleContextMenu = (row, index, event) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    row: row,
    index: index
  }

  // Nếu row chưa được chọn, chọn nó
  const rowId = row[props.rowKey]
  if (rowId != null && !selectedRows.value.includes(rowId)) {
    selectedRows.value = [rowId]
    focusedRowIndex.value = index
    lastSelectedIndex.value = index
    emit('selection-change', selectedRows.value)
  }
}

/**
 * Đóng context menu
 */
const closeContextMenu = () => {
  contextMenu.value.visible = false
}

/**
 * Xử lý các action từ context menu
 */
const handleContextAction = (action) => {
  const row = contextMenu.value.row

  switch (action) {
    case 'add':
      emit('add')
      break
    case 'edit':
      emit('edit', row)
      break
    case 'duplicate':
      emit('duplicate', row)
      break
    case 'delete':
      emit('delete', [row[props.rowKey]])
      break
  }

  closeContextMenu()
}

// Click outside để đóng context menu
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeContextMenu)
  window.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('.ms-table-wrapper')) {
      closeContextMenu()
    }
  })
}

/**
 * Format giá trị theo type của field (number, currency, date, text)
 * @param {any} value - Giá trị cần format
 * @param {string} type - Loại format: 'number', 'currency', 'date', 'text'
 * @returns {string} Giá trị đã được format
 */
const formatValue = (value, type) => {
  if (value === null || value === undefined) return ''

  // Sử dụng formatter từ utils
  switch (type) {
    case 'number':
      return formatter.number(value)
    case 'currency':
      return formatter.currency(value)
    case 'date':
      return formatter.date(value)
    case 'text':
    default:
      return formatter.text(value)
  }
}

/**
 * Tính toán độ rộng của scrollbar để align footer với body table
 * Scrollbar width = offsetWidth - clientWidth
 */
const calculateScrollbarWidth = () => {
  if (!scrollWrapper.value) return

  // Scrollbar width = offsetWidth - clientWidth
  scrollbarWidth.value = scrollWrapper.value.offsetWidth - scrollWrapper.value.clientWidth
}

// Đồng bộ scroll ngang: chỉ footer scroll điều khiển body
const syncHorizontalScroll = () => {
  if (scrollWrapper.value && footerWrapper.value) {
    // Chỉ footer scroll điều khiển body (1 chiều)
    footerWrapper.value.addEventListener('scroll', () => {
      if (scrollWrapper.value) {
        scrollWrapper.value.scrollLeft = footerWrapper.value.scrollLeft
      }
    })
  }
}

// Tính scrollbar width khi mount và khi rows thay đổi
onMounted(() => {
  nextTick(() => {
    calculateScrollbarWidth()
    syncHorizontalScroll()
  })
})

watch(() => props.rows, () => {
  nextTick(() => {
    calculateScrollbarWidth()
  })
}, { deep: true })

// Recalculate khi pageSize thay đổi
watch(() => props.pageSize, () => {
  nextTick(() => {
    calculateScrollbarWidth()
  })
})

// Recalculate khi resize cột
watch(colWidths, (newWidths) => {
  nextTick(() => {
    calculateScrollbarWidth()

    // Nếu có resize cột, kích hoạt scroll ngang
    const hasCustomWidths = Object.keys(newWidths).length > 0
    if (hasCustomWidths) {
      const scrollWrapperEl = scrollWrapper.value
      const footerWrapperEl = footerWrapper.value

      if (scrollWrapperEl && footerWrapperEl) {
        const tables = scrollWrapperEl.querySelectorAll('.ms-table')
        const footerTables = footerWrapperEl.querySelectorAll('.ms-table')

        // Kích hoạt scroll ngang: đổi width sang max-content
        tables.forEach(table => {
          table.style.width = 'max-content'
          table.style.minWidth = '100%'
        })

        footerTables.forEach(table => {
          table.style.width = 'max-content'
          table.style.minWidth = '100%'
        })
      }
    }
  })
}, { deep: true })
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
  outline: none;
}

.ms-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);
  flex-shrink: 0;
  table-layout: fixed;
}

/* Wrapper cho table với scroll */
.ms-table-scroll-wrapper {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden; /* Ẩn scroll ngang ở body */
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: gray #f5f5f5;
}

/* Custom scrollbar cho Webkit (Chrome, Edge, Safari) */
.ms-table-scroll-wrapper::-webkit-scrollbar {
  width: 3px !important;
  height: 3px !important;
}

.ms-table-scroll-wrapper::-webkit-scrollbar-track {
  background: #f5f5f5 !important;
  border-radius: 2px !important;
}

.ms-table-scroll-wrapper::-webkit-scrollbar-thumb {
  background: gray !important;
  border-radius: 2px !important;
}

.ms-table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #666 !important;
}

.ms-table-scroll-wrapper .ms-table {
  width: 100%;
}

/* Wrapper cho footer table để align với body khi có scrollbar */
.ms-table-footer-wrapper {
  flex-shrink: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: gray #f5f5f5;
}

/* Custom scrollbar cho footer - Webkit */
.ms-table-footer-wrapper::-webkit-scrollbar {
  width: 3px !important;
  height: 3px !important;
}

.ms-table-footer-wrapper::-webkit-scrollbar-track {
  background: #f5f5f5 !important;
  border-radius: 2px !important;
}

.ms-table-footer-wrapper::-webkit-scrollbar-thumb {
  background: gray !important;
  border-radius: 2px !important;
}

.ms-table-footer-wrapper::-webkit-scrollbar-thumb:hover {
  background: #666 !important;
}

.ms-table-footer-wrapper .ms-table {
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
  width: var(--table-checkbox-width) !important;
  min-width: var(--table-checkbox-width) !important;
  max-width: var(--table-checkbox-width) !important;
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
  width: var(--table-stt-width) !important;
  min-width: var(--table-stt-width) !important;
  max-width: var(--table-stt-width) !important;
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

tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
  height: var(--table-row-height);
}

tbody tr:hover {
  background-color: #e0f7fa !important; /* Màu xanh nhạt khi hover */
}

tbody tr.selected {
  background-color: #b2ebf2 !important; /* Màu xanh nhạt đậm hơn khi selected */
}

tbody tr.selected:hover {
  background-color: #80deea !important; /* Màu xanh đậm hơn khi vừa selected vừa hover */
}

tbody tr.focused {
  outline: 2px solid #1aa4c8;
  outline-offset: -2px;
}

tbody td {
  padding: 10px 8px;
  color: #333;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: var(--table-row-height);
  max-width: 0; /* Cho phép text-overflow hoạt động */
  min-width: 0; /* Cho phép shrink nhỏ hơn content */
}

.text-left {
  text-align: left !important;
  padding: 10px 8px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-right {
  text-align: right !important;
  padding: 10px 8px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

tbody tr:hover .action-buttons {
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

/* Loading state */
.loading-row {
  background: #fff;
  height: calc(100vh - 300px);
}

.loading-cell {
  padding: 0 !important;
  text-align: center !important;
  border: none !important;
  vertical-align: middle !important;
  width: 100% !important;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: calc(100vh - 300px);
  width: 100%;
  margin: 0 auto;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1aa4c8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* Empty state */
.empty-row {
  background: #fff;
  height: calc(100vh - 200px);
}

.empty-cell {
  padding: 0 !important;
  text-align: center !important;
  border: none !important;
  vertical-align: middle !important;
  width: 100% !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: calc(100vh - 300px);
  width: 100%;
  margin: 0 auto;
  padding-bottom: 80px;
}

.empty-icon {
  font-size: 140px;
  opacity: 0.25;
  line-height: 1;
}

.empty-text {
  font-size: 20px;
  color: #999;
  margin: 0;
  font-weight: 500;
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

/* Context Menu */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 180px;
  padding: 4px 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-item.danger {
  color: #d32f2f;
}

.context-menu-item.danger:hover {
  background-color: #ffebee;
}

.context-menu-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}

.context-menu-item .icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
