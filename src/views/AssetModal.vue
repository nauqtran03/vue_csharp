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
              :disabled="props.mode === 'edit'"
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
              :placeholder="t('asset.departmentCodePlaceholder')"
              :options="departments"
              optionLabel="departmentAbbreviation"
              @blur="resolveDepartment"
              @change="resolveDepartment"
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
              :placeholder="t('asset.assetTypeCodePlaceholder')"
              :options="assetTypes"
              optionLabel="assetTypeAbbreviation"
              @blur="resolveAssetType"
              @change="resolveAssetType"
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
import APIAsset from '@/apis/components/APIAsset.js'
import { useI18n } from 'vue-i18n'
import { isEqual } from 'lodash'
import MsButton from '@/components/ms-button/MsButton.vue'
import MsInputNumber from '@/components/ms-input/MsInputNumber.vue'
import MsDatePicker from '@/components/ms-date/MsDatePicker.vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsFilterSelect from '@/components/ms-filter/MsFilterSelect.vue'
import APIDepartment from '@/apis/components/APIDepartment.js'
import APIAssetType from '@/apis/components/APIAssetType.js'

const { t } = useI18n()

// Danh sách lấy từ BE
const departments = ref([])
const assetTypes = ref([])

// Đảm bảo danh mục được nạp trước khi fill form
const ensureCatalogsLoaded = async () => {
  if (Array.isArray(departments.value) && departments.value.length > 0 && Array.isArray(assetTypes.value) && assetTypes.value.length > 0) return
  try {
    const [deptRes, typeRes] = await Promise.all([
      APIDepartment.getAll(),
      APIAssetType.getAll(),
    ])
    departments.value = (deptRes.data?.data || deptRes.data || []).map((d) => ({
      departmentId: d.departmentId ?? d.DepartmentId ?? d.deptId,
      departmentName: d.departmentName ?? d.DepartmentName ?? d.deptName,
      departmentAbbreviation: d.departmentAbbreviation ?? d.DepartmentAbbreviation ?? d.deptAbbr,
      departmentCode: d.departmentCode ?? d.DepartmentCode ?? d.deptCode,
    }))
    assetTypes.value = (typeRes.data?.data || typeRes.data || []).map((t) => ({
      assetTypeId: t.assetTypeId ?? t.AssetTypeId ?? t.typeId,
      assetTypeName: t.assetTypeName ?? t.AssetTypeName ?? t.typeName,
      assetTypeAbbreviation: t.assetTypeAbbreviation ?? t.AssetTypeAbbreviation ?? t.typeAbbr,
      assetTypeDepreciationRate: t.assetTypeDepreciationRate ?? t.AssetTypeDepreciationRate ?? t.depreciationRate ?? t.rate,
      assetLifeTime: t.assetLifeTime ?? t.AssetLifeTime ?? t.lifeTime ?? t.lifetime ?? t.LifeTime,
      assetTypeCode: t.assetTypeCode ?? t.AssetTypeCode ?? t.typeCode,
    }))
  } catch {}
}

// Helpers: lấy số an toàn theo nhiều key khác nhau
const pickNumber = (obj, keys, def = 0) => {
  for (const k of keys) {
    const v = obj?.[k]
    if (v !== undefined && v !== null && !Number.isNaN(Number(v))) return Number(v)
  }
  return Number(def)
}

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
    assetTypeLifeTime: 0,
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
const [assetTypeLifeTime, assetTypeLifeTimeAttrs] = defineField('assetTypeLifeTime')

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
    assetTypeLifeTime: assetTypeLifeTime.value,
    purchaseDate: purchaseDate.value ? new Date(purchaseDate.value).getTime() : null,
    startDate: startDate.value ? new Date(startDate.value).getTime() : null,
  }
}

  // ...
  const setFormData = async (data) => {
    // ...
    assetTypeLifeTime.value = Number(
      get(
        data,
        [
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
    )
    // ...
  }

  // ...
  watch([price, depreciationRate], () => {
    // ...
  })

  // ...
  watch(assetTypeName, async (val) => {
    // ...
    if (typeof val === 'object' && val !== null) {
      depreciationRate.value = Number(val?.assetTypeDepreciationRate ?? 0)
      assetTypeLifeTime.value = Math.round(Number(val?.assetLifeTime ?? 0))
      if ((!assetTypeLifeTime.value || Number(assetTypeLifeTime.value) === 0) && Number(depreciationRate.value) > 0) {
        assetTypeLifeTime.value = Math.round(100 / Number(depreciationRate.value))
      }
    }
    // ...
  })

  // ...
  const clonedAssetData = ref(null)
  // ...
  clonedAssetData.value = {
    assetCode: props.assetData?.assetCode ?? props.assetData?.AssetCode ?? '',
    assetName: props.assetData?.assetName ?? props.assetData?.AssetName ?? '',
    departmentId: props.assetData?.departmentId ?? props.assetData?.DepartmentId ?? null,
    departmentName: props.assetData?.departmentName ?? null,
    assetTypeId: props.assetData?.assetTypeId ?? props.assetData?.AssetTypeId ?? null,
    assetTypeName: props.assetData?.assetTypeName ?? null,
    quantity: props.assetData?.quantity ?? props.assetData?.assetQuantity ?? 0,
    price: props.assetData?.price ?? props.assetData?.assetPrice ?? 0,
    depreciationRate: props.assetData?.depreciationRate ?? 0,
    annualDepreciation:
      props.assetData?.annualDepreciation ?? props.assetData?.assetAnnualDepreciation ?? 0,
    assetTypeLifeTime:
      props.assetData?.assetTypeLifeTime ??
      props.assetData?.AssetTypeLifeTime ??
      props.assetData?.assetLifeTime ??
      props.assetData?.AssetLifeTime ??
      0,
    purchaseDate: props.assetData?.purchaseDate
      ? new Date(props.assetData.purchaseDate).getTime()
      : null,
    startDate: props.assetData?.startDate
      ? new Date(props.assetData.startDate).getTime()
      : null,
  }

      await nextTick()
      safeFocus()
    }
  }
)

// Bỏ watcher nạp danh mục tự động để tránh race; dùng ensureCatalogsLoaded trong watcher trên

// Helper: focus vào input thật sự trong MsInput
function safeFocus() {
  try {
    const el = firstInputRef.value?.$el?.querySelector?.('input,textarea,[tabindex]')
    if (el && typeof el.focus === 'function') el.focus()
  } catch {}
}

// Nếu danh mục đến sau, tự map theo id khi modal đang mở
watch([departments, () => props.assetData, () => props.isOpen], () => {
  if (!props.isOpen) return
  if (!(props.mode === 'edit' || props.mode === 'duplicate')) return
  const did = props.assetData?.departmentId || props.assetData?.DepartmentId
  if (did && !departmentName.value) {
    const dept = departments.value.find(d => d.departmentId === did)
    if (dept) departmentName.value = dept
  }
}, { deep: true })

watch([assetTypes, () => props.assetData, () => props.isOpen], () => {
  if (!props.isOpen) return
  if (!(props.mode === 'edit' || props.mode === 'duplicate')) return
  const tid = props.assetData?.assetTypeId || props.assetData?.AssetTypeId
  if (tid && !assetTypeName.value) {
    const at = assetTypes.value.find(t => t.assetTypeId === tid)
    if (at) assetTypeName.value = at
  }
}, { deep: true })
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

</style>
