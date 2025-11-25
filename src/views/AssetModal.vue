<template>
  <MsModal to="body" :isOpen="isOpen">
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
        <div class="grid grid-cols-3 gap-16">
          <div class="col-span-1">
            <MsInput
              tabindex="1"
              size="large"
              isRequired
              v-model="assetCode"
              v-bind="assetCodeAttrs"
              :error_message="errors.assetCode"
              :label="t('asset.assetCode')"
              :placeholder="t('asset.assetCodePlaceholder')"
              @blur="checkDuplicateAssetCode"
            />
          </div>
          <div class="col-span-2">
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
        <div class="grid grid-cols-3 gap-16">
          <div class="col-span-1">
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
          <div class="col-span-2">
            <MsInput
              size="large"
              disabled
              :modelValue="departmentName?.departmentName"
              :label="t('asset.departmentName')"
              placeholder=""
            />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-16">
          <div class="col-span-1">
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
          <div class="col-span-2">
            <MsInput
              size="large"
              disabled
              :modelValue="assetTypeName?.assetTypeName"
              :label="t('asset.assetTypeName')"
              placeholder=""
            />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-16">
          <div class="col-span-1">
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
          <div class="col-span-1">
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
          <div class="col-span-1">
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
        <div class="grid grid-cols-3 gap-16">
          <div class="col-span-1">
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
          <div class="col-span-1">
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
          <div class="col-span-1">
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
        <div class="grid grid-cols-3 gap-16">
          <div class="col-span-1">
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
          <div class="col-span-1">
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

const { t } = useI18n()

// -------------------- Danh mục từ BE --------------------
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
const { errors, handleSubmit, defineField, resetForm, setErrors, validateField, setFieldTouched } = useForm({
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
const [departmentName, departmentNameAttrs] = defineField('departmentName')
const [assetTypeName, assetTypeNameAttrs] = defineField('assetTypeName')
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

/**
 * Submit form: dùng vee-validate, chỉ validate khi bấm Lưu
 */
const onSubmit = handleSubmit(
  async (values) => {
    // Kiểm tra trùng mã tài sản trước khi submit
    const code = values.assetCode?.trim()
    if (code && (props.mode !== 'edit' || code !== originalAssetCode.value)) {
      try {
        const response = await APIAsset.checkDuplicateCode(code)
        const isDuplicate = response.data?.data ?? false
        
        if (isDuplicate) {
          setErrors({
            assetCode: t('asset.errors.assetCode_duplicate')
          })
          errorMessage.value = t('asset.errors.assetCode_duplicate')
          isOpenErrorModal.value = true
          return
        }
      } catch (error) {
        // Ignore error
      }
    }

    // Kiểm tra: hao mòn năm không vượt quá nguyên giá
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

/**
 * Đổ dữ liệu assetData (Edit / Duplicate) vào form
 * - useYears lấy từ AssetLifeTime / assetTypeLifeTime / useYears nếu có
 */
const setFormData = async (data) => {
  if (!data) return

  isFillingForm.value = true // Bắt đầu fill form
  
  // Reset các select về undefined trước
  departmentName.value = undefined
  assetTypeName.value = undefined

  const get = (obj, keys, def = undefined) => {
    for (const k of keys) if (obj?.[k] !== undefined) return obj[k]
    return def
  }

  assetCode.value = get(data, ['assetCode', 'AssetCode'], '')
  // Lưu mã gốc để so sánh khi edit
  originalAssetCode.value = assetCode.value
  assetName.value = get(data, ['assetName', 'AssetName'], '')
  quantity.value = Number(get(data, ['quantity', 'Quantity', 'assetQuantity', 'AssetQuantity'], 0))
  price.value = Number(get(data, ['price', 'Price', 'assetPrice', 'AssetPrice'], 0))

  const lifeRaw = get(
    data,
    [
      'useYears',
      'UseYears',
      'assetTypeLifeTime',
      'AssetTypeLifeTime',
      'assetLifeTime',
      'AssetLifeTime',
      'lifeTime',
      'lifetime',
      'LifeTime',
    ],
    0
  )
  useYears.value = lifeRaw != null && !Number.isNaN(Number(lifeRaw)) ? Number(lifeRaw) : 0

  depreciationRate.value = Number(
    get(
      data,
      ['depreciationRate', 'DepreciationRate', 'assetTypeDepreciationRate'],
      0
    )
  )

  const start = get(data, ['startDate', 'StartDate', 'assetStartDate', 'AssetStartDate'], null)
  if (start) startDate.value = new Date(start)

  const purch = get(
    data,
    ['purchaseDate', 'PurchaseDate', 'assetPurchaseDate', 'AssetPurchaseDate'],
    null
  )
  if (purch) purchaseDate.value = new Date(purch)

  // Map Department theo id hoặc tên
  const did = get(data, ['departmentId', 'DepartmentId'], null)
  const dname = get(data, ['departmentName', 'DepartmentName'], null)

  if (departments.value.length > 0) {
    let dept = null

    // Ưu tiên tìm theo ID
    if (did) {
      dept = departments.value.find((d) => String(d.departmentId) === String(did))
    }

    // Nếu không có ID hoặc không tìm thấy, tìm theo tên
    if (!dept && dname) {
      const searchName = String(dname).trim().toLowerCase()
      dept = departments.value.find((d) => {
        const fullName = d.departmentName?.trim().toLowerCase()
        const abbr = d.departmentAbbreviation?.trim().toLowerCase()
        const code = d.departmentCode?.trim().toLowerCase()
        const match = fullName === searchName || abbr === searchName || code === searchName
        return match
      })
    }

    if (dept) {
      await nextTick()
      departmentName.value = dept
    }
  }

  // Map AssetType theo id hoặc tên
  const tid = get(data, ['assetTypeId', 'AssetTypeId'], null)
  const tname = get(data, ['assetTypeName', 'AssetTypeName'], null)

  if (assetTypes.value.length > 0) {
    let at = null

    // Ưu tiên tìm theo ID
    if (tid) {
      at = assetTypes.value.find((t) => String(t.assetTypeId) === String(tid))
    }

    // Nếu không có ID hoặc không tìm thấy, tìm theo tên
    if (!at && tname) {
      const searchName = String(tname).trim().toLowerCase()
      at = assetTypes.value.find((t) => {
        const fullName = t.assetTypeName?.trim().toLowerCase()
        const abbr = t.assetTypeAbbreviation?.trim().toLowerCase()
        const code = t.assetTypeCode?.trim().toLowerCase()
        const match = fullName === searchName || abbr === searchName || code === searchName
        return match
      })
    }

    if (at) {
      await nextTick()
      assetTypeName.value = at
      // Không ghi đè nếu đã có giá trị từ data
      if (!depreciationRate.value || Number.isNaN(Number(depreciationRate.value))) {
        depreciationRate.value = Number(at.assetTypeDepreciationRate ?? 0)
      }
      if (!useYears.value || Number.isNaN(Number(useYears.value))) {
        const life = at.assetTypeLifeTime ?? at.AssetTypeLifeTime
        if (life != null && !Number.isNaN(Number(life))) {
          useYears.value = Math.round(Number(life))
        }
      }
    }
  }

  // Tính hao mòn năm nếu chưa có
  const ad = get(
    data,
    ['annualDepreciation', 'AnnualDepreciation', 'assetAnnualDepreciation', 'AssetAnnualDepreciation'],
    null
  )
  annualDepreciation.value =
    ad != null ? Number(ad) : (price.value * Number(depreciationRate.value || 0)) / 100

  // Cập nhật năm theo dõi
  if (purchaseDate.value instanceof Date) {
    trackingYear.value = purchaseDate.value.getFullYear()
  } else {
    trackingYear.value = new Date().getFullYear()
  }
  
  // Kết thúc fill form
  await nextTick()
  isFillingForm.value = false
}

/**
 * Kiểm tra trùng mã tài sản khi blur
 */
const checkDuplicateAssetCode = async () => {
  const code = assetCode.value?.trim()
  
  // Không kiểm tra nếu:
  // - Mã rỗng (sẽ được validate bởi schema)
  // - Đang ở chế độ edit và mã không thay đổi
  if (!code) return
  if (props.mode === 'edit' && code === originalAssetCode.value) return
  
  try {
    // Gọi API kiểm tra trùng mã
    const response = await APIAsset.checkDuplicateCode(code)
    const isDuplicate = response.data?.data ?? false
    
    if (isDuplicate) {
      // Set lỗi cho field assetCode
      setErrors({
        assetCode: t('asset.errors.assetCode_duplicate')
      })
    }
  } catch (error) {
    // Ignore error
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

</script>

<style>
.sub {
  color: #ccc;
  font-size: 14px;
}

.scroll {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.text-right-input input {
  text-align: right !important;
}

/* Responsive modal */
.modal-content {
  width: var(--modal-width) !important;
  font-size: var(--font-size-base);
}

.modal-footer {
  height: var(--modal-footer-height) !important;
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
