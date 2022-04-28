import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'vant/lib/index.css'
import "./styles/common.css"; //公共css
import './styles/base.scss';
import "./styles/iconfont.css"; //字体图标
import http from "./api/index";
import vant from 'vant'
import "./utils/rem"; //移动端单位转换，px=>rem
import Banner from "./components/Banner/index.vue"
const app = createApp(App)
app.config.globalProperties.$http = http

app.component('banner', Banner).use(router).use(store).use(vant).mount('#app')