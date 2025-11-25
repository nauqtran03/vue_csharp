/**
 * Hàm định dạng thời gian thành dd/mm/yyyy để tránh timezone
 * @param date - Thời gian cần định dạng
 * @returns {string} - Thời gian đã được định dạng yyyy-mm-dd
 * createdby: TQQUAN
 */

export const formatDateOnly = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
