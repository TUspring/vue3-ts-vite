import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import("../views/home/index.vue")
const Login = () => import("../views/login/index.vue")
const FlowList = () => import("../views/flowList/index.vue")
const Module = () => import("../views/module/index.vue")
const Audit = () => import("../views/audit/index.vue")
const Select = () => import("../views/select/index.vue")

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/module', name: 'module', component: Module },
  { path: '/flowList', name: 'flowList', component: FlowList },
  { path: '/audit', name: 'audit', component: Audit },
  { path: '/select', name: 'select', component: Select },
  { path: '/login', name: 'login', component: Login }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (window.localStorage.getItem('ACCESS_TOKEN')) {
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