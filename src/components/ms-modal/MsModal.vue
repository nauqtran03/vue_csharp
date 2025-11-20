<template>
  <Teleport :to="to">
    <div v-if="isOpen" class="modal">
      <div class="overlay">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  to: String,
  isOpen: Boolean,
});
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


.modal-content {
  position: relative;
  width: 900px;
  max-height: 90vh;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  padding: 0 16px 36px 14px;
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
</style>
