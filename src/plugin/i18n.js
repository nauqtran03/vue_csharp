import { createI18n } from "vue-i18n";
import viSidebar from '../locales/vi/sidebar.json';
import viAsset from '../locales/vi/asset.json';
import viCommon from '../locales/vi/common.json';
import viTable from '../locales/vi/table.json'
const messages = {
    vi:{
        sidebar: viSidebar,
        asset: viAsset,
        common: viCommon,
        table: viTable
    }
}
export const i18n = createI18n({
    locale: 'vi',
    messages,
    legacy: false // sử dụng Composition API
})
