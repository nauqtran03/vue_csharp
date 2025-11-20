<template>
  <div class="header d-flex justify-content-between align-items-center">
    <!-- Header left -->
    <div class="header-left d-flex align-items-center gap-24">
      <div class="title d-flex align-items-center">
        <span class="text">{{ pageTitle}}</span>
      </div>
    </div>
    <!-- Header right -->
    <div class="header-right d-flex align-items-center">
      <span class="link">Sở tài chính</span>
      <div class="select-year align-items-center">
        <span class="select-year-text">Năm</span>
        <span class="select-year-number">2025</span>
        <div class="d-flex flex-direction-column gap-2">
          <span class="icon up-icon"></span>
          <span class="icon dropdown-icon"></span>
        </div>
      </div>
      <div class="d-flex items-center gap-20">
        <span class="icon notification-icon"> </span>
        <span class="icon menu-icon"> </span>
        <span class="icon question-icon"> </span>
        <div class="d-flex gap-8 align-items-center">
          <span class="icon avatar-icon"> </span>
          <span class="icon dropdown-icon"> </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue';

const route = useRoute()

// Hàm đọc title từ route meta
// Created by: TQQUAN - 18/11/2025
const pageTitle = computed(() => {
  return route.meta.title || 'MISA QLTS'
})

</script>
<style scoped>
/* Header */
.header {
  height: var(--header-height);
  padding: 0 var(--page-padding-x);
  white-space: nowrap;
  overflow: hidden;
  background-color: #ffffff;
}

/* Header left */
.header-left .text {
  font-size: 15px;
  font-weight: 700;
  color: #000000;
}

/* Header right */
.header-right .link {
  font-weight: 500;
  color: #000000;
}

.header-right .select-year-number,
.select-year-text {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-color);
}

.select-year {
  display: flex;
  align-items: center;
  background: var(--bg-hover);
  padding: 0 8px 0 14px;
  border-radius: 3px;
  margin-right: 24px;
  margin-left: 20px;
  height: 30px;
  max-width: 112px;
  cursor: pointer;
}

.select-year-number {
  padding-left: 16px;
  padding-right: 10px;
  font-weight: 700 !important;
}

.icon {
  display: block;
  cursor: pointer;
}
</style>
