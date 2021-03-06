import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import path from 'path' 
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: './', // 打包路径
  resolve: { // 解析
    alias: { // 重命名路劲
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 4000, // 服务端口
    proxy: { // 代理
      '/api': {
        target: "http://dingtalk.whitehorse.cn/",
        changeOrigin: true,
        ws: false,
        // rewrite: path => path.replace(/^\/api/, '')
      },
      '/crm': {
        // target: "http://dingtalk.whitehorse.cn/",
        target: "http://crm.test.whitehorse.cn/",
        changeOrigin: true,
        ws: false,
        rewrite: path => path.replace(/^\/crm/, '')
      }
    },
    cors: true,
    hmr: true
  }
})