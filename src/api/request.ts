import axios from 'axios'

const service = axios.create({ // 创建服务
    baseURL: '/api/',
    timeout: 5000
})

service.interceptors.request.use(config => { // 请求拦截处理
    const token = window.localStorage.getItem("accessToken")
    if (token) {
        config.headers.common.Authorization = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

service.interceptors.response.use(response => { // 响应拦截处理
    const res = response.data
    if (response.status !== 200) {
        return Promise.reject(new Error(res.message || 'Error'))
    } else {
        return res
    }
}, error => {
    return Promise.reject(error)
})

export default service