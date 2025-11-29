<template>
  <MsModal to="body" :isOpen="isOpen" :resizable="true" :defaultWidth="modalDefaultWidth">
    <form @submit.prevent="onSubmit" class="modal-content rounded-md">
      <!-- head -->
      <div class="modal-head flex justify-between items-center">
        <slot name="head">
          <span class="text-2xl font-bold">{{
            props.mode === 'edit'
              ? t('asset.editAsset')
              : props.mode === 'duplicate'
              ? t('asset.duplicateAsset')
              : t('asset.addAsset')
          }}</span>
          <!-- Dùng button thuần, không dùng component -->
          <button
            type="button"
            class="btn-close icon close-icon"
            @click.prevent.stop="showCancelConfirm"
          >
            <span></span>
          </button>
        </slot>
      </div>

      <!-- content -->
      <div :key="formKey" class="scroll modal-body flex flex-col gap-20">
        <div class="form-grid form-grid-2">
          <div>
            <MsInput
              tabindex="1"
              size="large"
              isRequired
              v-model="assetCode"
              v-bind="assetCodeAttrs"
              :error_message="assetCodeError"
              :label="t('asset.assetCode')"
              :placeholder="t('asset.assetCodePlaceholder')"
              @blur="checkDuplicateAssetCode"
            />
          </div>
          <div>
            <MsInput
              ref="firstInputRef"
              tabindex="2"
              size="large"
              isRequired
              v-model="assetName"
              v-bind="assetNameAttrs"
              :error_message="errors.assetName"
              :label="t('asset.assetName')"
              :placeholder="t('asset.assetNamePlaceholder')"
            />
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div>
            <MsFilterSelect
              tabindex="3"
              size="large"
              isRequired
              :modelValue="departmentName"
              @update:modelValue="departmentName = $event"
              :error_message="displayErrors.departmentName"
              :label="t('asset.departmentCode')"
              :placeholder="t('asset.departmentCodePlaceholder')"
              :options="departments"
              optionLabel="departmentAbbreviation"
              @blur="resolveDepartment"
            >
              <template #option="{ option }">
                <div class="dropdown-option">
                  <span class="option-code">{{ option.departmentAbbreviation }}</span>
                  <span class="option-divider">/</span>
                  <span class="option-name">{{ option.departmentName }}</span>
                </div>
              </template>
              <template #right-icon>
                <span class="icon dropdown-icon"></span>
              </template>
            </MsFilterSelect>
          </div>
          <div>
            <MsInput
              size="large"
              disabled
              :modelValue="departmentName?.departmentName"
              :label="t('asset.departmentName')"
              placeholder=""
            />
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div>
            <MsFilterSelect
              tabindex="4"
              size="large"
              isRequired
              :modelValue="assetTypeName"
              @update:modelValue="assetTypeName = $event"
              :error_message="displayErrors.assetTypeName"
              :label="t('asset.assetTypeCode')"
              :placeholder="t('asset.assetTypeCodePlaceholder')"
              :options="assetTypes"
              optionLabel="assetTypeAbbreviation"
              @blur="resolveAssetType"
            >
              <template #option="{ option }">
                <div class="dropdown-option">
                  <span class="option-code">{{ option.assetTypeAbbreviation }}</span>
                  <span class="option-divider">/</span>
                  <span class="option-name">{{ option.assetTypeName }}</span>
                </div>
              </template>
              <template #right-icon>
                <span class="icon dropdown-icon"></span>
              </template>
            </MsFilterSelect>
          </div>
          <div>
            <MsInput
              size="large"
              disabled
              :modelValue="assetTypeName?.assetTypeName"
              :label="t('asset.assetTypeName')"
              placeholder=""
            />
          </div>
        </div>
        <div class="form-grid form-grid-3">
          <div>
            <MsInputNumber
              tabindex="5"
              hasButton
              isRequired
              size="large"
              v-model="quantity"
              v-bind="quantityAttrs"
              :error_message="errors.quantity"
              :label="t('asset.quantity')"
              :placeholder="t('asset.quantityPlaceholder')"
            />
          </div>
          <div>
            <MsInputNumber
              tabindex="6"
              size="large"
              isRequired
              mode="decimal"
              v-model="price"
              v-bind="priceAttrs"
              :error_message="errors.price"
              :label="t('asset.price')"
              numType="decimal"
              :placeholder="t('asset.pricePlaceholder')"
            />
          </div>
          <div>
            <MsInputNumber
              tabindex="7"
              size="large"
              isRequired
              mode="decimal"
              v-model="depreciationRate"
              v-bind="depreciationRateAttrs"
              :error_message="errors.depreciationRate"
              :label="t('asset.depreciationRate')"
              numType="decimal"
              :placeholder="t('asset.depreciationRatePlaceholder')"
            />
          </div>
        </div>
        <div class="form-grid form-grid-3">
          <div>
            <MsDatePicker
              size="large"
              tabindex="8"
              isRequired
              v-model="purchaseDate"
              v-bind="purchaseDateAttrs"
              :error_message="errors.purchaseDate"
              :label="t('asset.purchaseDate')"
            />
          </div>
          <div>
            <MsDatePicker
              size="large"
              tabindex="9"
              isRequired
              v-model="startDate"
              v-bind="startDateAttrs"
              :error_message="errors.startDate"
              :label="t('asset.startDate')"
            />
          </div>
          <div>
            <MsInput
              size="large"
              :modelValue="trackingYear"
              disabled
              class="text-right-input"
              :label="t('asset.trackingYear')"
              :placeholder="t('asset.trackingYearPlaceholder')"
            />
          </div>
        </div>
        <div class="form-grid form-grid-3">
          <div>
            <MsInputNumber
              hasButton
              size="large"
              tabindex="10"
              isRequired
              v-model="useYears"
              v-bind="useYearsAttrs"
              :error_message="errors.useYears"
              :label="t('asset.useYears')"
              :placeholder="t('asset.useYearsPlaceholder')"
              numType="decimal"
            />
          </div>
          <div>
            <MsInputNumber
              size="large"
              tabindex="11"
              isRequired
              mode="decimal"
              v-model="annualDepreciation"
              v-bind="annualDepreciationAttrs"
              :error_message="errors.annualDepreciation"
              :label="t('asset.annualDepreciation')"
              :placeholder="t('asset.annualDepreciationPlaceholder')"
              numType="decimal"
            />
          </div>
        </div>
      </div>
      <!-- footer -->
      <div class="modal-footer flex justify-end items-center rounded-md">
        <slot name="footer">
          <MsButton
            tabindex="12"
            buttonType="default"
            size="large"
            type="button"
            @click.prevent.stop="showCancelConfirm"
            >{{ t('common.cancel') }}</MsButton>

          <!-- Nút Lưu: type="submit" -->
          <MsButton
            tabindex="13"
            buttonType="primary"
            size="large"
            type="submit"
          >
            {{ t('common.save') }}
          </MsButton>
        </slot>
      </div>
    </form>
  </MsModal>

  <!-- Modal xác nhận dùng cho add, duplicate -->
  <MsConfirmModal
    v-if="mode != 'edit'"
    v-model:isOpenConfirmModal="isOpenConfirmModal"
    :content="t('asset.confirmContent')"
    confirmText="Hủy bỏ"
    cancelText="Không"
    confirmType="secondary"
    @confirm="handleConfirmCancel"
    @cancel="isOpenConfirmModal = false"
  />

  <!-- Modal xác nhận dùng cho update -->
  <MsConfirmModal
    v-if="mode == 'edit'"
    v-model:isOpenConfirmModal="isOpenConfirmModal"
    :content="t('asset.updateConfirmContent')"
    confirmText="Lưu"
    cancelText="Hủy"
    cancelSaveText="Không lưu"
    confirmType="primary"
    @confirm="handleConfirmSubmit"
    @cancel="isOpenConfirmModal = false"
    @cancelSave="handleConfirmCancel"
  />

  <!-- Modal hiển thị lỗi validate -->
  <MsConfirmModal
    v-model:isOpenConfirmModal="isOpenErrorModal"
    :content="errorMessage"
    confirmText="Đóng"
    confirmType="primary"
    @confirm="handleCloseErrorModal"
  />
</template>

<script setup>
import MsModal from '@/components/ms-modal/MsModal.vue'
import MsConfirmModal from '@/components/ms-modal/MsConfirmModal.vue'
import { assetSchema } from '@/schemas/asset.schema'
import { useForm } from 'vee-validate'
import { ref, watch, nextTick, computed } from 'vue'
import APIAsset from '@/apis/components/APIAsset.js'
import { useI18n } from 'vue-i18n'
import MsButton from '@/components/ms-button/MsButton.vue'
import MsInputNumber from '@/components/ms-input/MsInputNumber.vue'
import MsDatePicker from '@/components/ms-date/MsDatePicker.vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsFilterSelect from '@/components/ms-filter/MsFilterSelect.vue'
import APIDepartment from '@/apis/components/APIDepartment.js'
import APIAssetType from '@/apis/components/APIAssetType.js'
import { onMounted, onUnmounted } from 'vue'

const { t } = useI18n()

// Responsive modal width dựa trên kích thước màn hình
const getModalWidth = () => {
  const screenWidth = window.innerWidth
  if (screenWidth <= 1366) {
    return 800 // Màn 1366px: modal 800px
  } else if (screenWidth <= 1600) {
    return 850 // Màn 1600px: modal 850px
  } else {
    return 900 // Màn 1920px+: modal 900px
  }
}

const modalDefaultWidth = ref(getModalWidth())

// Update modal width khi resize window
const handleResize = () => {
  modalDefaultWidth.value = getModalWidth()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Danh mục từ BE
const departments = ref([])
const assetTypes = ref([])

/**
 * Đảm bảo danh mục (departments, assetTypes) được load từ BE trước khi fill form
 * Chỉ load một lần, các lần sau sẽ skip nếu đã có dữ liệu
 */
const ensureCatalogsLoaded = async () => {
  if (
    Array.isArray(departments.value) &&
    departments.value.length > 0 &&
    Array.isArray(assetTypes.value) &&
    assetTypes.value.length > 0
  ) {
    return
  }
  try {
    const [deptRes, typeRes] = await Promise.all([
      APIDepartment.getAll(),
      APIAssetType.getAll(),
    ])
    departments.value = (deptRes.data?.data || deptRes.data || []).map((d) => ({
      departmentId: d.departmentId ?? d.DepartmentId ?? d.deptId,
      departmentName: d.departmentName ?? d.DepartmentName ?? d.deptName,
      departmentAbbreviation:
      d.departmentAbbreviation ?? d.DepartmentAbbreviation ?? d.deptAbbr,
      departmentCode: d.departmentCode ?? d.DepartmentCode ?? d.deptCode,
    }))
    assetTypes.value = (typeRes.data?.data || typeRes.data || []).map((t) => {
      const mapped = {
        assetTypeId: t.assetTypeId ?? t.AssetTypeId,
        assetTypeName: t.assetTypeName ?? t.AssetTypeName,
        assetTypeAbbreviation: t.assetTypeAbbreviation ?? t.AssetTypeAbbreviation,
        assetTypeDepreciationRate: t.assetTypeDepreciationRate ?? t.AssetTypeDepreciationRate,
        assetTypeCode: t.assetTypeCode ?? t.AssetTypeCode,
        assetTypeLifeTime:t.assetTypeLifeTime ?? t.AssetTypeLifeTime ?? t.asset_type_lifetime,
      }
      return mapped
    })
  } catch {
    // bỏ qua lỗi nạp danh mục, cho phép người dùng nhập tay
  }
}

//Props & Emits
const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String,
    default: 'add',
  },
  assetData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:isOpen', 'submit'])

//Form & state
const { errors, handleSubmit, defineField, resetForm, setErrors, validateField } = useForm({
  validationSchema: assetSchema(t),
  initialValues: {
    assetCode: undefined,
    assetName: undefined,
    departmentName: undefined,
    assetTypeName: undefined,
    quantity: 1,
    price: 0,
    useYears: 0,
    depreciationRate: 0,
    annualDepreciation: 0,
    purchaseDate: new Date(),
    startDate: new Date(),
  },
  validateOnMount: false,
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
})

const [assetCode, assetCodeAttrs] = defineField('assetCode')
const [assetName, assetNameAttrs] = defineField('assetName')
const [departmentName] = defineField('departmentName')
const [assetTypeName] = defineField('assetTypeName')
const [quantity, quantityAttrs] = defineField('quantity')
const [price, priceAttrs] = defineField('price')
const [useYears, useYearsAttrs] = defineField('useYears')
const [depreciationRate, depreciationRateAttrs] = defineField('depreciationRate')
const [annualDepreciation, annualDepreciationAttrs] = defineField('annualDepreciation')
const [purchaseDate, purchaseDateAttrs] = defineField('purchaseDate')
const [startDate, startDateAttrs] = defineField('startDate')

// State khác của modal
const isOpenConfirmModal = ref(false)
const isOpenErrorModal = ref(false)
const errorMessage = ref('')
const originalAssetCode = ref('') // Lưu mã tài sản gốc khi edit
const trackingYear = ref(new Date().getFullYear())
const isFillingForm = ref(false) // Flag để tắt watch khi đang fill form
const firstInputRef = ref(null)
const formKey = ref(0) // Key để force re-render form
const touchedFields = ref(new Set()) // Theo dõi các field đã được touch
const hasSubmitted = ref(false) // Theo dõi đã submit chưa

// Computed để chỉ hiển thị lỗi cho các field đã touch hoặc đã submit
const displayErrors = computed(() => {
  if (hasSubmitted.value) return errors.value

  const filtered = {}
  for (const key in errors.value) {
    if (touchedFields.value.has(key)) {
      filtered[key] = errors.value[key]
    }
  }
  return filtered
})

// Computed riêng cho assetCode error để đảm bảo reactivity
const assetCodeError = computed(() => {
  // Luôn hiển thị lỗi nếu đã touched hoặc đã submit
  if (hasSubmitted.value || touchedFields.value.has('assetCode')) {
    return errors.value.assetCode
  }
  return undefined
})

/**
 * Kiểm tra form có dữ liệu hay chưa (phục vụ confirm khi đóng)
 */
const hasFormData = () => {
  return !!(
    assetCode.value ||
    assetName.value ||
    departmentName.value ||
    assetTypeName.value ||
    purchaseDate.value ||
    startDate.value ||
    (quantity.value && quantity.value !== 0) ||
    (price.value && price.value !== 0) ||
    (depreciationRate.value && depreciationRate.value !== 0) ||
    (useYears.value && useYears.value !== 0) ||
    (annualDepreciation.value && annualDepreciation.value !== 0)
  )
}

/**
 * Reset toàn bộ state khi đóng modal
 */
const resetAll = () => {
  resetForm()
  setErrors({})
  // Đảm bảo các select field được set về undefined
  departmentName.value = undefined
  assetTypeName.value = undefined
  isOpenConfirmModal.value = false
  isOpenErrorModal.value = false
  errorMessage.value = ''
  isFillingForm.value = false
  originalAssetCode.value = ''
  touchedFields.value.clear()
  hasSubmitted.value = false
  formKey.value++
}

/**
 * Đóng modal (emit ra ngoài)
 */
const handleCloseModal = () => {
  emit('update:isOpen', false)
  resetAll()
}

/**
 * Focus vào input đầu tiên
 */
const safeFocus = () => {
  try {
    const el = firstInputRef.value?.$el?.querySelector?.('input,textarea,[tabindex]')
    if (el && typeof el.focus === 'function') el.focus()
  } catch {
    // ignore
  }
}

/**
 * Xử lý nút đóng / hủy: nếu có dữ liệu thì hỏi confirm, không thì đóng luôn
 */
const showCancelConfirm = (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  if (hasFormData()) {
    isOpenConfirmModal.value = true
  } else {
    handleCloseModal()
  }
}

/**
 * Người dùng xác nhận HỦY trên confirm
 */
const handleConfirmCancel = () => {
  isOpenConfirmModal.value = false
  handleCloseModal()
}

/**
 * Người dùng xác nhận LƯU trên confirm (chế độ sửa)
 */
const handleConfirmSubmit = () => {
  isOpenConfirmModal.value = false
  onSubmit()
}

/**
 * Đóng modal lỗi
 */
const handleCloseErrorModal = () => {
  isOpenErrorModal.value = false
  errorMessage.value = ''
}

//  Validation Helpers

/** Regex format mã tài sản: TS + số (VD: TS001, TS123) */
const ASSET_CODE_REGEX = /^TS\d+$/

/**
 * Kiểm tra xem có cần check trùng mã không
 * - Add/Duplicate: luôn cần check
 * - Edit: chỉ check khi mã đã thay đổi
 */
const shouldCheckDuplicate = (code) => {
  if (!code) return false

  const isEditMode = props.mode === 'edit'
  const codeUnchanged = code === originalAssetCode.value

  // Edit mode + mã không đổi => không cần check
  if (isEditMode && codeUnchanged) return false

  return true
}

/**
 * Hiển thị lỗi validation trong modal
 */
const showValidationError = (fieldName, message) => {
  setErrors({ [fieldName]: message })
  errorMessage.value = message
  isOpenErrorModal.value = true
}

/**
 * Validate format mã tài sản
 * @returns true nếu hợp lệ, false nếu không
 */
const validateAssetCodeFormat = (code) => {
  if (!code) return true // Để schema xử lý required
  return ASSET_CODE_REGEX.test(code)
}

/**
 * Kiểm tra trùng mã tài sản qua API
 * @returns true nếu bị trùng, false nếu không trùng
 */
const checkDuplicateCodeAPI = async (code) => {
  try {
    const response = await APIAsset.checkDuplicateCode(code)
    console.log('Check duplicate response:', response.data)
    
    // Backend trả về: { success: true, message: "...", data: true/false }
    const isDuplicate = response.data?.data === true
    console.log('isDuplicate:', isDuplicate)
    
    return isDuplicate
  } catch (error) {
    console.error('Error checking duplicate code:', error)
    return false // Lỗi API thì bỏ qua, cho phép submit
  }
}

// Submit Handler

/**
 * Submit form: dùng vee-validate, chỉ validate khi bấm Lưu
 */
const onSubmit = handleSubmit(
  async (values) => {
    const code = values.assetCode?.trim()

    // 1. Validate format mã tài sản (phải là TS + số)
    if (!validateAssetCodeFormat(code)) {
      showValidationError('assetCode', t('asset.errors.assetCode_format'))
      return
    }

    // 2. Kiểm tra trùng mã (Add/Duplicate luôn check, Edit chỉ check khi đổi mã)
    if (shouldCheckDuplicate(code)) {
      const isDuplicate = await checkDuplicateCodeAPI(code)
      if (isDuplicate) {
        showValidationError('assetCode', t('asset.errors.assetCode_duplicate'))
        return
      }
    }

    // 3. Business rule: hao mòn năm không được vượt quá nguyên giá
    if (values.annualDepreciation > values.price) {
      errorMessage.value = t('asset.depreciationExceedsPriceError')
      isOpenErrorModal.value = true
      return
    }

    emit('submit', values)
  },
  ({ errors: validationErrors }) => {
    // Đánh dấu đã submit để hiển thị tất cả lỗi
    hasSubmitted.value = true

    const fieldOrder = [
      'assetCode',
      'assetName',
      'departmentName',
      'assetTypeName',
      'quantity',
      'price',
      'depreciationRate',
      'purchaseDate',
      'startDate',
      'useYears',
      'annualDepreciation',
    ]

    const firstErrorKey = fieldOrder.find((field) => validationErrors[field])
    const firstError = firstErrorKey
      ? validationErrors[firstErrorKey]
      : Object.values(validationErrors)[0]

    errorMessage.value = firstError
    isOpenErrorModal.value = true
  }
)
// Tự động cập nhật năm theo dõi khi đổi ngày mua
watch(purchaseDate, (val) => {
  if (val instanceof Date) {
    trackingYear.value = val.getFullYear()
  }
})

// Watch assetCode để tự động check duplicate (với debounce 500ms)
let checkDuplicateTimeout = null
watch(assetCode, (newCode) => {
  console.log('watch assetCode triggered, newCode:', newCode, 'isFillingForm:', isFillingForm.value)
  
  // Clear timeout cũ
  if (checkDuplicateTimeout) {
    clearTimeout(checkDuplicateTimeout)
  }
  
  // Chỉ check khi không đang fill form
  if (isFillingForm.value) {
    console.log('Skipping check because isFillingForm is true')
    return
  }
  
  // Debounce 500ms
  checkDuplicateTimeout = setTimeout(() => {
    console.log('Debounce timeout fired, checking duplicate for:', newCode)
    if (newCode && newCode.trim()) {
      checkDuplicateAssetCode()
    } else {
      console.log('Code is empty, not checking')
    }
  }, 500)
})

// Data Mapping Helpers

/**
 * Lấy giá trị từ object theo nhiều key khác nhau (hỗ trợ camelCase và PascalCase)
 * @param {Object} obj - Object nguồn
 * @param {string[]} keys - Danh sách các key cần thử
 * @param {*} defaultValue - Giá trị mặc định nếu không tìm thấy
 */
const getFieldValue = (obj, keys, defaultValue = undefined) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
  return defaultValue
}

/**
 * Chuyển giá trị sang số, trả về 0 nếu không hợp lệ
 */
const toSafeNumber = (value, defaultValue = 0) => {
  const num = Number(value)
  return Number.isNaN(num) ? defaultValue : num
}

/**
 * Tìm Department trong danh sách theo ID hoặc tên
 * Ưu tiên: ID > fullName > abbreviation > code
 */
const findDepartment = (id, name) => {
  if (departments.value.length === 0) return null

  // Tìm theo ID trước
  if (id) {
    const byId = departments.value.find(d => String(d.departmentId) === String(id))
    if (byId) return byId
  }

  // Tìm theo tên/abbreviation/code
  if (name) {
    const search = String(name).trim().toLowerCase()
    return departments.value.find(d => {
      const fullName = d.departmentName?.trim().toLowerCase()
      const abbr = d.departmentAbbreviation?.trim().toLowerCase()
      const code = d.departmentCode?.trim().toLowerCase()
      return fullName === search || abbr === search || code === search
    })
  }

  return null
}

/**
 * Tìm AssetType trong danh sách theo ID hoặc tên
 * Ưu tiên: ID > fullName > abbreviation > code
 */
const findAssetType = (id, name) => {
  if (assetTypes.value.length === 0) return null

  // Tìm theo ID trước
  if (id) {
    const byId = assetTypes.value.find(t => String(t.assetTypeId) === String(id))
    if (byId) return byId
  }

  // Tìm theo tên/abbreviation/code
  if (name) {
    const search = String(name).trim().toLowerCase()
    return assetTypes.value.find(t => {
      const fullName = t.assetTypeName?.trim().toLowerCase()
      const abbr = t.assetTypeAbbreviation?.trim().toLowerCase()
      const code = t.assetTypeCode?.trim().toLowerCase()
      return fullName === search || abbr === search || code === search
    })
  }

  return null
}

// Field Key Mappings (hỗ trợ camelCase/PascalCase từ BE)

const FIELD_KEYS = {
  assetCode: ['AssetCode', 'assetCode'],
  assetName: ['AssetName', 'assetName'],
  quantity: ['AssetQuantity', 'assetQuantity', 'quantity'],
  price: ['AssetPrice', 'assetPrice', 'price'],
  useYears: ['AssetTypeLifeTime', 'assetTypeLifeTime', 'useYears'],
  depreciationRate: ['AssetTypeDepreciationRate', 'assetTypeDepreciationRate', 'depreciationRate'],
  startDate: ['AssetStartDate', 'assetStartDate', 'startDate'],
  purchaseDate: ['AssetPurchaseDate', 'assetPurchaseDate', 'purchaseDate'],
  departmentId: ['DepartmentId', 'departmentId'],
  departmentName: ['DepartmentName', 'departmentName'],
  assetTypeId: ['AssetTypeId', 'assetTypeId'],
  assetTypeName: ['AssetTypeName', 'assetTypeName'],
  annualDepreciation: ['AssetAnnualDepreciation', 'assetAnnualDepreciation', 'annualDepreciation'],
}

// Fill Form Data

/**
 * Đổ dữ liệu assetData (Edit / Duplicate) vào form
 */
const setFormData = async (data) => {
  if (!data) return

  isFillingForm.value = true

  // Reset select fields
  departmentName.value = undefined
  assetTypeName.value = undefined

  // Fill các field cơ bản
  assetCode.value = getFieldValue(data, FIELD_KEYS.assetCode, '')
  originalAssetCode.value = assetCode.value // Lưu mã gốc để so sánh khi edit

  assetName.value = getFieldValue(data, FIELD_KEYS.assetName, '')
  quantity.value = toSafeNumber(getFieldValue(data, FIELD_KEYS.quantity, 0))
  price.value = toSafeNumber(getFieldValue(data, FIELD_KEYS.price, 0))
  useYears.value = toSafeNumber(getFieldValue(data, FIELD_KEYS.useYears, 0))
  depreciationRate.value = toSafeNumber(getFieldValue(data, FIELD_KEYS.depreciationRate, 0))

  //Fill các field ngày
  const startRaw = getFieldValue(data, FIELD_KEYS.startDate, null)
  if (startRaw) startDate.value = new Date(startRaw)

  const purchRaw = getFieldValue(data, FIELD_KEYS.purchaseDate, null)
  if (purchRaw) purchaseDate.value = new Date(purchRaw)

  // Map Department
  const deptId = getFieldValue(data, FIELD_KEYS.departmentId, null)
  const deptName = getFieldValue(data, FIELD_KEYS.departmentName, null)
  const dept = findDepartment(deptId, deptName)
  if (dept) {
    await nextTick()
    departmentName.value = dept
  }

  // Map AssetType
  const typeId = getFieldValue(data, FIELD_KEYS.assetTypeId, null)
  const typeName = getFieldValue(data, FIELD_KEYS.assetTypeName, null)
  const assetType = findAssetType(typeId, typeName)
  if (assetType) {
    await nextTick()
    assetTypeName.value = assetType

    // Tự động lấy depreciationRate và useYears từ assetType nếu chưa có
    if (!depreciationRate.value) {
      depreciationRate.value = toSafeNumber(assetType.assetTypeDepreciationRate)
    }
    if (!useYears.value) {
      const life = assetType.assetTypeLifeTime ?? assetType.AssetTypeLifeTime
      if (life != null) useYears.value = Math.round(toSafeNumber(life))
    }
  }

  // Tính hao mòn năm
  const annualRaw = getFieldValue(data, FIELD_KEYS.annualDepreciation, null)
  annualDepreciation.value = annualRaw != null
    ? toSafeNumber(annualRaw)
    : (price.value * depreciationRate.value) / 100

  // Cập nhật năm theo dõi
  trackingYear.value = purchaseDate.value instanceof Date
    ? purchaseDate.value.getFullYear()
    : new Date().getFullYear()

  await nextTick()
  isFillingForm.value = false
}

/**
 * Kiểm tra format và trùng mã tài sản khi blur
 * - Validate realtime để UX tốt hơn
 * - Bỏ qua nếu đang edit và mã không đổi
 * - Lỗi sẽ "dính" lại cho đến khi user sửa thành mã hợp lệ
 */
const checkDuplicateAssetCode = async () => {
  const code = assetCode.value?.trim()
  console.log('checkDuplicateAssetCode called, code:', code, 'mode:', props.mode)

  // Nếu không có code, clear lỗi assetCode (để schema validation xử lý required)
  if (!code) {
    setErrors({ ...errors.value, assetCode: undefined })
    return
  }

  // Bỏ qua validation nếu không cần check (edit mode + mã không đổi)
  if (!shouldCheckDuplicate(code)) {
    console.log('shouldCheckDuplicate returned false, skipping validation')
    // Clear lỗi duplicate nếu có (vì đang edit mã cũ)
    setErrors({ ...errors.value, assetCode: undefined })
    return
  }

  // Validate format trước
  if (!validateAssetCodeFormat(code)) {
    console.log('Invalid format')
    touchedFields.value.add('assetCode') // Mark as touched để hiển thị lỗi
    setErrors({ ...errors.value, assetCode: t('asset.errors.assetCode_format') })
    return
  }

  // Gọi API kiểm tra trùng mã
  console.log('Calling API to check duplicate...')
  const isDuplicate = await checkDuplicateCodeAPI(code)
  console.log('API result - isDuplicate:', isDuplicate)

  // Set hoặc clear lỗi dựa trên kết quả
  if (isDuplicate) {
    touchedFields.value.add('assetCode') // Mark as touched để hiển thị lỗi
    setErrors({ ...errors.value, assetCode: t('asset.errors.assetCode_duplicate') })
    console.log('Set error: duplicate code')
  } else {
    setErrors({ ...errors.value, assetCode: undefined })
    console.log('Clear error: code is valid')
  }
}

/**
 * Chuẩn hóa chọn Department khi blur/change
 * Nếu user nhập text (abbreviation/code), tự động tìm và chọn department tương ứng
 * Nếu không tìm thấy, reset về null để hiển thị placeholder
 */
const resolveDepartment = async () => {
  // Đánh dấu field đã được touch
  touchedFields.value.add('departmentName')

  const val = departmentName.value
  if (!val) {
    // Validate khi blur mà chưa chọn gì
    await validateField('departmentName')
    return
  }
  if (typeof val === 'object') return
  const v = String(val).trim().toLowerCase()
  if (!v) {
    departmentName.value = undefined
    await validateField('departmentName')
    return
  }

  const match = departments.value.find(
    (d) =>
      d.departmentAbbreviation?.toLowerCase() === v ||
      d.departmentCode?.toLowerCase() === v ||
      d.departmentName?.toLowerCase() === v
  )
  if (match) {
    departmentName.value = match
  } else {
    // Không tìm thấy -> reset về undefined để hiển thị placeholder
    departmentName.value = undefined
    await validateField('departmentName')
  }
}

/**
 * Chuẩn hóa chọn AssetType khi blur/change
 * Nếu user nhập text (abbreviation/code), tự động tìm và chọn asset type tương ứng
 * Đồng thời tự động set depreciationRate và useYears từ asset type
 * Nếu không tìm thấy, reset về null để hiển thị placeholder
 */
const resolveAssetType = async () => {
  // Đánh dấu field đã được touch
  touchedFields.value.add('assetTypeName')

  const val = assetTypeName.value
  if (!val) {
    // Validate khi blur mà chưa chọn gì
    await validateField('assetTypeName')
    return
  }

  if (typeof val === 'object') {
    depreciationRate.value = Number(val?.assetTypeDepreciationRate ?? 0)

    const life = val.assetTypeLifeTime ?? val.AssetTypeLifeTime

    if (life != null && !Number.isNaN(Number(life))) {
      useYears.value = Math.round(Number(life))
    }
    return
  }

  const v = String(val).trim().toLowerCase()
  if (!v) {
    assetTypeName.value = undefined
    await validateField('assetTypeName')
    return
  }

  const match = assetTypes.value.find(
    (t) =>
      t.assetTypeAbbreviation?.toLowerCase() === v ||
      t.assetTypeCode?.toLowerCase() === v
  )
if (match) {
    assetTypeName.value = match
    depreciationRate.value = Number(match?.assetTypeDepreciationRate ?? 0)
    const life = match.assetTypeLifeTime ?? match.AssetTypeLifeTime
    if (life != null && !Number.isNaN(Number(life))) {
      useYears.value = Math.round(Number(life))
    }
  } else {
    // Không tìm thấy -> reset về undefined để hiển thị placeholder
    assetTypeName.value = undefined
    await validateField('assetTypeName')
  }
}

// Tự động tính hao mòn năm khi đổi giá hoặc tỷ lệ
watch([price, depreciationRate], () => {
  annualDepreciation.value = (Number(price.value || 0) * Number(depreciationRate.value || 0)) / 100
})

// Tự động set tỷ lệ hao mòn và số năm sử dụng khi chọn loại tài sản
watch(assetTypeName, (newVal) => {
  if (isFillingForm.value) return // Bỏ qua khi đang fill form Edit/Duplicate
  if (newVal && typeof newVal === 'object') {
    depreciationRate.value = Number(newVal?.assetTypeDepreciationRate ?? 0)
    const life = newVal.assetTypeLifeTime ?? newVal.AssetTypeLifeTime
    if (life != null && !Number.isNaN(Number(life))) {
      useYears.value = Math.round(Number(life))
    }
  }
})

// Mỗi lần mở modal: nạp danh mục + fill form / tạo mã mới
watch(
  () => props.isOpen,
  async (open) => {
    if (!open) {
      resetAll()
      return
    }

    await ensureCatalogsLoaded()

    if (props.mode === 'add') {
      // Reset form về giá trị mặc định TRƯỚC khi tăng formKey
      resetForm()
      departmentName.value = undefined
      assetTypeName.value = undefined

      // Tăng formKey để force re-render form SAU khi reset
      formKey.value++
      await nextTick()

      // Lấy mã mới từ BE khi thêm mới
      try {
        const res = await APIAsset.generateNewCode()
        assetCode.value = res.data?.data || res.data
      } catch {
        // ignore
      }
    } else if (props.assetData) {
      // Edit / Duplicate -> đổ dữ liệu từ assetData trước khi tăng formKey
      await setFormData(props.assetData)

      // Tăng formKey sau khi fill data để re-render với dữ liệu đúng
      formKey.value++
      await nextTick()

      if (props.mode === 'duplicate') {
        // Duplicate: tạo mã mới
        try {
          const res = await APIAsset.generateNewCode()
          assetCode.value = res.data?.data || res.data
        } catch {
          // ignore
        }
      }
    }
    await nextTick()
    safeFocus()
  }
)

// Expose setErrors để component cha có thể set lỗi từ backend
defineExpose({
  setErrors
})

</script>

<style>
.sub {
  color: #ccc;
  font-size: 14px;
}

/* Responsive modal */
.modal-content {
  width: 100% !important;
  height: 100%;
  max-height: 90vh; /* Giới hạn chiều cao tối đa */
  font-size: var(--font-size-base);
  display: flex;
  flex-direction: column;
}

/* Form grid responsive - các cột sẽ co giãn theo modal */
.form-grid {
  display: grid;
  gap: 16px;
  width: 100%;
}

/* Grid 2 cột: 1 cột nhỏ (mã) + 1 cột lớn (tên) */
.form-grid-2 {
  grid-template-columns: minmax(150px, 1fr) minmax(200px, 2fr);
}

/* Grid 2 cột bằng nhau */
.form-grid-2-equal {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Grid 3 cột: 3 cột bằng nhau */
.form-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* Đảm bảo các input field co giãn theo grid */
.form-grid > div {
  min-width: 0; /* Cho phép flex item co lại nhỏ hơn content */
}

/* Responsive: Khi modal nhỏ hơn 700px, chuyển về 1 cột */
@container (max-width: 700px) {
  .form-grid-2,
  .form-grid-2-equal,
  .form-grid-3 {
    grid-template-columns: 1fr;
  }
}

.scroll {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding-right: 10px; /* Thêm padding để tránh scrollbar che nội dung */
}

.modal-footer {
  height: var(--modal-footer-height) !important;
  flex-shrink: 0; /* Không cho footer bị co lại */
}

.modal-head {
  flex-shrink: 0; /* Không cho header bị co lại */
}

/* Responsive cho màn hình 1366px */
@media (max-width: 1366px) {
  .modal-content {
    font-size: 13px; /* Giảm font size */
    max-height: 580px !important; /* Chiều cao cố định 580px để scroll xuất hiện */
  }
  
  .modal-head {
    padding: 14px 12px; /* Giảm padding header */
  }
  
  .modal-head .text-2xl {
    font-size: 18px; /* Giảm font size title */
  }
  
  .modal-body {
    padding: 0 12px 24px 12px; /* Giảm padding body */
    gap: 16px; /* Giảm gap giữa các row */
  }
  
  .form-grid {
    gap: 12px; /* Giảm gap giữa các field */
  }
  
  .modal-footer {
    height: 48px !important; /* Giảm chiều cao footer */
    padding: 0 12px; /* Giảm padding footer */
  }
  
  /* Giảm kích thước input fields */
  .modal-content input,
  .modal-content select,
  .modal-content textarea {
    font-size: 13px;
    padding: 8px 10px;
  }
  
  /* Giảm kích thước label */
  .modal-content label {
    font-size: 13px;
    margin-bottom: 4px;
  }
  
  /* Giảm kích thước button */
  .modal-footer button {
    font-size: 13px;
    padding: 8px 16px;
  }
}

/* Label font-size responsive */
@media (min-width: 1920px) {
  .modal-content label {
    font-size: 15px;
  }
}

/* Dropdown option styling */
.dropdown-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-code {
  font-weight: 600;
  color: #333;
}

.option-divider {
  color: #999;
}

.option-name {
  color: #666;
  font-size: 14px;
}

</style>
