<template>
  <div class="login">
    <div class="passw-name-box">
      <div class="name">
        <i class="name-img"></i>
        <input v-model="state.userName" type="text" placeholder="请输入用户名" />
      </div>
      <div class="name">
        <i class="passw-img"></i>
        <input v-model="state.passWord" type="password" placeholder="请输入密码" />
      </div>
      <div>
        <van-button type="primary" @click="login">登录</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup="props">
  import { reactive, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { toLogin } from "../../api/index";
  const router = useRouter();

  const instance  = getCurrentInstance();
  const ctx = instance.appContext.config.globalProperties 
  const state = reactive({
    userName: "",
    passWord: ""
  });

  const initError = () => {
    ctx.$toast({
      type: "fail",
      message: "登录失败"
    });
    window.localStorage.clear();
    router.push("/login");
  };

  const login = async () => {
    if (!state.userName) {
      ctx.$toast({
        type: "text",
        message: "请输入用户名"
      });
      return;
    }

    if (!state.passWord) {
      ctx.$toast({
        type: "text",
        message: "请输入密码"
      });
      return;
    }
    toLogin({ userName: state.userName, passWord: state.passWord })
      .then(
        res => {
          ctx.$toast({
            type: "success",
            message: "登录成功"
          });

          // 设置 token
          window.localStorage.setItem("accessToken", res.data.token);
          console.log("res===>", res);
          router.push("/select");
        },
        error => {
          initError();
        }
      )
      .catch(error => {
        initError();
      });
  };
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    /* background: url("./login/bgimg.jpg") no-repeat; */
    background-size: 100% 100%;
    background-position: 100% 100%;

    .passw-name-box {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .name {
        display: flex;
        justify-content: center;
        padding: 5px 10px;

        input {
          width: 250px;
          height: 32px;
          outline: none;
          border: none;
          font-size: 16px;
          margin-left: 10px;
        }

        .name-img {
          display: block;
          width: 32px;
          height: 32px;
          /* background: url("./login/sno.png") no-repeat; */
          background-size: 100% 100%;
        }

        .passw-img {
          display: block;
          width: 32px;
          height: 32px;
          /* background: url("./login/pasw.png") no-repeat; */
          background-size: 100% 100%;
        }
      }
    }
  }
</style>