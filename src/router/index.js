
import TheLayout from '@/layout/TheLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component: TheLayout,
      redirect: '/asset',
      children: [
        {
          path:'asset',
          name:'asset',
          component: () => import('@/views/AssetPage.vue'),
          meta:{
            title:'Danh sách tài sản'
          }
        },
        {
          path:'dashboard',
          name:'dashboard',
          component: () => import('@/views/UnderConstructionPage.vue'),
          meta:{
          title:'Tổng quan'
          }
        },
        {
          path:'asset-htdb',
          name:'asset-htdb',
          component: () => import('@/views/UnderConstructionPage.vue'),
          meta:{
          title:'Tài sản HT-ĐB'
          }
        },
        {
          path:'tool',
          name:'tool',
          component: () => import('@/views/UnderConstructionPage.vue'),
          meta:{
          title:'Công cụ'
          }
        },
        {
          path:'category',
          name:'category',
          component: () => import('@/views/UnderConstructionPage.vue'),
          meta:{
          title:'Danh mục'
          }
        },
        {
          path:'lookup',
          name:'lookup',
          component: () => import('@/views/UnderConstructionPage.vue'),
          meta:{
          title:'Tra cứu'
          }
        },
        {
          path:'report',
          name:'report',
          component: () => import('@/views/UnderConstructionPage.vue'),
          meta:{
          title:'Báo cáo'
          }
        }
      ]
    },
    {

    }
  ],
})

// Set page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'MISA QLTS'
  next()
})
export default router
