<template>
  <Teleport :to="to">
    <div v-if="isOpen" class="modal">
      <div class="overlay" @click.self="handleOverlayClick">
        <div 
          ref="modalRef"
          class="modal-resizable"
          :style="modalStyle"
          @mousedown="startDrag"
        >
          <slot />
          <!-- Resize handle - chỉ hiển thị khi resizable = true -->
          <div 
            v-if="resizable"
            class="resize-handle"
            @mousedown.stop="startResize"
            title="Kéo để thay đổi kích thước"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2L2 14M14 8L8 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  to: String,
  isOpen: Boolean,
  resizable: {
    type: Boolean,
    default: false // Mặc định KHÔNG resize (cho modal confirm)
  },
  minWidth: {
    type: Number,
    default: 600
  },
  minHeight: {
    type: Number,
    default: 400
  },
  defaultWidth: {
    type: Number,
    default: 900
  }
})

const emit = defineEmits(['close'])

const modalRef = ref(null)
const modalWidth = ref(props.defaultWidth)
const modalHeight = ref(null)
const isResizing = ref(false)

const modalStyle = computed(() => {
  // Chỉ apply dynamic size khi resizable = true
  if (!props.resizable) {
    return {} // Để CSS mặc định xử lý
  }
  
  const style = {
    width: `${modalWidth.value}px`,
    maxHeight: '90vh'
  }
  
  if (modalHeight.value) {
    style.height = `${modalHeight.value}px`
  } else {
    // Chiều cao mặc định khi chưa resize - cố định để không tự động tăng
    // Không set height, chỉ dùng maxHeight để modal tự fit nhưng không vượt quá
    style.maxHeight = '85vh' // Giới hạn để không bị quá cao
  }
  
  return style
})

// Reset size khi đóng/mở modal
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    modalWidth.value = props.defaultWidth
    modalHeight.value = null
  }
})

const handleOverlayClick = () => {
  // Có thể emit close nếu muốn đóng khi click overlay
  // emit('close')
}

const startResize = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = modalWidth.value
  const startHeight = modalHeight.value || modalRef.value?.offsetHeight || 0
  
  const onMouseMove = (e) => {
    if (!isResizing.value) return
    
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    
    // Update width
    const newWidth = Math.max(props.minWidth, Math.min(window.innerWidth - 100, startWidth + deltaX))
    modalWidth.value = newWidth
    
    // Update height
    const maxHeight = window.innerHeight * 0.9
    const newHeight = Math.max(props.minHeight, Math.min(maxHeight, startHeight + deltaY))
    modalHeight.value = newHeight
  }
  
  const onMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  
  document.body.style.cursor = 'nwse-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const startDrag = (e) => {
  // Chỉ cho phép drag từ header, không phải toàn bộ modal
  // Bỏ qua nếu đang resize
  if (isResizing.value) return
}
</script>

<style>
/* CSS cho MsModal.vue */
.modal {
  position: relative;
  display: flex; /* Giữ nguyên flex để căn giữa nếu cần */
  margin: auto;
}

.modal .overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* Modal resizable wrapper */
.modal-resizable {
  position: relative;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto; /* Scroll khi nội dung vượt quá */
}

/* Modal resizable - khi có resize handle */
.modal-resizable:has(.resize-handle) {
  overflow: hidden; /* Không scroll khi có resize */
}

.modal-content {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
}

/* Head của Modal */
.modal-head {
  padding: 18px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-head .btn-close {
  cursor: pointer;
}

/* Body của Modal */
.modal-body {
  padding: 0 16px 16px 14px;
  flex: 1;
  overflow-y: auto;
}

/* Footer của Modal */
.modal-footer {
  height: var(--modal-footer-height);
  padding: 0 var(--modal-padding);
  gap: 10px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #e0e0e0;
}

/* Modal wrapper - container cho resize */
.modal-wrapper {
  position: relative;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Resize handle - góc dưới bên phải */
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nwse-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  z-index: 1001;
  background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.05) 50%);
}

.resize-handle:hover {
  color: #666;
  background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.1) 50%);
}

.resize-handle svg {
  width: 12px;
  height: 12px;
}
</style>
