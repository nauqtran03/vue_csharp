import BaseAPI from '@/apis/base/APIBase.js'
import api from '@/apis/config/APIConfig.js'

class APIAsset extends BaseAPI {
  constructor() {
    super()
    this.controller = 'Assets'
  }

  // Lấy danh sách (endpoint tuỳ chỉnh)
  list() {
    return api.get(`${this.controller}/list`)
  }

  // Tạo bản ghi mới
  create(body) {
    return super.create(body)
  }

  // Cập nhật bản ghi
  update(id, body) {
    return super.update(id, body)
  }

  // Xoá nhiều
  deleteMultiple(ids) {
    return super.deleteMultiple(ids)
  }

  // Sinh mã mới
  generateNewCode() {
    return super.generateNewCode()
  }
}

export default new APIAsset()
