import Abstract from '../axios/index';

class Basic extends Abstract {
  sendCode(params: any) {
    return this.getRequest({ url: '/api/user/verify_code', params })
  }
  userLogin(data: any) {
    return this.postRequest({ url: '/api/user/phone_login', data })
  }
  //模板列表
  approvalModuleList(data: any) {
    return this.postRequest({ url: '/api/user/approval/list', data })
  }
  //模板详情
  approvalModuleDetail(data: any) {
    return this.postRequest({ url: '/api/user/approval/detail', data })
  }
  //保存提审模板
  saveEditModule(data: any) {
    return this.postRequest({ url: '/api/user/approval/save', data })
  }

}
export default new Basic()