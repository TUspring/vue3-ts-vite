<template>
  <div style="height: 100%;">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup="props">
  import * as dd from "dingtalk-jsapi";
  import { onMounted, getCurrentInstance } from "vue";
  import { Toast } from 'vant'
  const { proxy: { $http } } = getCurrentInstance()
  onMounted(() => {
    var wxKey = (function () {
      return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
    })();
    if (dd.env.platform === "notInDingTalk") {
      if (wxKey) {
        console.log('微信环境')
      } else {
        console.log('这里不是钉钉和微信环境')
      }
    } else {
      dd.ready(function () {
        // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
        dd.runtime.permission.requestAuthCode({
          corpId: 'ding55d1ed30f1647b6235c2f4657eb6378f', //必填，企业ID
          onSuccess: function (result) {
            getAutoLogin(result.code)
          },
          onFail: function (error) {
            if (error.errorCode == 3) {
              Toast('请先用钉钉软件加入企业“海南白马户外媒体投资有限公司”！');
            } else {
              Toast('获取钉钉信息失败');
            }
          },
        });
      });
    }
  });

  const getAutoLogin = (code) => {
    $http.autoLogin({ code }).then(res => {
      let { status, data, message } = res;
      if (status === 'ok') {
        if (!data.token) {
          console.log('没有token')
        } else {
          // 存储 accsss token 信息
          sessionStorage.setItem('IS_USER_LOGINED', 'Y');
          localStorage.setItem('OA_USER_INFO', JSON.stringify(data));
          localStorage.setItem('ACCESS_TOKEN', data.token);

          // localStorage.setItem('ACCESS_TOKEN_EXP', time + data.expires_in * 1000);
          // Toast('登录成功！')
        }
      } else {
        Toast(message)
      }
    }).catch(error => {
      Toast(error.message)
    })
  }
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    height: 100%;
  }

  html,
  body {
    height: 100%;
  }
</style>