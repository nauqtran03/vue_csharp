import BaseAPI from '@/apis/base/APIBase.js'

class APIAssetType extends BaseAPI {
  constructor() {
    super()
    this.controller = 'AssetTypes'
  }
}

export default new APIAssetType()

