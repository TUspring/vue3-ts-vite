import Qs from "qs";
export default {
  baseURL: "/",
  method: "GET",
  headers: {},
  params: {},
  timeout: 300000,
  withCredentials: true,
  responseType: "json",
  maxContentLength: 4000,
  validateStatus: (status: any) => status >= 200 && status < 300,
  maxRedirects: 5,
  transformRequest: [
    function (data: any) {
      if (Object.prototype.toString.call(data) === "[object Object]") {
        return Qs.stringify(data, { arrayFormat: "indices" });
      } else {
        return data;
      }
    },
  ],
  paramsSerializer: (params: any) =>
    Qs.stringify(params, { arrayFormat: "indices" }),
};
