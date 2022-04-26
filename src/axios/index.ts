/**
 * axios基础构建
 * @date 2022-03-04
 */
let HOST = ''
import instance from './intercept';
import { AxiosRequest, CustomResponse } from './types';
import { Toast } from 'vant';

const token = window.localStorage.getItem("userInfo") ? JSON.parse(window.localStorage.getItem("userInfo") || "").token : "",
  reqURL = HOST,
  header: object = {
    // 'Content-Type': 'application/json;charset=UTF-8',//Payload
    'Content-Type': 'application/x-www-form-urlencoded',//Form Data
    'X-Requested-With': 'XMLHttpRequest',
    token: token
  };
class Abstract {
  private apiAxios({ baseURL = reqURL, headers = header, method, url, data, params, responseType }: AxiosRequest): Promise<CustomResponse> {
    return new Promise((resolve, reject) => {
      instance({
        baseURL,
        headers,
        method,
        url,
        params,
        data,
        responseType,
      }).then((res) => {
        if (res.headers.token) {
          resetToken(res.headers);
        }
        if (res.status === 200) {  // 200:服务端业务处理正常结束
          if (res.data.status === 'ok') {
            resolve(res.data);
          } else {
            Toast.fail({ message: res.data?.message });
            resolve(res.data);
          }
        } else {
          resolve({ status: false, message: res.data?.message, data: null });
        }
      }).catch((err) => {
        const message = err?.data?.message || err?.message;
        Toast.fail({ message });
        reject({ status: false, message, data: null });
      });
    });
  }

  /**
   * GET类型的网络请求
   */
  protected getRequest({ url, data, params, responseType, show }: AxiosRequest) {
    return new Promise((resolve, reject) => {
      this.apiAxios({ method: 'GET', url, data, params, responseType, show }).then(res => {
        resolve(res)
      }).catch((error) => {
        reject(error)
      });
    });
  }

  /**
   * POST类型的网络请求
   */
  protected postRequest({ url, data, params, responseType, show }: AxiosRequest) {
    return new Promise((resolve, reject) => {
      this.apiAxios({ method: 'POST', url, data, params, responseType, show }).then(res => {
        resolve(res)
      }).catch((error) => {
        reject(error)
      });
    });
  }

  /**
   * PUT类型的网络请求
   */
  protected putRequest({ url, data, params, responseType }: AxiosRequest) {
    return new Promise((resolve, reject) => {
      this.apiAxios({ method: 'PUT', url, data, params, responseType }).then(res => {
        resolve(res)
      }).catch((error) => {
        reject(error)
      });
    });
  }

  /**
   * DELETE类型的网络请求
   */
  protected deleteRequest({ url, data, params, responseType }: AxiosRequest) {
    return new Promise((resolve, reject) => {
      this.apiAxios({ method: 'DELETE', url, data, params, responseType }).then(res => {
        resolve(res)
      }).catch((error) => {
        reject(error)
      });
    });
  }
}
export default Abstract;


function resetToken(header: any) {
  let userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "");
  delete userInfo["token"];
  userInfo["token"] = header.token;
}
