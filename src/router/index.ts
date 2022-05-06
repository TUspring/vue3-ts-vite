import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import("../views/Home/index.vue")
const Login = () => import("../views/Login/index.vue")
const Detail = () => import("../views/Detail/index.vue")
const Module = () => import("../views/Module/index.vue")

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/module', name: 'module', component: Module },
  { path: '/detail/:id/:item', name: 'Detail', component: Detail },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (window.localStorage.getItem('ACCESS_TOKEN')) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
      window.localStorage.clear()
    }
  }
  else {
    next();
  }
})

export default router