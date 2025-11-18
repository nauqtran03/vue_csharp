<template>
  <div class="asset-page">
    <!-- Toolbar -->
    <div class="toolbar d-flex justify-content-between align-items-center">
      <!-- Left side -->
      <div class="toolbar-left d-flex flex-1 align-items-center gap-12">
        <!-- Search input -->
        <div class="search-box d-flex align-items-center gap-8">
          <MsInput
            v-model="searchText"
            placeholder="Tìm kiếm tài sản"
            left-icon="search-icon"
            input-class="search-input flex-1"
          />
        </div>

        <!-- Filter: Loại tài sản -->
        <div class="filter-box d-flex align-items-center gap-8">
          <MsFilterSelect
            v-model="assetType"
            :options="assetTypes"
            placeholder="Loại tài sản"
            option-label="name"
            option-value="id"
          >
            <template #left-icon>
              <span class="icon filter-icon"></span>
            </template>
            <template #right-icon>
              <span class="icon dropdown-icon"></span>
            </template>
          </MsFilterSelect>
        </div>

        <!-- Filter: Bộ phận sử dụng -->
        <div class="filter-box d-flex align-items-center gap-8">
          <MsFilterSelect
            v-model="department"
            :options="departments"
            placeholder="Bộ phận sử dụng"
            option-label="name"
            option-value="id"
          >
            <template #left-icon>
              <span class="icon filter-icon"></span>
            </template>
            <template #right-icon>
              <span class="icon dropdown-icon"></span>
            </template>
          </MsFilterSelect>
        </div>
      </div>

      <!-- Right side -->
      <div class="toolbar-right d-flex align-items-center gap-12">
        <!-- Button: Thêm tài sản -->
        <MsButton
          button-type="primary"
          size="medium"
          @click="handleAddAsset"
        >
          +Thêm tài sản
        </MsButton>

        <!-- Button: Excel -->
        <MsButton
          button-type="default"
          size="medium"
          button-class="btn-icon"
          @click="handleExportExcel"
        >
          <span class="icon excel-icon"></span>
        </MsButton>

        <!-- Button: Delete -->
        <MsButton
          button-type="danger"
          size="medium"
          button-class="btn-icon"
          @click="handleDeleteSelected"
        >
          <span class="icon delete-icon-red"></span>
        </MsButton>
      </div>
    </div>

    <!-- Table content -->
    <div class="table-container">
      <MsTable
        :fields="tableFields"
        :rows="tableRows"
        @edit="handleEdit"
        @duplicate="handleDuplicate"
        @selection-change="handleSelectionChange"
      />
    </div>

    <!-- Asset Modal -->
    <AssetModal
      v-model:isOpen="isModalOpen"
      :mode="modalMode"
      :assetData="selectedAsset"
      @submit="handleSubmitAsset"
    />
  </div>
</template>

<script setup>
//#region Imports
import { ref } from 'vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsFilterSelect from '@/components/ms-filter/MsFilterSelect.vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButton from '@/components/ms-button/MsButton.vue'
import AssetModal from './AssetModal.vue'
//#endregion

//#region State - Filter
const searchText = ref('')
const assetType = ref(null)
const department = ref(null)


const assetTypes = ref([
  { id: 1, name: 'Máy tính' },
  { id: 2, name: 'Bàn ghế' },
  { id: 3, name: 'Thiết bị văn phòng' }
])

const departments = ref([
  { id: 1, name: 'Phòng IT' },
  { id: 2, name: 'Phòng Kế toán' },
  { id: 3, name: 'Phòng Nhân sự' }
])
//#endregion

//#region State - Table

const tableFields = ref([
  { key: 'maTaiSan', label: 'Mã tài sản', type: 'text', width: '80px', minWidth: '80px' },
  { key: 'tenTaiSan', label: 'Tên tài sản', type: 'text', width: '200px', minWidth: '150px' },
  { key: 'loaiTaiSan', label: 'Loại tài sản', type: 'text', width: '200px', minWidth: '150px' },
  { key: 'boPhanSuDung', label: 'Bộ phận sử dụng', type: 'text', width: '200px', minWidth: '150px' },
  { key: 'soLuong', label: 'Số lượng', type: 'number', width: '100px', minWidth: '100px' },
  { key: 'nguyenGia', label: 'Nguyên giá', type: 'number', width: '100px', minWidth: '100px' },
  { key: 'hmKhHaoKe', label: 'HM/KH lũy kế', type: 'number', width: '100px', minWidth: '100px' },
  { key: 'giaTriConLai', label: 'Giá trị còn lại', type: 'number', width: '100px', minWidth: '100px' }
])
const tableRows = ref([
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
{
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },

{
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
  {
    id: 1,
    maTaiSan: 'TS00001',
    tenTaiSan: 'Dell Inspiron 3467',
    loaiTaiSan: 'Máy vi tính xách tay',
    boPhanSuDung: 'Phòng Hành chính Kế toán',
    soLuong: 1,
    nguyenGia: 20000000,
    hmKhHaoKe: 894000,
    giaTriConLai: 19106000
  },
])
//#endregion

//#region State - Modal
const isModalOpen = ref(false)
const modalMode = ref('add') // 'add', 'edit', 'duplicate'
const selectedAsset = ref(null)
const selectedRows = ref([])
//#endregion

//#region Methods - Button Actions
/**
 * Xử lý thêm tài sản mới
 */
const handleAddAsset = () => {
  modalMode.value = 'add'
  selectedAsset.value = null
  isModalOpen.value = true
}

/**
 * Xử lý xuất Excel
 */
const handleExportExcel = () => {
  console.log('Export to Excel')
  // TODO: Implement export logic
}

/**
 * Xử lý xóa các dòng đã chọn
 */
const handleDeleteSelected = () => {
  if (selectedRows.value.length === 0) {
    alert('Vui lòng chọn ít nhất một tài sản để xóa')
    return
  }

  console.log('Delete selected:', selectedRows.value)
  // TODO: Show confirm modal and delete
}
//#endregion

//#region Methods - Table Actions
/**
 * Xử lý edit row
 */
const handleEdit = (row) => {
  modalMode.value = 'edit'
  selectedAsset.value = row
  isModalOpen.value = true
}

/**
 * Xử lý duplicate row
 */
const handleDuplicate = (row) => {
  modalMode.value = 'duplicate'
  selectedAsset.value = row
  isModalOpen.value = true
}

/**
 * Xử lý khi selection thay đổi
 */
const handleSelectionChange = (selectedIds) => {
  selectedRows.value = selectedIds
  console.log('Selected IDs:', selectedIds)
}
//#endregion

//#region Methods - Modal Actions
/**
 * Xử lý submit form từ modal
 */
const handleSubmitAsset = (formData) => {
  console.log('Submit asset:', formData)

  if (modalMode.value === 'add') {
    // TODO: Call API to add asset
    console.log('Adding new asset...')
  } else if (modalMode.value === 'edit') {
    // TODO: Call API to update asset
    console.log('Updating asset...')
  } else if (modalMode.value === 'duplicate') {
    // TODO: Call API to duplicate asset
    console.log('Duplicating asset...')
  }

  // Close modal after submit
  isModalOpen.value = false
}
//#endregion
</script>

<style scoped>
.asset-page {
  padding: 14px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  border-radius: 4px;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: nowrap;
}

.toolbar-left {
  overflow: hidden;
  min-width: 0;
  flex: 1;
  min-width: 600px;
}

.toolbar-right {
  flex-shrink: 0;
}

.toolbar-right :deep(button) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Search box */
.search-box {
  border-radius: 2.5px;
  max-width: 100%;
  height: 35px;
  padding: 0 8px;
}

.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  min-width: 0;
}

.search-input::placeholder {
  color: #999;
}

/* Filter box */
.filter-box {
  border-radius: 2.5px;
  width: 219px;
  max-width: 100%;
  height: 35px;
  padding: 0 8px;
  cursor: pointer;
}

/* Button icon style */
.btn-icon {
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  min-width: 36px;
}

.btn-icon .icon {
  margin: 0;
}

/* Table container */
.table-container {
  flex: 1;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
