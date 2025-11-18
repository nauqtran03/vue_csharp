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

      <!-- content giữ nguyên -->
      <div class="scroll modal-body flex flex-col gap-20">
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
              v-model="departmentName"
              v-bind="departmentNameAttrs"
              :error_message="errors.departmentName"
              :label="t('asset.departmentCode')"
              :placeholder="t('asset.departmentNamePlaceholder')"
              :options="departments"
              optionLabel="departmentAbbreviation"
            />
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
              v-model="assetTypeName"
              v-bind="assetTypeNameAttrs"
              :error_message="errors.assetTypeName"
              :label="t('asset.assetTypeCode')"
              :placeholder="t('asset.assetTypeNamePlaceholder')"
              :options="assetTypes"
              optionLabel="assetTypeAbbreviation"
            />
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
            />
          </div>
          <div class="col-span-1">
            <MsInputNumber
              size="large"
              tabindex="11"
              isRequired
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
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEqual } from 'lodash'
import MsButton from '@/components/ms-button/MsButton.vue'
import MsInputNumber from '@/components/ms-input/MsInputNumber.vue'
import MsDatePicker from '@/components/ms-date/MsDatePicker.vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsFilterSelect from '@/components/ms-filter/MsFilterSelect.vue'

const { t } = useI18n()

// Dữ liệu mẫu
const departments = ref([
  { departmentId: 1, departmentName: 'Phòng IT', departmentAbbreviation: 'IT' },
  { departmentId: 2, departmentName: 'Phòng Kế toán', departmentAbbreviation: 'KT' },
  { departmentId: 3, departmentName: 'Phòng Nhân sự', departmentAbbreviation: 'NS' }
])

const assetTypes = ref([
  { assetTypeId: 1, assetTypeName: 'Máy vi tính', assetTypeAbbreviation: 'MVT', depreciationRate: 25, lifeTime: 4 },
  { assetTypeId: 2, assetTypeName: 'Bàn ghế', assetTypeAbbreviation: 'BG', depreciationRate: 10, lifeTime: 10 },
  { assetTypeId: 3, assetTypeName: 'Thiết bị văn phòng', assetTypeAbbreviation: 'TBVP', depreciationRate: 20, lifeTime: 5 }
])

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

// Form setup - TẮT TẤT CẢ validation tự động
const { errors, handleSubmit, defineField, resetForm, setErrors } = useForm({
  validationSchema: assetSchema(t),
  initialValues: {
    assetCode: undefined,
    assetName: undefined,
    departmentName: undefined,
    assetTypeName: undefined,
    quantity: 0,
    price: 0,
    annualDepreciation: 0,
    depreciationRate: 0,
    useYears: 0,
    purchaseDate: undefined,
    startDate: undefined,
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
const [purchaseDate, purchaseDateAttrs] = defineField('purchaseDate')
const [price, priceAttrs] = defineField('price')
const [annualDepreciation, annualDepreciationAttrs] = defineField('annualDepreciation')
const [depreciationRate, depreciationRateAttrs] = defineField('depreciationRate')
const [startDate, startDateAttrs] = defineField('startDate')
const [useYears, useYearsAttrs] = defineField('useYears')

// State
const isOpenConfirmModal = ref(false)
const isOpenErrorModal = ref(false)
const errorMessage = ref('')
const trackingYear = ref(new Date().getFullYear())
const clonedAssetData = ref(null)
const firstInputRef = ref(null)
const isLoadingData = ref(false)

/**
 * Kiểm tra xem form có dữ liệu thực sự chưa
 */
const hasFormData = () => {
  const hasData = !!(
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

  console.log('hasFormData:', hasData)
  return hasData
}

/**
 * Xử lý nút hủy/đóng modal
 */
const showCancelConfirm = (event) => {
  // QUAN TRỌNG: Ngăn form submit
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  console.log('showCancelConfirm called, mode:', props.mode)

  if (props.mode === 'edit') {
    const currentData = getCurrentFormData()

    if (!isEqual(clonedAssetData.value, currentData)) {
      console.log('Edit mode - has changes, show confirm')
      isOpenConfirmModal.value = true
    } else {
      console.log('Edit mode - no changes, close directly')
      handleConfirmCancel()
    }
  } else {
    const hasData = hasFormData()
    console.log('Add/Duplicate mode - hasData:', hasData)

    if (hasData) {
      console.log('Has data, show confirm')
      isOpenConfirmModal.value = true
    } else {
      console.log('No data, close directly')
      handleConfirmCancel()
    }
  }
}

/**
 * Xác nhận hủy bỏ - đóng modal ngay
 */
const handleConfirmCancel = () => {
  console.log('handleConfirmCancel - closing modal immediately')
  isOpenConfirmModal.value = false
  handleCloseModal()
}

/**
 * Xác nhận submit từ edit confirm modal
 */
const handleConfirmSubmit = () => {
  console.log('handleConfirmSubmit - submit form')
  isOpenConfirmModal.value = false
  onSubmit()
}

/**
 * Đóng modal
 */
const handleCloseModal = () => {
  console.log('handleCloseModal called')
  emit('update:isOpen', false)
  setTimeout(() => {
    resetForm()
    setErrors({})
    clonedAssetData.value = null
    isOpenConfirmModal.value = false
    isOpenErrorModal.value = false
    errorMessage.value = ''
  }, 150)
}

/**
 * Lấy dữ liệu hiện tại từ form
 */
const getCurrentFormData = () => {
  return {
    assetCode: assetCode.value,
    assetName: assetName.value,
    departmentId: departmentName.value?.departmentId,
    departmentName: departmentName.value?.departmentName,
    assetTypeId: assetTypeName.value?.assetTypeId,
    assetTypeName: assetTypeName.value?.assetTypeName,
    quantity: quantity.value,
    price: price.value,
    depreciationRate: depreciationRate.value,
    annualDepreciation: annualDepreciation.value,
    useYears: useYears.value,
    purchaseDate: purchaseDate.value ? new Date(purchaseDate.value).getTime() : null,
    startDate: startDate.value ? new Date(startDate.value).getTime() : null,
  }
}

/**
 * Submit form - CHỈ validate khi bấm nút Lưu
 */
const onSubmit = handleSubmit(
  (values) => {
    console.log('onSubmit - validation SUCCESS')

    if (values.annualDepreciation > values.price) {
      errorMessage.value = t('asset.depreciationExceedsPriceError')
      isOpenErrorModal.value = true
      return
    }

    const depreciationRateDecimal = (values.depreciationRate / 100).toFixed(4)
    const expectedRate = (1 / values.useYears).toFixed(4)
    if (depreciationRateDecimal !== expectedRate) {
      errorMessage.value = 'Tỷ lệ hao mòn phải bằng 1/số năm sử dụng'
      isOpenErrorModal.value = true
      return
    }

    emit('submit', values)
  },
  ({ errors: validationErrors }) => {
    console.log('onSubmit - validation FAILED', validationErrors)

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

/**
 * Đóng modal lỗi
 */
const handleCloseErrorModal = () => {
  isOpenErrorModal.value = false
  errorMessage.value = ''
}

/**
 * Fill dữ liệu vào form
 */
const setFormData = async (data) => {
  if (!data) return

  isLoadingData.value = true

  assetCode.value = data.assetCode
  assetName.value = data.assetName
  quantity.value = data.quantity
  price.value = data.price
  useYears.value = data.useYear
  depreciationRate.value = data.depreciationRate

  if (data.startDate) {
    startDate.value = new Date(data.startDate)
  }

  if (data.purchaseDate) {
    purchaseDate.value = new Date(data.purchaseDate)
  }

  if (departments.value.length > 0) {
    const dept = departments.value.find((d) => d.departmentId === data.departmentId)
    if (dept) {
      departmentName.value = dept
    }
  }

  if (assetTypes.value.length > 0) {
    const assetType = assetTypes.value.find((t) => t.assetTypeId === data.assetTypeId)
    if (assetType) {
      assetTypeName.value = assetType
    }
  }

  await nextTick()
  annualDepreciation.value = data.annualDepreciation
  isLoadingData.value = false
}

// Watchers
watch([price, depreciationRate], () => {
  if (!isLoadingData.value) {
    annualDepreciation.value = (price.value * depreciationRate.value) / 100
  }
})

watch(assetTypeName, () => {
  depreciationRate.value = assetTypeName.value?.depreciationRate ?? 0
  useYears.value = assetTypeName.value?.lifeTime ?? 0
})

watch(purchaseDate, () => {
  trackingYear.value = purchaseDate.value?.getFullYear()
})

watch(
  () => props.isOpen,
  async () => {
    if (!props.isOpen) {
      resetForm()
      setErrors({})
      clonedAssetData.value = null
      isOpenErrorModal.value = false
      errorMessage.value = ''
    } else if (props.mode === 'add') {
      await nextTick()
      firstInputRef.value?.focus()
    } else if (props.mode === 'duplicate' && props.assetData) {
      await setFormData(props.assetData)
      await nextTick()
      firstInputRef.value?.focus()
    } else if (props.mode === 'edit' && props.assetData) {
      await setFormData(props.assetData)

      clonedAssetData.value = {
        assetCode: props.assetData.assetCode,
        assetName: props.assetName,
        departmentId: props.assetData.departmentId,
        departmentName: props.assetData.departmentName,
        assetTypeId: props.assetData.assetTypeId,
        assetTypeName: props.assetData.assetTypeName,
        quantity: props.assetData.quantity,
        price: props.assetData.price,
        depreciationRate: props.assetData.depreciationRate,
        annualDepreciation: props.assetData.annualDepreciation,
        useYears: props.assetData.useYear,
        purchaseDate: props.assetData.purchaseDate
          ? new Date(props.assetData.purchaseDate).getTime()
          : null,
        startDate: props.assetData.startDate ? new Date(props.assetData.startDate).getTime() : null,
      }

      await nextTick()
      firstInputRef.value?.focus()
    }
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

</style>
