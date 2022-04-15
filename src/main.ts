import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// import axios from "./axios";
import 'vant/lib/index.css'
import "./styles/common.css"; //公共css
import './styles/base.scss';
import "./styles/iconfont.css"; //字体图标

import vant from 'vant'
import { Toast } from 'vant'

import "./utils/rem"
import './api/mock'
import Banner from "./components/Banner/index.vue"
const app = createApp(App)
app.config.globalProperties.$toast = Toast

app.component('banner', Banner).use(router).use(store).use(vant).mount('#app')