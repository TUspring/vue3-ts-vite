<template>
  <div class="page-wrap">
    <div class="filter-box df-bt">
      <div class="input-box">
        <i class="iconfont icon-sousuo search-icon" @click="getListInfo"></i>
        <input type="text" placeholder="搜索标题、编号、正文内容" v-model="state.keyword">
      </div>
      <div class="fitler-type">
        <div class="operate-button" @click="state.filterVisible = true">
          <i class="iconfont icon-shaixuan icon"></i>
          <span class="name">筛选</span>
        </div>
        <div class="operate-button" @click="exportData" v-if="routeInfo.key === 'all'">
          <i class="iconfont icon-wenjiandaochushujudaochu"></i>
          <span class="name">导出</span>
        </div>
      </div>
    </div>

    <!-- v-infinite-scroll="getListInfo" infinite-scroll-disabled="listLoading"
      infinite-scroll-distance="50" -->
    <van-pull-refresh v-model="state.listLoading" @refresh="getListInfo">
      <div class="approval-wrap">
        <div class="approval-list" v-for="(item,index) in state.listData" :key="index" @click="navigateTo(item)">
          <div class="head df-bt">
            <div class="title">{{item.model_name}}</div>
            <div class="date">{{item.create_time}}</div>
          </div>
          <div class>
            <p class="flow-content" v-if="item.abstract" v-html="item.abstract"></p>
          </div>
          <div class="audit-info df-bt">
            <div class="df-left">
              <span class="user-icon">{{ substringName(item.user_name) }}</span>
              <span>由{{item.user_name}}提交</span>
            </div>
            <div class="approval-status">
              <span class="status pass-status" v-if="item.audit_status ===2">{{item.audit_status_msg}}</span>
              <span class="status refuse-status" v-else-if="item.audit_status ===3">{{item.audit_status_msg}}</span>
              <span class="status" v-else-if="item.audit_status ===4">{{item.audit_status_msg}}</span>
              <span v-else>{{item.audit_user_name}}处理中</span>
            </div>
          </div>
        </div>

        <div v-if="state.listData.length === 0 && state.loaded" class="no-data-tips">
          <p>
            <i class="iconfont icon-wushuju no-result"></i>
          </p>
          <p>没找到相关记录！</p>
        </div>
      </div>
    </van-pull-refresh>
    <div class="no-more" v-if="state.isListEnd && state.listData.length !== 0">没有更多了~</div>

    <!-- 筛选窗口 -->
    <van-popup v-model:show="state.filterVisible" position="bottom" style="width: 100%;">
      <filter-box v-if="state.filterVisible" :listType="routeInfo.type" :initData="state.initData"
        :searchForm="state.searchForm" @selectCallback="selectCallback" @close="state.filterVisible =false">
      </filter-box>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch, onMounted, getCurrentInstance, } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from 'vue-router'
  import FilterBox from "./dialog/filter-box.vue";
  import { Toast } from 'vant'
  const { ctx, proxy: { $http, $util } } = getCurrentInstance()
  const router = useRouter();
  const store = useStore()

  let routeInfo = useRouter().currentRoute?.value?.query
  let state = reactive({
    baseUrl: JSON.parse(localStorage.getItem("ENV_HTTP")),
    isListEnd: false,
    listLoading: false,
    timer: null,
    keyword: '',
    searchForm: {
      group_id: '',
      status: ''
    },
    pageInfo: {
      page: 0,
      limits: 20,
    },
    listTotalCount: 1,
    filterVisible: false,
    loaded: false,
    listData: [],
    initData: [],
  });
  watch(() => state.keyword, () => {
    state.isListEnd = false;
    state.loaded = false;
    state.listTotalCount = 1;
    httpSearchSubmit()
  })
  onMounted(async () => {
    let param = JSON.parse(sessionStorage.getItem('flowListFilterParam'));
    if (param) {
      state.searchForm.group_id = param.group_id;
      state.searchForm.status = param.status;
    }
    getListInfo();
  })
  const selectCallback = ({ group_id, status }) => {
    state.searchForm.group_id = group_id;
    state.searchForm.status = status;
    state.pageInfo.page = 0;
    state.listData = []
    state.loaded = false;
    getListInfo();
  }

  /**
   * 处理名字显示
  */
  const substringName = (name) => {
    return $util.substringName(name)
  }

  const exportData = () => {
    let param = {
      export: 1,
      page: this.pageInfo.page,
      limits: this.pageInfo.limits,
      keyword: this.keyword,
      type: this.queryInfo.type,
      group_id: this.searchForm.group_id,
      status: this.searchForm.status == 0 ? '' : this.searchForm.status
    }
    this.$http.allFlowList(param).then(res => {
      if (res.status === "ok") {
        const a = document.createElement('a'); // 创建a标签
        a.setAttribute('href', `${this.baseUrl}${res.data}`);// href链接
        a.click();// 自执行点击事件
      } else {
        Toast(res.message)
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const navigateTo = (item) => {
    router.push({
      path: '/flowDetail',
      query: item
    })
    store.commit('storageFlowDetail', item)
  }
  /**
   * 获取数据内容
   * */
  const getListInfo = async () => {
    let httpType = '';
    switch (routeInfo.key) {
      case 'all':
        httpType = 'allFlowList'; // 全部
        break;
      case 'handle':
        httpType = 'flowHandleList'; // 处理
        break;
      case 'submit':
        httpType = 'submitList'; // 发起列表
        break;
      default: httpType = 'carbonList';
    }
    state.pageInfo.page = state.pageInfo.page + 1;
    if (state.listData.length >= state.listTotalCount) {
      state.isListEnd = true;
      return false;
    } else {
      state.listLoading = true;
      $http[httpType]({
        page: state.pageInfo.page,
        limits: state.pageInfo.limits,
        keyword: state.keyword,
        type: routeInfo.type,
        group_id: state.searchForm.group_id,
        status: state.searchForm.status == 0 ? '' : state.searchForm.status
      }).then(res => {
        if (res.status === "ok") {
          state.listData = state.listData.concat(res.data.list);
          state.initData = res.data.group_list;
          state.listTotalCount = res.data.total;
          state.listLoading = false;
        } else {
          Toast(res.message)
        }
        state.loaded = true;
      }).catch(error => {
        console.log(error);
      });
    }
  }

  /**
   * 搜索
   * 函数节流处理
  */
  function httpSearchSubmit() {
    clearInterval(state.timer)
    state.timer = setTimeout(() => {
      state.listData = []
      state.pageInfo.page = 0;
      getListInfo();
    }, 800)
  }

  // export default {
  //   beforeRouteLeave(to, from, next) {
  //     if (to.name == 'flowDetail') {
  //       sessionStorage.setItem('flowListFilterParam', JSON.stringify({
  //         group_id: this.searchForm.group_id,
  //         status: this.searchForm.status,
  //       }))
  //     } else {
  //       sessionStorage.removeItem('flowListFilterParam')
  //     }
  //     next()
  //   }
  // };
</script>

<style lang="scss" scoped>
  .page-wrap {
    width: 100%;
    min-height: 100%;
    font-size: 14px;
    padding: 66px 0 20px;
    background: #f8f8f8;

    .filter-box {
      background: #fff;
      padding: 0 15px;
      margin-bottom: 10px;
      height: 56px;
      width: 100%;
      top: 0px;
      left: 0px;
      position: fixed;
      z-index: 9;

      .input-box {
        /* width: 75%; */
        height: 36px;
        line-height: 36px;
        position: relative;
        flex: 1;

        .search-icon {
          top: 0px;
          left: 14px;
          font-size: 18px;
          color: #666;
          position: absolute;
        }

        input {
          width: 100%;
          height: 100%;
          line-height: 36px;
          background: #f5f5f5;
          padding: 0 10px 0 40px;
          border-radius: 20px;

          &::placeholder {
            color: #b9b9b9;
          }
        }
      }

      .fitler-type {
        display: flex;
        justify-content: flex-end;

        .operate-button {
          padding: 0 8px;
          height: 30px;
          line-height: 30px;
          border-radius: 20px;
          text-align: center;
          border: 1px solid #dcdee2;
          display: inline-block;
          margin-left: 8px;
          color: #515a6e;
          flex-shrink: 0;

          /* flex: 1; */
          .icon {
            margin-right: 3px;
          }

          /* .name{
            flex: 1;
          } */
        }
      }
    }

    .approval-wrap {
      padding: 0 12px;
    }

    .approval-list {
      border-radius: 5px;
      background: #fff;
      padding: 10px 12px;
      margin-bottom: 10px;

      .head {
        margin-bottom: 5px;

        .title {
          font-size: 16px;
          color: #111;
        }

        .date {
          color: #b1b1b1;
          font-size: 12px;
        }
      }

      .flow-content {
        font-size: 14px;
        line-height: 24px;
        color: #898989;
        white-space: pre-wrap;
      }

      .audit-info {
        margin-top: 10px;

        .user-icon {
          width: 28px;
          height: 28px;
          line-height: 30px;
          font-size: 10px;
          color: #fff;
          text-align: center;
          display: inline-block;
          background: #26a2ff;
          border-radius: 50%;
          margin-right: 8px;
        }

        .approval-status {
          color: #faa114;
          font-size: 14px;

          .status {
            color: #9a9696;
            font-size: 10px;
            padding: 0px 3px;
            border-radius: 4px;
            display: inline-block;
            border: 1px solid #e9e8e9;
          }

          .pass-status {
            color: #67C23A;
            background: #67c23a12;
          }

          .refuse-status {
            color: #F56C6C;
            background: #f56c6c12;
          }
        }
      }
    }

    .no-more {
      color: #9e9e9e;
      font-size: 14px;
      text-align: center;
      line-height: 36px;
    }

    .no-data-tips {
      text-align: center;
      margin-top: 50px;
      color: #888;

      i {
        font-size: 60px;
        color: #b5b5b5;
      }
    }
  }
</style>