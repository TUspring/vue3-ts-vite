import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
      }
    },
    cors: true
  }
})