import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/style/style.css'
import './assets/style/common.css'
import './assets/style/icons.css'
import './assets/style/fonts.css'
import './assets/style/primevue-override.css'
import App from './App.vue'
import router from './router'
import { i18n } from './plugin/i18n'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { primeVueConfig } from './config/primevue.config.js'

const app = createApp(App)

app.use(PrimeVue, {
  ...primeVueConfig,
    theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
          cssLayer: false
        }
    }
});
app.use(createPinia())
app.use(router)
app.use(i18n)


app.config.globalProperties.$primevue.config.locale = {
  dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th1',
    'Th2',
    'Th3',
    'Th4',
    'Th5',
    'Th6',
    'Th7',
    'Th8',
    'Th9',
    'Th10',
    'Th11',
    'Th12',
  ],
}
app.mount('#app')
