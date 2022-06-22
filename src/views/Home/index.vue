<template>
  <div class="list-page">
    <div class="message-tips" v-if="state.showBindInfo">
      <span>您还没有绑定系统账号！</span>
      <span style="color: #409eff;text-decoration:underline" @click="bindSystemAmount">去绑定</span>
    </div>

    <div class="nav-wrap">
      <ul>
        <li @click="navigateToFlow('all')">
          <div class="icon-info">
            <i class="iconfont icon-quanbu1" style="color: #ffa114"></i>
          </div>
          <div class="type">全部</div>
        </li>
        <li @click="navigateToFlow('handle', 1)">
          <div class="icon-info">
            <i class="iconfont icon-daichuli4" style="color: #ffa114"></i>
            <span class="badge-sign"
              v-if="state.listCount.wait_handle_count > 0">{{state.listCount.wait_handle_count}}</span>
          </div>
          <div class="type">待处理</div>
        </li>
        <li @click="navigateToFlow('handle', 2)">
          <div class="icon-info">
            <i class="iconfont icon-yichuli1" style="color: #67C23A"></i>
            <span class="badge-sign"
              v-if="state.listCount.has_handle_count > 0">{{state.listCount.has_handle_count}}</span>
          </div>
          <div class="type">已处理</div>
        </li>
        <li @click="navigateToFlow('submit')">
          <div class="icon-info">
            <i class="iconfont icon-faqi5" style="color: #409eff"></i>
            <span class="badge-sign" v-if="state.listCount.submit_count > 0">{{state.listCount.submit_count}}</span>
          </div>
          <div class="type">已发起</div>
        </li>
        <li @click="navigateToFlow()">
          <div class="icon-info">
            <i class="iconfont icon-fasong" style="color: #409eff"></i>
            <span class="badge-sign"
              v-if="state.listCount.carbon_copy_count > 0">{{state.listCount.carbon_copy_count}}</span>
          </div>
          <div class="type">我收到的</div>
        </li>
      </ul>
    </div>

    <div class="group-wrap" v-for="(group,index) in state.listData" :key="index">
      <div class="group-head df-bt" @click="changeOpenStatus(group)">
        <span class="group-name">{{group.group_name}}</span>
        <i class="iconfont icon-xiala1 open-icon" :class="group.isOpen ? 'open-status':''"></i>
      </div>

      <div class="list-content" v-if="!group.isOpen">
        <div v-for="(list,i) in group.list" :key="i" style="display: inline-block;width: 25%;">
          <div class="list-item" @click="navigateToModule(list)">
            <div>
              <img :src="list.icon" alt="" class="icon-img">
            </div>
            <div class="name">
              {{list.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup="props">
  import { reactive, onMounted, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { Toast } from 'vant'
  const router = useRouter();
  const store = useStore();

  // 获取上下文对象 
  const { ctx, proxy: { $http, $util } } = getCurrentInstance()
  // 定义响应式数据
  const state = reactive({
    dataInfo: {},
    listCount: {},
    listData: [],
    signPopupVisible: false,
    resultImg: '',
    showBindInfo: false,
  });
  const initFN = () => {
    Toast.clear();
  };

  // DOM 加载完成后更新数据
  onMounted(() => {
    getModuleList() 
  });
  
  const navigateToModule = (item) => {
    router.push({
      path: '/module',
      query: {
        id: item.id
      }
    })
  }
  //调整到审批流程详情
  const navigateToFlow = (key, type) => {
    router.push({
      path: '/flowList',
      query: {
        key,
        type
      }
    })
  }
  //绑定系统账号
  const bindSystemAmount = async () => { }
  //模板列表
  const getModuleList = async () => {
    Toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner'
    });
    $http.approvalModuleList().then(res => {
      if (res.status === "ok") {
        state.listData = res.data.list;
        state.listCount = res.data.status_count;
      } else {
        Toast(res.message)
      }
      Toast.clear();
    }).catch(error => {
      initFN()
    });
  }
  //折叠收起
  const changeOpenStatus = async (item) => {
    item.isOpen = item.isOpen ? false : true
  }
</script>

<style lang="scss" scoped>
  .list-page {
    width: 100%;
    min-height: 100%;
    padding: 10px 12px;
    background: #f8f8f8;

    .message-tips {
      background-color: #fef0f0;
      color: #333;
      margin: -10px -12px;
      margin-bottom: 10px;
      padding: 8px 15px;
    }

    .nav-wrap {
      padding: 12px 5px;
      background: #fff;
      border-radius: 6px;
      margin-bottom: 10px;

      ul {
        display: flex;

        li {
          flex: 1;
          text-align: center;

          .icon-info {
            position: relative;

            i {
              font-size: 28px;
            }

            .badge-sign {
              top: 0px;
              left: 45px;
              padding: 0px 6px;
              color: #fff;
              font-size: 12px;
              position: absolute;
              border-radius: 20px;
              line-height: 18px;
              display: inline-block;
              background: #fe6868;
            }
          }

          .type {
            font-size: 12px;
            color: #333;
          }
        }
      }
    }

    .group-wrap {
      background: #fff;
      margin-bottom: 10px;
      border-radius: 6px;
    }

    .group-head {
      padding: 15px;

      .group-name {
        font-size: 16px;
        color: #000;
      }

      .open-icon {
        font-size: 14px;
        color: #a9a9a9;
      }

      .open-status {
        transform: rotate(180deg);
      }
    }

    .list-content {
      padding: 15px 0px 10px;
      position: relative;
      text-align: left;

      &::before {
        content: "";
        width: 200%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        border-top: 1px solid #e5e5e5;
        transform: scale(0.5);
        transform-origin: 0 0;
      }
    }

    .list-item {
      width: 100%;
      border-radius: 4px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      background: #fff;
      margin-bottom: 10px;

      .icon-img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        background: #eee;
      }

      .name {
        color: #686868;
        font-size: 12px;
        margin-top: 5px;
        text-align: center;
        padding: 0 5px;
      }
    }
  }
</style>