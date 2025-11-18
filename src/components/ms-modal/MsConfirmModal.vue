<template>
  <MsModal :isOpen="isOpenConfirmModal" to="body">
    <div class="modal-confirm-content rounded-md">
      <div class="modal-confirm-body">
        <div class="">
          <span class="icon warning-icon"></span>
        </div>
        <div style="line-height: 1.8" class="text-sm text-gray-500">
          <slot name="content">
            <span v-html="content"></span>
          </slot>
        </div>
      </div>
      <div class="modal-confirm-footer flex justify-end">
        <slot name="footer">
          <MsButton v-if="cancelText" :buttonType="cancelType" size="medium" @click="handleCancel">
            {{ cancelText }}
          </MsButton>
          <MsButton
            v-if="cancelSaveText"
            :buttonType="cancelSaveType"
            size="medium"
            @click="handleCancelSave"
          >
            {{ cancelSaveText }}
          </MsButton>
          <MsButton v-if="confirmText" :buttonType="confirmType" size="medium" @click="handleConfirm">
            {{ confirmText }}
          </MsButton>
        </slot>
      </div>
    </div>
  </MsModal>
</template>

<script setup>
import MsModal from './MsModal.vue'
import MsButton from '../ms-button/MsButton.vue'

//#region Props
defineProps({
  isOpenConfirmModal: Boolean,
  content: {
    type: String,
  },
  // Text của các nút
  confirmText: {
    type: String,
  },
  cancelText: {
    type: String,
  },
  cancelSaveText: {
    type: String,
  },
  // Loại của các nút
  confirmType: {
    type: String,
    default: 'primary',
  },
  cancelType: {
    type: String,
    default: 'outline',
  },
  cancelSaveType: {
    type: String,
    default: 'sub',
  },
})
//#endregion Props

//#region Emits
const emit = defineEmits(['update:isOpenConfirmModal', 'confirm', 'cancel', 'cancelSave'])
//#endregion Emits

//#region Methods

const handleConfirm = () => {
  emit('confirm')
  emit('update:isOpenConfirmModal', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:isOpenConfirmModal', false)
}

// Nút không lưu hiện tại chỉ đóng confirm modal chứ không xử lý gì thêm
const handleCancelSave = () => {
  emit('cancelSave')
  emit('update:isOpenConfirmModal', false)
}
//#endregion Methods
</script>

  <style >
.modal-confirm-content {
  width: 430px;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-confirm-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 36px 30px;
}
.modal-confirm-footer {
  height: 52px;
  padding: 0 20px 16px 20px;
  gap: 10px;
}
</style>
