declare module '*.vue' { // 定义 .vue 文件模块
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
 
declare module 'jsonwebtoken' // 定义 jsonwebtoken 模块