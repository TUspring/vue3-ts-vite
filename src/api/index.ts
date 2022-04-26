import Abstract from '../axios/index';

class Basic extends Abstract {
  loginCode(data: any) {
    return this.postRequest({ url: '/crm/suit/getSuitSummary?userid=michael', data })
  }
}
export default new Basic()