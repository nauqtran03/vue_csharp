<template>
  <div class="asset-page">
    <!-- Toolbar -->
    <div class="toolbar d-flex justify-content-between align-items-center">
      <!-- Left side -->
      <div class="toolbar-left d-flex flex-1 align-items-center gap-12">
        <!-- Search input -->
        <div class="">
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
          + Thêm tài sản
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
        :summary="summary"
        :totalRecords="totalRecords"
        :loading="isLoading"
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        @add="handleAddAsset"
        @edit="handleEdit"
        @duplicate="handleDuplicate"
        @delete="handleDeleteFromContextMenu"
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

    <!-- Delete Confirm Modal -->
    <MsConfirmModal
      v-model:isOpenConfirmModal="isDeleteConfirmOpen"
      :content="deleteConfirmMessage"
      confirmText="Xóa"
      cancelText="Hủy"
      confirmType="primary"
      @confirm="handleConfirmDelete"
      @cancel="isDeleteConfirmOpen = false"
    />

    <!-- Export Excel Confirm Modal -->
    <MsConfirmModal
      v-model:isOpenConfirmModal="isExportConfirmOpen"
      content="Bạn có muốn xuất danh sách tài sản ra file Excel không?"
      confirmText="Xuất Excel"
      cancelText="Hủy"
      confirmType="primary"
      @confirm="handleConfirmExport"
      @cancel="isExportConfirmOpen = false"
    />

    <!-- Toast Container -->
    <MsToastContainer />
  </div>
</template>

<script setup>
//#region Imports
import { ref, watch, onMounted } from 'vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsFilterSelect from '@/components/ms-filter/MsFilterSelect.vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButton from '@/components/ms-button/MsButton.vue'
import MsConfirmModal from '@/components/ms-modal/MsConfirmModal.vue'
import MsToastContainer from '@/components/ms-toast/MsToastContainer.vue'
import AssetModal from './AssetModal.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/components/ms-toast/useToast'
import APIAsset from '@/apis/components/APIAsset.js'
import APIAssetType from '@/apis/components/APIAssetType.js'
import APIDepartment from '@/apis/components/APIDepartment.js'
import * as XLSX from 'xlsx'
//#endregion

//#region Toast
const toast = useToast()
//#endregion

//#region State - Filter
const searchText = ref('')
const assetType = ref(null)
const department = ref(null)

// Loading state
const isLoading = ref(false)

// Load từ BE
const assetTypes = ref([])
const departments = ref([])
//#endregion

//#region State - Table
const { t } = useI18n()

// Giá trị mặc định cho tableFields (sử dụng CSS variables từ responsive.css)
const tableFields = ref([
  { key: 'assetCode', label: t('table.assetCode'), type: 'text', width: 'var(--col-asset-code)' },
  { key: 'assetName', label: t('table.assetName'), type: 'text', width: 'var(--col-asset-name)' },
  { key: 'assetTypeName', label: t('table.assetTypeName'), type: 'text', width: 'var(--col-asset-type)' },
  { key: 'departmentName', label: t('table.departmentName'), type: 'text', width: 'var(--col-department)' },
  { key: 'assetQuantity', label: t('table.quantity'), type: 'number', width: 'var(--col-quantity)' },
  { key: 'assetPrice', label: t('table.price'), type: 'currency', width: 'var(--col-price)' },
  { key: 'assetAnnualDepreciation', label: t('table.annualDepreciation'), type: 'currency', width: 'var(--col-depreciation)' },
  { key: 'residualValue', label: t('table.residualValue'), type: 'currency', width: 'var(--col-residual)' }
])

const tableRows = ref([])

// Pagination state
const currentPage = ref(1)
const pageSize = ref(20)
const totalRecords = ref(0)

// Summary state
const summary = ref({
  quantityTotal: 0,
  priceTotal: 0,
  annualDepreciationTotal: 0,
  remainingValueTotal: 0
})

//#endregion

//#region State - Modal
const isModalOpen = ref(false)
const modalMode = ref('add') // 'add', 'edit', 'duplicate'
const selectedAsset = ref(null)
const selectedRows = ref([])
const isDeleteConfirmOpen = ref(false)
const deleteConfirmMessage = ref('')
const isExportConfirmOpen = ref(false)
//#endregion

//#region Watch - Auto reload
let searchTimeout = null

// Watch search với debounce 500ms
watch(searchText, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadAssets()
  }, 500)
})

// Watch filter - reload ngay
watch([assetType, department], () => {
  currentPage.value = 1
  loadAssets()
})

// Watch pageSize - reset về trang 1
watch(pageSize, () => {
  currentPage.value = 1
  loadAssets()
})

// Watch page
watch(currentPage, () => {
  loadAssets()
})
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
 * Xử lý xuất Excel - hiển thị modal xác nhận
 */
const handleExportExcel = () => {
  isExportConfirmOpen.value = true
}

/**
 * Xác nhận xuất Excel
 */
const handleConfirmExport = async () => {
  try {
    isLoading.value = true

    const params = {
      p_query: searchText.value || null,
      p_department_name: department.value
        ? departments.value.find(d => d.id === department.value)?.name
        : null,
      p_asset_type_name: assetType.value
        ? assetTypes.value.find(t => t.id === assetType.value)?.name
        : null,
      p_page_number: 1,
      p_page_size: 999999
    }

    const response = await APIAsset.list(params)

    if (response.data?.success && response.data.data?.data) {
      const allAssets = response.data.data.data

      // Chuẩn bị dữ liệu cho Excel
      const excelData = allAssets.map((asset, index) => ({
        'STT': index + 1,
        'Mã tài sản': asset.assetCode ?? asset.AssetCode,
        'Tên tài sản': asset.assetName ?? asset.AssetName,
        'Loại tài sản': asset.assetTypeName ?? asset.AssetTypeName ?? '',
        'Bộ phận sử dụng': asset.departmentName ?? asset.DepartmentName ?? '',
        'Số lượng': asset.assetQuantity ?? asset.AssetQuantity ?? 0,
        'Nguyên giá': asset.assetPrice ?? asset.AssetPrice ?? 0,
        'Khấu hao năm': asset.assetAnnualDepreciation ?? asset.AssetAnnualDepreciation ?? 0,
        'Giá trị còn lại': asset.residualValue ?? asset.ResidualValue ?? 0
      }))

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Tùy chỉnh độ rộng cột
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 15 }, // Mã tài sản
        { wch: 30 }, // Tên tài sản
        { wch: 20 }, // Loại tài sản
        { wch: 25 }, // Bộ phận sử dụng
        { wch: 10 }, // Số lượng
        { wch: 15 }, // Nguyên giá
        { wch: 15 }, // Khấu hao năm
        { wch: 15 }  // Giá trị còn lại
      ]

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách tài sản')

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const fileName = `DanhSachTaiSan_${timestamp}.xlsx`

      // Xuất file
      XLSX.writeFile(wb, fileName)

      // Hiển thị thông báo thành công
      toast.success(`Đã xuất ${allAssets.length} tài sản ra file Excel`, 'Thành công')
    } else {
      toast.error('Không có dữ liệu để xuất', 'Lỗi')
    }
  } catch {
    toast.error('Có lỗi xảy ra khi xuất Excel', 'Lỗi')
  } finally {
    isLoading.value = false
    isExportConfirmOpen.value = false
  }
}

/**
 * Xử lý xóa các dòng đã chọn
 */
const handleDeleteSelected = () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Vui lòng chọn ít nhất một tài sản để xóa', 'Cảnh báo')
    return
  }

  // Hiển thị modal xác nhận
  const count = selectedRows.value.length
  deleteConfirmMessage.value = `Bạn có thực sự muốn xóa ${count} tài sản đã chọn?`
  isDeleteConfirmOpen.value = true
}

/**
 * Xác nhận xóa
 */
const handleConfirmDelete = () => {
  // Chuẩn hóa danh sách ID gửi về BE (List<Guid>)
  const ids = selectedRows.value.map((x) => {
    if (typeof x === 'string') return x
    return x?.assetId || x?.AssetId
  }).filter(Boolean)

  // Gọi API xóa nhiều và tải lại dữ liệu
  APIAsset.deleteMultiple(ids)
    .then(() => {
      loadAssets()
      selectedRows.value = []
      isDeleteConfirmOpen.value = false

      // Hiển thị toast thành công
      const count = ids.length
      toast.success(`Đã xóa ${count} tài sản thành công`, 'Thành công')
    })
    .catch(() => {
      isDeleteConfirmOpen.value = false
      toast.error('Có lỗi xảy ra khi xóa tài sản', 'Lỗi')
    })
}
//#endregion

//#region Methods - Table Actions
/**
 * Xử lý edit row
 */
const handleEdit = async (row) => {
  try {
    modalMode.value = 'edit'
    // Gọi API để lấy đầy đủ thông tin tài sản (bao gồm cả ngày tháng)
    const assetId = row.assetId ?? row.AssetId
    const response = await APIAsset.getById(assetId)
    selectedAsset.value = response.data?.data ?? response.data
    isModalOpen.value = true
  } catch (error) {
    toast.error('Không thể tải thông tin tài sản', 'Lỗi')
    console.error('Error loading asset detail:', error)
  }
}

/**
 * Xử lý duplicate row
 */
const handleDuplicate = async (row) => {
  try {
    modalMode.value = 'duplicate'
    // Gọi API để lấy đầy đủ thông tin tài sản (bao gồm cả ngày tháng)
    const assetId = row.assetId ?? row.AssetId
    const response = await APIAsset.getById(assetId)
    selectedAsset.value = response.data?.data ?? response.data
    isModalOpen.value = true
  } catch (error) {
    toast.error('Không thể tải thông tin tài sản', 'Lỗi')
    console.error('Error loading asset detail:', error)
  }
}

/**
 * Xử lý khi selection thay đổi
 */
const handleSelectionChange = (selectedIds) => {
  selectedRows.value = selectedIds
}

/**
 * Xử lý xóa từ context menu
 * @param {Array} ids - Mảng ID cần xóa
 */
const handleDeleteFromContextMenu = (ids) => {
  if (!ids || ids.length === 0) return

  // Hiển thị modal xác nhận
  const count = ids.length
  deleteConfirmMessage.value = `Bạn có thực sự muốn xóa ${count} tài sản đã chọn?`

  // Lưu lại danh sách ID để xóa
  selectedRows.value = ids
  isDeleteConfirmOpen.value = true
}
//#endregion

//#region Methods - Modal Actions

/**
 * Lấy năm từ startDate hoặc purchaseDate để tính AssetUseYear
 * @param {Object} data - Dữ liệu form chứa startDate hoặc purchaseDate
 * @returns {number} Năm hoặc 0 nếu không có date hợp lệ
 */
const getYear = (data) => {
  const date = data.startDate || data.purchaseDate
  if (date) {
    const d = new Date(date)
    if (!isNaN(d.getTime())) return d.getFullYear()
  }
  return 0
}

/**
 * Format date để gửi lên server, tránh timezone issue
 * @param {Date} date - Date object
 * @returns {string|null} ISO string với local date
 */
const formatDateForServer = (date) => {
  if (!date) return null
  // Tạo ISO string với local timezone (YYYY-MM-DD)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}T00:00:00`
}

/**
 * Xử lý submit form từ modal
 */
const handleSubmitAsset = (formData) => {
  const payload = {
    AssetCode: formData.assetCode,
    AssetName: formData.assetName,
    AssetPurchaseDate: formatDateForServer(formData.purchaseDate),
    AssetStartDate: formatDateForServer(formData.startDate),
    AssetUseYear: getYear(formData),
    AssetDepreciationRate: Number(formData.depreciationRate ?? 0),
    AssetQuantity: Number(formData.quantity ?? 0),
    AssetPrice: Number(formData.price ?? 0),
    AssetAnnualDepreciation: Number(formData.annualDepreciation ?? 0),
    DepartmentId: formData.departmentName?.departmentId || null,
    AssetTypeId: formData.assetTypeName?.assetTypeId || null,
  }

  let action
  if (modalMode.value === 'add' || modalMode.value === 'duplicate') {
    action = APIAsset.create(payload)
  }
  else if(modalMode.value === 'edit') {
    const id = selectedAsset.value?.assetId || selectedAsset.value?.AssetId || formData.assetId || formData.AssetId
    if (!id) {
      toast.error('Không thể cập nhật: Thiếu ID tài sản', 'Lỗi')
      return
    }
    action = APIAsset.update(id, payload)
  }

  if (action) {
    action
      .then(() => {
        loadAssets()

        // Hiển thị toast thành công
        if (modalMode.value === 'add') {
          toast.success('Thêm tài sản thành công', 'Thành công')
        } else if (modalMode.value === 'edit') {
          toast.success('Cập nhật tài sản thành công', 'Thành công')
        } else if (modalMode.value === 'duplicate') {
          toast.success('Nhân bản tài sản thành công', 'Thành công')
        }
        isModalOpen.value = false
      })
      .catch((error) => {
        // Xử lý lỗi từ backend
        let errorMsg = 'Không thể lưu dữ liệu'

        // Lấy message từ response
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message
        } else if (error.response?.data?.errors) {
          // Nếu có nhiều lỗi, lấy lỗi đầu tiên
          const errors = error.response.data.errors
          errorMsg = Array.isArray(errors) ? errors[0] : errors
        } else if (error.message) {
          errorMsg = error.message
        }

        toast.error(errorMsg, 'Lỗi')
        // Không đóng modal khi có lỗi để user có thể sửa
      })
  } else {
    isModalOpen.value = false
  }
}
//#endregion

//#region API - Load Data
/**
 * Load dữ liệu từ backend với filter, search, pagination
 */
const loadAssets = async () => {
  try {
    isLoading.value = true

    // Lấy tên department và assetType từ ID
    const departmentName = department.value
      ? departments.value.find(d => d.id === department.value)?.name
      : null
    const assetTypeName = assetType.value
      ? assetTypes.value.find(t => t.id === assetType.value)?.name
      : null

    // Tạo params theo BE API
    const params = {
      p_query: searchText.value || null,
      p_department_name: departmentName || null,
      p_asset_type_name: assetTypeName || null,
      p_page_number: currentPage.value,
      p_page_size: pageSize.value
    }

    const response = await APIAsset.list(params)

    if (response.data?.success) {
      const responseData = response.data.data

      // BE luôn trả về format có pagination và summary
      if (responseData?.data) {
        tableRows.value = responseData.data.map(mapAssetToRow)
        totalRecords.value = responseData.totalRecords || 0

        // Cập nhật summary từ BE
        if (responseData.summary) {
          summary.value = {
            quantityTotal: responseData.summary.quantityTotal || 0,
            priceTotal: responseData.summary.priceTotal || 0,
            annualDepreciationTotal: responseData.summary.annualDepreciationTotal || 0,
            remainingValueTotal: responseData.summary.remainingValueTotal || 0
          }
        }
      }
    }
  } catch {
    toast.error('Không thể tải dữ liệu tài sản', 'Lỗi')
  } finally {
    isLoading.value = false
  }
}

/**
 * Map dữ liệu asset từ BE sang format của table row
 * Xử lý cả camelCase và PascalCase từ BE
 * @param {Object} a - Asset object từ BE
 * @returns {Object} Row object cho table
 */
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
    departmentId: a.departmentId ?? a.DepartmentId,
    assetTypeId: a.assetTypeId ?? a.AssetTypeId,
    purchaseDate: a.assetPurchaseDate ?? a.AssetPurchaseDate ?? a.purchaseDate ?? a.PurchaseDate,
    startDate: a.assetStartDate ?? a.AssetStartDate ?? a.startDate ?? a.StartDate,
    depreciationRate: a.depreciationRate ?? a.DepreciationRate ?? 0,
    assetTypeLifeTime: a.assetLifeTime ?? a.AssetLifeTime ?? a.assetTypeLifeTime ?? a.AssetTypeLifeTime ?? 0,
  }
}

/**
 * Load danh sách loại tài sản từ BE
 */
const loadAssetTypes = async () => {
  try {
    const response = await APIAssetType.getAll()
    if (response.data?.success) {
      const data = response.data.data || []
      assetTypes.value = data.map(item => ({
        id: item.assetTypeId ?? item.AssetTypeId,
        name: item.assetTypeName ?? item.AssetTypeName
      }))
    }
  } catch {
    toast.error('Không thể tải danh sách loại tài sản', 'Lỗi')
  }
}

/**
 * Load danh sách bộ phận từ BE
 */
const loadDepartments = async () => {
  try {
    const response = await APIDepartment.getAll()
    if (response.data?.success) {
      const data = response.data.data || []
      departments.value = data.map(item => ({
        id: item.departmentId ?? item.DepartmentId,
        name: item.departmentName ?? item.DepartmentName
      }))
    }
  } catch {
    toast.error('Không thể tải danh sách bộ phận', 'Lỗi')
  }
}

// Load data khi component mount
onMounted(async () => {
  // Load filter options trước
  await Promise.all([
    loadAssetTypes(),
    loadDepartments()
  ])
  // Sau đó mới load assets
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
