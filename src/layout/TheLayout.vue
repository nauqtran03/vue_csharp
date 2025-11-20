<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <TheSidebar />

    <!-- Main content wrapper -->
    <div class="wrapper flex-1">
      <!-- Header -->
      <TheHeader />
      <!-- Main content area -->
      <div class="main-content d-flex flex-1 flex-direction-column w-100">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import TheSidebar from './sidebar/TheSidebar.vue';
import TheHeader from './header/TheHeader.vue';
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  flex: 1;
}
.main-content{
  background-color: #f4f7ff;
  flex:1;
  min-height: 0;
  overflow: hidden;
}
</style>
