<template>
  <div class="construction-page-container">
    <div class="content-box">
      <div class="icon-placeholder">
        🚧
      </div>
      <h1 class="title">Tính năng đang được phát triển</h1>
      <p class="message">
        Chúng tôi đang gấp rút hoàn thiện trang này. Vui lòng quay lại sau hoặc chuyển đến trang khác.
      </p>

      <div class="actions">
        <MsButton buttonType="primary" @click="goBack" size="medium">
          Quay lại trang trước
        </MsButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import MsButton from '@/components/ms-button/MsButton.vue'; // Giả sử đường dẫn

const router = useRouter();

/**
 * Quay lại trang trước đó trong lịch sử trình duyệt
 */
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.construction-page-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f7ff; /* Màu nền thường dùng trong dự án của bạn */
  padding: 20px;
}

.content-box {
  text-align: center;
  background: #ffffff;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  max-width: 450px;
}

.icon-placeholder {
  font-size: 80px;
  margin-bottom: 20px;
  color: #ffc107; 
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.message {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 30px;
}
</style>
