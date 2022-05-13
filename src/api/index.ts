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
  //处理列表
  allFlowList(params = {}) {
    return this.getRequest({ url: '/api/user/approval/get_all_audit', params })
  }
  //处理列表
  flowHandleList(params = {}) {
    return this.getRequest({ url: '/api/user/approval/handle_list', params })
  }
  //发起列表
  submitList(params = {}) {
    return this.getRequest({ url: '/api/user/approval/submit_list', params })
  }
  //抄送列表
  carbonList(params = {}) {
    return this.getRequest({ url: '/api/user/approval/carbon_copy_list', params })
  }
}
export default new Basic()