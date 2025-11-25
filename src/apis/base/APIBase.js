import api from '@/apis/config/APIConfig.js'

export default class BaseAPI {
  constructor() {
    this.controller = null
  }
  /**
   * Phương thức lấy tất cả dữ liệu
   * createdby: TQQUAN
   */
  getAll() {
    return api.get(`${this.controller}`)
  }
  /**
   * Hàm lấy thông tin  theo ID
   * @param {string} id - ID của tài sản
   * @param {Object} payload - Payload của request
   * createdby: TQQUAN
   */
  getById(id, payload = null) {
    return api.get(`${this.controller}/${id}`, { params: payload })
  }
  /**
   * Lấy bản ghi theo mã duy nhất (UniqueAttribute)
   * @param {string} code
   */
  getByCode(code) {
    return api.get(`${this.controller}/by-code/${encodeURIComponent(code)}`)
  }
  /**
   * Hàm lấy dữ liệu phân trang
   * @param {*} payload
   * createdby: TQQUAN
   */
  paging(payload) {
    return api.get(`${this.controller}/paging`, { params: payload })
  }
  /**
   * Hàm cập nhật dữ liệu
   * @param {*} id
   * @param {*} body
   * createdby: TQQUAN
   */
  update(id, body) {
    return api.put(`${this.controller}/${id}`, body)
  }

  /**
   * Hàm tạo dữ liệu
   * @param {*} body
   * createdby: TQQUAN
   */
  create(body) {
    return api.post(`${this.controller}`, body)
  }

  /**
   * Hàm xóa bản ghi
   * @param {*} id
   * createdby: TQQUAN
   */
  delete(id) {
    return api.delete(`${this.controller}/${id}`)
  }

  /**
   * Hàm xóa nhiều bản ghi
   * @param {*} id
   * createdby: TQQUAN
   */
  deleteMultiple(body) {
    return api.post(`${this.controller}/delete-multiple`, body)
  }

  /**
   * Tạo mã mới
   * @returns {Promise} - Promise trả về mã mới
   * createdby: TQQUAN
   */
  generateNewCode() {
    return api.get(`${this.controller}/new-code`)
  }
}
