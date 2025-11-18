<template>
  <tfoot class="ms-table-footer">
    <tr>
      <td colspan="6" class="pagination-cell">
        <div class="footer-left">
          <span class="total-text"
            >Tổng số: <strong>{{ totalRows }}</strong> bản ghi</span
          >

          <select
            :value="pageSize"
            @change="$emit('update:pageSize', Number($event.target.value))"
            class="page-size-select"
          >
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>

          <div class="page-nav">
            <button
              class="nav-btn"
              :disabled="currentPage === 1"
              @click="$emit('update:currentPage', currentPage - 1)"
            >
            <span class="previous-icon"></span>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['page-btn', { active: page === currentPage }]"
              @click="$emit('update:currentPage', page)"
            >
              {{ page }}
            </button>
            <span v-if="showEllipsis">...</span>
            <button
              v-if="totalPages > 5"
              class="page-btn"
              @click="$emit('update:currentPage', totalPages)"
            >
              {{ totalPages }}
            </button>
            <button
              class="nav-btn "
              :disabled="currentPage === totalPages"
              @click="$emit('update:currentPage', currentPage + 1)"
            >
            <span class="next-icon"></span>
            </button>
          </div>
        </div>
      </td>

      <td
        class="summary-value text-right"
        :style="getColStyle(summaryFields[0])"
      >
        {{ selectedCount }}
      </td>

      <td
        class="summary-value text-right"
        :style="getColStyle(summaryFields[1])"
      >
        {{ formatNumber(totalAmount) }}
      </td>

      <td
        class="summary-value text-right"
        :style="getColStyle(summaryFields[2])"
      >
        {{ formatNumber(totalDepreciation) }}
      </td>

      <td
        class="summary-value text-right"
        :style="getColStyle(summaryFields[3])"
      >
        {{ formatNumber(totalValue) }}
      </td>

      <td class="action-col"></td>
    </tr>
  </tfoot>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  colWidths: {
    type: Object,
    default: () => ({}),
  },
  totalRows: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  selectedCount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  totalDepreciation: {
    type: Number,
    default: 0,
  },
  totalValue: {
    type: Number,
    default: 0,
  },
})

defineEmits(['update:currentPage', 'update:pageSize'])

// Lấy 4 trường cuối cùng
const summaryFields = computed(() => {
  if (!props.fields || props.fields.length === 0) return []
  // Lấy 4 trường cuối cùng trong mảng fields
  return props.fields.slice(-4)
})

// Hàm lấy style width như trong Header và Body
const getColStyle = (field) => {
  if (!field) return {}
  const width = props.colWidths[field.key] || field.width || 'auto'
  const minWidth = field.minWidth || '80px'
  return {
    width: width,
    minWidth: minWidth,
    maxWidth: width,
  }
}

const totalPages = computed(() => {
  return Math.ceil(props.totalRows / props.pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (props.currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
    } else if (props.currentPage >= totalPages.value - 2) {
      for (let i = totalPages.value - 3; i < totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
        pages.push(i)
      }
    }
  }

  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > 5 && props.currentPage < totalPages.value - 2
})

const formatNumber = (value) => {
  return Number(value).toLocaleString('vi-VN')
}
</script>

<style scoped>
.ms-table-footer {
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.ms-table-footer tr,
.ms-table-footer td {
  height: 40px;
  padding: 10px 8px;
  box-sizing: border-box;
}

.pagination-cell {
  padding: 10px 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.footer-left {
  display: flex;
  align-items: center;
  padding: 0 4px;
  gap: 30px;
  flex-wrap: nowrap;
  width: 100%;
  overflow: hidden;
}

.summary-value {
  text-align: right;
  font-size: 13px;
  color: #333;
  font-weight: 700;
  white-space: nowrap;
  padding: 10px 8px;
  box-sizing: border-box;
}

.action-col {
  width: 105px !important;
  min-width: 105px !important;
  max-width: 105px !important;
  box-sizing: border-box;
}

.total-text {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}
.total-text strong {
  color: #333;
  font-weight: 700;
}
.page-size-select {
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  background: #ffffff;
  min-width: 60px;
  flex-shrink: 0;
}
.page-nav {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}
.nav-btn{
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn {
  padding: 6px 10px;
  border: 1px solid #d0d0d0;
  background: #ffffff;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}



.page-btn:hover {
  background: #f0f0f0;
}
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-btn.active {
  background: #f5f5f5;
}
.text-right {
  text-align: right;
}
.text-center{
  text-align: center;
}
.text-left{
  text-align: left;
}
</style>
