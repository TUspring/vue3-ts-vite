<template>
  <div class="login-page">
    <div class="title">
      <p>登录钉钉账号</p>
    </div>

    <div class="page-content">
      <div class="form-item">
        <div class="input-label">
          <i class="iconfont icon-shoujihao"></i>
        </div>
        <input class="input-item" type="tel" v-model="state.phone" placeholder="请输入手机号">
      </div>
      <div class="form-item">
        <div class="input-label">
          <i class="iconfont icon-yanzhengma1"></i>
        </div>
        <input class="input-item" type="tel" v-model="state.code" placeholder="请输入短信验证码">
        <div class="input-right-addons">
          <span class="validate-code" :class="codeDelay > 0 ? 'is-disabled':''" @click="validCode">{{ codeDelay > 0
            ? codeDelay+'s后重发' : '获取验证码'}}</span>
        </div>
      </div>
      <div>
        <van-button class="form-button" type="primary" :disabled='state.isAvailable' @click="login">登录</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { reactive, computed } from "vue";
  import { Toast } from 'vant'
  import { useRouter } from "vue-router";
  import $http from "@/api/index.ts";
  export default {
    name: 'Login',
    setup() {
      $http.loginCode({ userid: '李皓仪', city: '北京', year: '2022', start: '1', end: '12', type: '候车亭' }).then((res) => {
      })
      const router = useRouter();
      const phoneVal = /^1[0-9][0-9]{9}$/;
      let codeDelay = 0;
      let state = reactive({
        phone: "",
        code: "",
        userName: "",
        passWord: "",
        isAvailable: true,
      });
      state.isAvailable = computed(() => {
        if (phoneVal.test(state.phone) && state.phone.length === 11 && state.code.length === 6) {
          return false
        } else {
          return true
        }
      })
      const initError = () => {
        Toast({
          type: "fail",
          message: "登录失败"
        });
        window.localStorage.clear();
        router.push("/login");
      };
      const login = async () => {
        if (!state.userName) {
          Toast({
            type: "text",
            message: "请输入用户名"
          });
          return;
        }
        if (!state.passWord) {
          Toast({
            type: "text",
            message: "请输入密码"
          });
          return;
        }

        $http.loginCode({ userid: '李皓仪', city: '北京', year: '2022', start: '1', end: '12', type: '候车亭' }).then((res) => {
          console.log(res)
        })
        // loginCode({ userid: '李皓仪', city: '北京', year: '2022', start: '1', end: '12', type: '候车亭' }).then(res => {
        //   Toast({
        //     type: "success",
        //     message: "登录成功"
        //   });
        //   console.log(res)
        //   // 设置 token
        //   // window.localStorage.setItem("accessToken", res.data.token);
        //   // router.push("/select");
        // },
        //   error => {
        //     initError();
        //   }
        // ).catch(error => {
        //   initError();
        // });
      };
      const validCode = async () => {
        if (codeDelay > 0) {
          return false;
        }
        if (state.phone.length == '') {
          return Toast('请输入手机号码！');
        }
        if (!phoneVal.test(state.phone)) {
          return Toast('请输入正确的手机号码！');
        }
        httpGetCode();
      };
      //请求验证码
      const httpGetCode = async () => {
        toLogin({ userName: state.userName, passWord: state.passWord }).then(res => {
          Toast({
            type: "success",
            message: "登录成功"
          });
          // console.log(res)
        })
        // this.$http.sendCode({
        //   phone: this.loginForm.phone
        // }).then((res) => {
        //   let { data, status, message } = res;
        //   if (status === 'ok') {
        //     this.countDown(); //发起倒计时
        //   } else {
        //     Toast(message)
        //   }
        // }).catch((error) => {
        //   Toast(error.message)
        // })
      }

      return {
        state,
        codeDelay,
        login,
        validCode
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-page {
    width: 100%;
    height: 100%;
    background-color: #fff;

    .title {
      text-align: center;
      padding-bottom: 30px;
      padding-top: 120px;
      font-size: 18px;
      font-weight: bold;
    }

    .page-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 0 40px;

      .form-item {
        height: 54px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        position: relative;

        input {
          width: 100%;
          height: 100%;
          font-size: 16px;
        }

        input::placeholder {
          color: #d5d5d5;
        }

        .input-label {
          width: 40px;
          padding-left: 5px;
          text-align: left;
          flex-shrink: 0;

          i {
            font-size: 20px;
            color: #999;
          }
        }

        .input-right-addons {
          width: 100px;
          text-align: right;
          flex-shrink: 0;

          img {
            width: 100%;
          }

          .validate-code {
            color: #888;
            font-size: 12px;
            border-radius: 4px;
            padding: 6px 10px;
            border: 1px solid #ccc;
            display: inline-block;
          }

          .is-disabled {
            color: #bababa;
            border: none;
            background: #eee;
          }
        }
      }

      .form-button {
        width: 100%;
        color: #fff;
        margin-top: 32px;
        background: #49f;
        border-radius: 3px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .form-addons {
        margin-top: 20px;
      }
    }
  }
</style>