import Abstract from '../axios/index';

class Basic extends Abstract {
  sendCode(params: any) {
    return this.getRequest({ url: '/api/user/verify_code', params })
  }
  userLogin(data: any) {
    return this.postRequest({ url: '/api/user/phone_login', data })
  }
  approvalModuleList(data: any) {
    return this.postRequest({ url: '/api/user/approval/list', data })
  } 
}
export default new Basic()