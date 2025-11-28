export const formatter = {
  date: (date) => formatDate(date),
  text: (text) => text,
  number: (number) => formatNumber(number),
  currency: (currency) => formatCurrency(currency),
}

/**
 * Hàm định dạng thời gian
 * @param date - Thời gian cần định dạng
 * @returns {string} - Thời gian đã được định dạng dd/mm/yyyy
 * createdby: TQQUAN
 */
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0') // thêm số 0 vào đầu nếu ngày chỉ có 1 chữ số
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}


/**
 * Hàm định dạng số
 * @param number - Số cần định dạng
 * @returns {string} - Số đã được định dạng .000
 * createdby: TQQUAN
 */
const formatNumber = (number) => {
  if (number === null || number === undefined) return ''
  return number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}


/**
 * Hàm định dạng tiền tệ
 * @param currency - Số tiền cần định dạng
 * @returns {string} - Số tiền đã được định dạng .000
 * createdby: TQQUAN
 */
const formatCurrency = (currency) => {
  if (currency === null || currency === undefined) return ''
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2, 
  }).format(currency)
}
