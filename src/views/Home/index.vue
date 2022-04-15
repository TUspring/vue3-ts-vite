<template>
  <div class="home">
    <!-- <banner :bannerData="state.bannerData"></banner>
    <van-loading color="#1989fa" v-if="state.loading" /> -->
  </div>
</template>
<script lang="ts" setup="props">
  import { reactive, onMounted, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { getBannerList } from "../../api/index";
  import axios from 'axios';

  const router = useRouter();
  const store = useStore();

  // 获取上下文对象
  const instance = getCurrentInstance();
  const ctx = instance.appContext.config.globalProperties

  // 定义响应式数据
  const state = reactive({
    color: "#ccc",
    bannerData: [],
    loading: false
  });

  const initFN = () => {
    ctx.$toast({
      type: "fail",
      message: "请求失败"
    });
    state.loading = false;
  };

  // DOM 加载完成后更新数据
  onMounted(() => {
    axios({
      method: 'get',
      url: '/api/user/approval/list',
      responseType: 'stream'
    })
      .then(function (response) {
        console.log(response)
      });


    state.loading = true;
    getBannerList().then(
      (res: any) => {
        state.loading = false;
        state.bannerData = res.data;
        ctx.$toast({
          type: "success",
          message: "请求成功"
        });
        console.log(res);
      },
      error => {
        initFN();
      }
    )
      .catch(error => {
        initFN();
      });
  });
</script>
<style lang="scss" scoped>
  .home {
    height: 100%;
  }

  .text {
    color: v-bind("state.color");
    font-size: 20px;
    margin-block-start: 0;
    margin-block-end: 0;
    background-color: #2c323c;
  }

  .login {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background-color: pink;
  }
</style>