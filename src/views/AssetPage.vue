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
import { ref, onMounted } from 'vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsFilterSelect from '@/components/ms-filter/MsFilterSelect.vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButton from '@/components/ms-button/MsButton.vue'
import AssetModal from './AssetModal.vue'
import { useI18n } from 'vue-i18n'
import APIAsset from '@/apis/components/APIAsset.js'
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
const { t } = useI18n()

// Giá trị mặc định cho tableFields (responsive theo màn hình)
const tableFields = ref([
  { key: 'assetCode', label: t('table.assetCode'), type: 'text', width: '100px', minWidth: '90px' },
  { key: 'assetName', label: t('table.assetName'), type: 'text', width: '200px', minWidth: '150px' },
  { key: 'assetTypeName', label: t('table.assetTypeName'), type: 'text', width: '150px', minWidth: '120px' },
  { key: 'departmentName', label: t('table.departmentName'), type: 'text', width: '150px', minWidth: '120px' },
  { key: 'assetQuantity', label: t('table.quantity'), type: 'number', width: '80px', minWidth: '70px' },
  { key: 'assetPrice', label: t('table.price'), type: 'number', width: '120px', minWidth: '100px' },
  { key: 'assetAnnualDepreciation', label: t('table.annualDepreciation'), type: 'number', width: '120px', minWidth: '100px' },
  { key: 'residualValue', label: t('table.residualValue'), type: 'number', width: '100px', minWidth: '100px' }
])

const tableRows = ref([])

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
  // Chuẩn hóa danh sách ID gửi về BE (List<Guid>)
  const ids = selectedRows.value.map((x) => {
    if (typeof x === 'string') return x
    return x?.assetId || x?.AssetId
  }).filter(Boolean)

  // Gọi API xóa nhiều và tải lại dữ liệu
  APIAsset.deleteMultiple(ids)
    .then(() => {
      loadAssets()
    })
    .catch((err) => console.error('Delete multiple error:', err))
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
  console.log('Submit asset - formData:', formData)
  console.log('Submit asset - selectedAsset:', selectedAsset.value)

  // Chuẩn hóa body gửi BE theo entity Asset
  const payload = {
    AssetCode: formData.assetCode ?? formData.AssetCode,
    AssetName: formData.assetName ?? formData.AssetName,
    AssetPurchaseDate: formData.purchaseDate
      ? new Date(formData.purchaseDate)
      : formData.AssetPurchaseDate
      ? new Date(formData.AssetPurchaseDate)
      : null,
    AssetStartDate: formData.startDate
      ? new Date(formData.startDate)
      : formData.AssetStartDate
      ? new Date(formData.AssetStartDate)
      : null,
    // AssetUseYear: lưu NĂM (yyyy), cắt ra từ ngày mua hoặc ngày bắt đầu sử dụng,
    // KHÔNG dùng useYears (số năm sử dụng)
    AssetUseYear: (() => {
      const srcDate = formData.startDate || formData.purchaseDate || formData.AssetStartDate || formData.AssetPurchaseDate
      if (srcDate) {
        const d = new Date(srcDate)
        if (!Number.isNaN(d.getTime())) return d.getFullYear()
      }
      return Number(formData.AssetUseYear ?? 0)
    })(),
    AssetDepreciationRate: Number(
      formData.depreciationRate ?? formData.AssetDepreciationRate ?? 0
    ),
    AssetQuantity: Number(formData.quantity ?? formData.AssetQuantity ?? 0),
    AssetPrice: Number(formData.price ?? formData.AssetPrice ?? 0),
    AssetAnnualDepreciation: Number(
      formData.annualDepreciation ?? formData.AssetAnnualDepreciation ?? 0
    ),
    DepartmentId:
      formData.departmentId ||
      formData.DepartmentId ||
      formData.departmentName?.departmentId ||
      formData.Department?.DepartmentId ||
      null,
    AssetTypeId:
      formData.assetTypeId ||
      formData.AssetTypeId ||
      formData.assetTypeName?.assetTypeId ||
      formData.AssetType?.AssetTypeId ||
      null,
  }

  console.log('Payload to send:', payload)

  let action
  if (modalMode.value === 'add' || modalMode.value === 'duplicate') {
    action = APIAsset.create(payload)
  } else if (modalMode.value === 'edit') {
    // Lấy id từ selectedAsset (đã được set khi click Edit)
    const id = selectedAsset.value?.assetId || selectedAsset.value?.AssetId || formData.assetId || formData.AssetId
    console.log('Update with ID:', id)
    if (!id) {
      console.error('Cannot update: Asset ID is missing')
      alert('Không thể cập nhật: Thiếu ID tài sản')
      return
    }
    action = APIAsset.update(id, payload)
  }

  if (action) {
    action
      .then((response) => {
        console.log('Success response:', response)
        loadAssets()
      })
      .catch((error) => {
        console.error('API Error:', error)
        console.error('Error response:', error.response?.data)
        alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể lưu dữ liệu'}`)
      })
      .finally(() => {
        isModalOpen.value = false
      })
  } else {
    isModalOpen.value = false
  }
}
//#endregion

//#region API - Load Data
/**
 * Load dữ liệu từ backend
 * Backend có thể trả về fields hoặc không
 */
const loadAssets = async () => {
  try {
    const response = await APIAsset.list()
    if (response.data?.success) {
      const items = response.data.data || []
      tableRows.value = items.map(mapAssetToRow)
    } else if (Array.isArray(response.data)) {
      // Trường hợp BE trả mảng thô
      tableRows.value = response.data.map(mapAssetToRow)
    }
  } catch (error) {
    console.error('Load assets error:', error)
  }
}

function mapAssetToRow(a) {
  const assetId = a.assetId ?? a.AssetId
  return {
    id: assetId, // Thêm id cho checkbox
    assetId: assetId,
    assetCode: a.assetCode ?? a.AssetCode,
    assetName: a.assetName ?? a.AssetName,
    assetTypeName: a.assetTypeName ?? a.AssetTypeName ?? '',
    departmentName: a.departmentName ?? a.DepartmentName ?? '',
    assetQuantity: a.assetQuantity ?? a.AssetQuantity ?? 0,
    assetPrice: a.assetPrice ?? a.AssetPrice ?? 0,
    assetAnnualDepreciation: a.assetAnnualDepreciation ?? a.AssetAnnualDepreciation ?? 0,
    residualValue: a.residualValue ?? a.ResidualValue ?? 0,
   // Thêm các trường cần thiết cho edit
    departmentId: a.departmentId ?? a.DepartmentId,
 assetTypeId: a.assetTypeId ?? a.AssetTypeId,
    purchaseDate: a.purchaseDate ?? a.PurchaseDate,
    startDate: a.startDate ?? a.StartDate,
    depreciationRate: a.depreciationRate ?? a.DepreciationRate ?? 0,
    // Số năm sử dụng của LOẠI tài sản (asset_type_lifetime) dùng riêng cho lifetime,
    // không dùng useYear nữa để tránh nhầm với AssetUseYear (năm yyyy)
    assetTypeLifeTime: a.assetLifeTime ?? a.AssetLifeTime ?? a.assetTypeLifeTime ?? a.AssetTypeLifeTime ?? 0,
  }
}

// Load data khi component mount
onMounted(() => {
  loadAssets()
})
//#endregion
</script>

<style scoped>
.asset-page {
  padding: var(--page-padding-y) var(--page-padding-x);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  border-radius: 4px;
  margin-bottom: var(--toolbar-margin);
  gap: var(--toolbar-gap);
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
