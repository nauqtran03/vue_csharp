import BaseAPI from '@/apis/base/APIBase.js'

class APIDepartment extends BaseAPI {
  constructor() {
    super()
    this.controller = 'Departments'
  }
}

export default new APIDepartment()

