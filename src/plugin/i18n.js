import { createI18n } from "vue-i18n";
import viSidebar from '../locales/vi/sidebar.json';
import viHeader from '../locales/vi/header.json';
import viAsset from '../locales/vi/asset.json';
import viCommon from '../locales/vi/common.json';
const messages = {
    vi:{
        sidebar: viSidebar,
        header: viHeader,
        asset: viAsset,
        common: viCommon
    }
}
export const i18n = createI18n({
    locale: 'vi',
    messages,
    legacy: false // sử dụng Composition API
})
