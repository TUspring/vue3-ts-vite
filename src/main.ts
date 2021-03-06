import { createApp } from 'vue'
import "babel-polyfill";
import App from './App.vue'
import router from './router/index'
import vant from 'vant'
import store from './store/index'
import util from "./utils/util"; //公共方法
import http from "./api/index"; //http 

import 'vant/lib/index.css'
import './styles/base.scss'; //初始化css
import "./styles/common.css"; //公共css
import "./styles/iconfont.css"; //字体图标
import "./utils/rem"; //移动端单位转换，px=>rem

const app = createApp(App)
app.config.globalProperties.$util = util;//全局方法、属性
app.config.globalProperties.$http = http;//全局接口api

app.use(router).use(store).use(vant).mount('#app')