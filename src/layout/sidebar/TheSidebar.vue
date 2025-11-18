<template>
  <div :class="['sidebar d-flex flex-direction-column justify-content-between', !isShow && 'collapsed']">
    <!-- Logo -->
    <div class="logo d-flex align-items-center gap-12 px-6 py-3">
      <span class="icon logo-icon"></span>
      <span class="logo-text">{{ t('sidebar.title') }}</span>
    </div>

    <!-- Menu list sidebar -->
    <ul class="sidebar-list d-flex flex-1 align-items-center flex-direction-column">
      <li v-for="item in menuItems" :key="item.id"
        class="sidebar-item w-100 d-flex align-items-center justify-content-between px-3 py-2">
        <div class="d-flex gap-12 ">
          <span :class="`icon ${item.icon}`"></span>
          <span :class="`icon active-icon ${item.active_icon}`"></span>
          <span class="label flex-1">{{ item.title }}</span>
        </div>
        <span v-if="item.hasDropdown" class="icon arrow-icon"></span>
      </li>
    </ul>
    <div class="sidebar-footer">
      <MsButton buttonType="toggle" @click="handleToggle">
        <span v-if="isShow" class="icon toggle-icon-close"></span>
        <span v-else class="icon toggle-icon-open"></span>
      </MsButton>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { sidebarData } from '@/contants/sidebarData';
import MsButton from '@/components/ms-button/MsButton.vue';

//#region State
const { t } = useI18n();
const isShow = ref(true);
const menuItems = computed(() => sidebarData(t));
const autoCollapseWidth = 800;
//#endregion

//#region Methods
/**
 * Hàm xử lý thu gọn sidebar
 * createdby: TQQUAN (14/11/2025)
 */
const handleToggle = () => {
  isShow.value = !isShow.value;
}

/**
 * Hàm xử lý tự động thu gọn sidebar khi nhỏ hơn kích thước quy định
 * createdby: TQQUAN (14/11/2025)
 */
const handleResize = () => {
  if (window.innerWidth < autoCollapseWidth) {
    isShow.value = false;
  } else {
    isShow.value = true;
  }
}
//#endregion
//#region Lifecycle hooks
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
//#endregion

</script>

<style scoped>
.sidebar {
  background: var(--sidebar-bg);
  width: 220px;
  height: 100vh;
  transition: width 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.logo {
  height: 50px;
  padding: 8px 20px 0px 20px !important;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--sidebar-text-hover);
  min-width: 120px;
  overflow: hidden;
}

.sidebar ul {
  border-radius: 4px;
  padding: 15px 12px;
}

.sidebar ul li .label {
  min-width: 100px;
  justify-items: center;
  color: var(--sidebar-text-primary);
}


.sidebar ul li:hover {
  cursor: pointer;
  border-radius: 4px;
  background: var(--sidebar-bg-hover);
}

.sidebar ul li:hover .label {
  color: var(--sidebar-text-hover);
}

.sidebar ul li:hover .icon {
  background: var(--sidebar-text-hover);
}

.sidebar ul li:hover .arrow-icon {
  background-color: var(--sidebar-text-hover);
}

.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
  transition: all 0.3s ease;
}

.sidebar.collapsed .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 11px 0 4px 0 !important;
  width: 100%;
}

.sidebar.collapsed .label,
.sidebar.collapsed .logo-text,
.sidebar.collapsed .arrow-icon {
  display: none;
  transition: all 0.3s ease;
}

.sidebar.collapsed ul {
  align-items: center;
}

.sidebar.collapsed ul li {
  align-items: center;
  padding: 8px 10px !important;
}

.active-icon {
  display: none;
}

.sidebar-item {
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.sidebar-item .label {
  white-space: nowrap;
  overflow: hidden;
  line-height: 24px;
  display: flex;
  align-items: center;
}

.collapsed .sidebar-item:hover {
  border-radius: 6px;
}



.collapsed .sidebar-footer {
  justify-content: center;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
