import Abstract from '../axios/index';

class Basic extends Abstract {
  sendCode(params: object) {
    return this.getRequest({ url: '/api/user/verify_code', params })
  }
  userLogin(data: object) {
    return this.postRequest({ url: '/api/user/phone_login', data })
  }
  // 自动登录
  autoLogin(data: object) {
    return this.postRequest({ url: '/api/user/login', data })
  }
  //模板列表
  approvalModuleList(data: object) {
    return this.postRequest({ url: '/api/user/approval/list', data })
  }
  //模板详情
  approvalModuleDetail(data: object) {
    return this.postRequest({ url: '/api/user/approval/detail', data })
  }
  //保存提审模板
  saveEditModule(data: object) {
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
  //审批页详情数据
  handleDetail(params = {}) {
    return this.getRequest({ url: '/api/user/approval/audit_detail', params })
  }
  //上传图片
  uploadFile(data: object) {
    return this.postRequest({ url: '/api/upload', data })
  }
}
export default new Basic()