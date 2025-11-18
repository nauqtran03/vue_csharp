/**
 * Data cho sidebar
 * @param {*} t - i18n
 * @returns {Array} - Data cho sidebar
 */

export const sidebarData = (t) => [
    {
        id:0,
        title: t('sidebar.dashboard'),
        icon: 'dashboard-icon',
        active_icon: 'dashboard-active-icon',
        hasDropdown: false,
    },
    {
        id:1,
        title: t('sidebar.asset'),
        icon: 'asset-icon',
        active_icon: 'asset-active-icon',
        hasDropdown: true,
    },
    {
        id:2,
        title: t('sidebar.asset-ht-db'),
        icon: 'asset-htdb-icon',
        active_icon: 'asset-htdb-active-icon',
        hasDropdown: true,
    },
    {
        id:3,
        title: t('sidebar.tool'),
        icon: 'tool-icon',
        active_icon: 'tool-active-icon',
        hasDropdown: true,
    },
    {
        id:4,
        title: t('sidebar.category'),
        icon: 'category-icon',
        active_icon: 'category-active-icon',
        hasDropdown: false,
    },
    {
        id:5,
        title: t('sidebar.lookup'),
        icon: 'lookup-icon',
        active_icon: 'lookup-active-icon',
        hasDropdown: true,
    },
    {
        id:6,
        title: t('sidebar.report'),
        icon: 'report-icon',
        active_icon: 'report-active-icon',
        hasDropdown: true,
    }
]
