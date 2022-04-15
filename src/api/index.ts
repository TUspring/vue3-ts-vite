import type { AxiosPromise } from 'axios'
import request from './request'
import Abstract from '../axios/index';
class Basic extends Abstract {
  loginCode(params: any) {
    const url = "/shop/h5/open/user/sms/sign/code";
    return new Promise(resolve => {
      console.log(2)
      // this.postRequest({ url, params }).then(res => {
      //   resolve(res);
      // });
    });
  }
}
// let login = new Basic()
console.log(21)
console.log(new Basic())

 
// // 获取首页banner新闻数据
// export const getBannerList = (): AxiosPromise => {
//   return request({
//     url: '/bannerList'
//   })
// }

// //  获取首页newsList数据
// export const getNewsList = (): AxiosPromise => {
//   return request({
//     url: '/newsList'
//   })
// }

// //获取newsDetail数据
// export const getNewsDetail = (id: any): AxiosPromise => {
//   return request.post('/detailList', {
//     id
//   })
// }

// 登录验证
export const toLogin = (data: Object): AxiosPromise => {
  return request.post('/login', data)
}
export default new Basic()
// export default {
//   // getBannerList,
//   // getNewsList,
//   // getNewsDetail,
//   toLogin
// }



// class Basic extends Abstract {
//   loginCode(params:any) {
//       const url = "/shop/h5/open/user/sms/sign/code";
//       return new Promise(resolve => {
//           this.postRequest({ url, params }).then(res => {
//           resolve(res);
//           });
//       });
//   }

//   login(params:any) {
//       const url = "/shop/h5/open/user/sms/share/sale/login";
//       return new Promise(resolve => {
//           this.postRequest({ url, params }).then(res => {
//           resolve(res);
//           });
//       });
//   }
// }
// // 单列模式返回对象
// let login;
// export default (() => {
//   if (login) return login;
//   login = new Basic();
//   return login;
// })();

// import './api/login'
