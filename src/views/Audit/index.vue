<template>
  <div class="page-wrap" v-if="state.showPage">
    <div class="head">
      <div class="title">{{state.detailInfo.model_name}}</div>
      <div class="status" :style="{color: state.detailInfo.audit_status ===2 ? '#67C23A':'#ffa114'}">
        {{state.detailInfo.audit_status_msg}}
      </div>
      <i class="iconfont icon-yitongguo1 audit-status-icon pass-icon-color"
        v-if="state.detailInfo.audit_status === 2"></i>
      <i class="iconfont icon-yijujue3 audit-status-icon refuse-icon-color"
        v-if="state.detailInfo.audit_status === 3"></i>
    </div>

    <div class="flow-info">
      <div class="detail-info">
        <div class="subitem" v-if="state.detailInfo.cancel_remark">
          <div class="tit-label">已撤销</div>
          <div>{{state.detailInfo.cancel_remark}}</div>
        </div>
        <div class="subitem">
          <div class="tit-label">审批编号</div>
          <div>{{state.detailInfo.audit_sn}}</div>
        </div>
        <div class="subitem">
          <div class="tit-label">所在部门</div>
          <div>{{state.detailInfo.department_name}} {{state.detailInfo.city ? `(${state.detailInfo.city})`: ''}}</div>
        </div>
        <!-- 组件内容 -->
        <div class="subitem module-wrap" v-for="(item,index) in state.detailInfo.content_list" :key="index">
          <div v-if="item.permission != 3">
            <!-- 1、单行输入框 -->
            <component :is="CurrentCompoent['single_input']" v-if="item.key ==='single_input'" :item="item"
              :applyAdjust="state.detailInfo.apply_adjust"></component>
          </div>
        </div>
      </div>
    </div>

    <!-- 审批人内容 -->
    <div class="flow-progress">
      <div v-for="(item,index) in state.detailInfo.process_list" :key="index">
        <div class="flow-item" v-if="item.type !== 3">
          <div class="flow-slider">
            <div class="avatar-badge">
              <span class="user-icon">
                <span v-if="item.user_name">
                  {{substringName(item.user_name)}}
                </span>
                <i v-else class="iconfont icon-users" style="font-size: 24px;"></i>
              </span>
              <span class="status-icon">
                <i class="iconfont icon-3 unfinished" v-if="item.status === 0||item.status === 1"></i>
                <i class="iconfont icon-xuanzhong pass-icon" v-if="item.status === 2||item.status === 4"></i>
                <i class="iconfont icon-guanbi11 refuse-icon" v-if="item.status === 3"></i>
              </span>
            </div>
            <div class="norem-line" :class="item.status === 2 ? '':'norem-dotted-line'"
              v-if="state.detailInfo.process_list.length - 1 > index"></div>
          </div>

          <div class="flow-content">
            <div class="df-bt">
              <div class="tit">
                <span v-if="item.type === 1">发起申请</span>
                <span v-if="item.type === 2">审批人</span>
                <span v-if="item.type === 3">抄送人</span>
                <span v-if="item.type === 6">办理人</span>
              </div>
              <div class="date" v-if="item.time">
                {{auditDateFormat(item.time)}}
              </div>
            </div>
            <div v-if="item.user && item.user.length > 0">
              <div class="name">
                <!--会签2， 或签3 -->
                <span>{{item.user.length}}人</span>
                <span v-if="item.audit_mode === 2">会签</span>
                <span v-if="item.audit_mode === 3">或签</span>
                <span v-if="item.status_msg">（{{item.status_msg}}）</span>
              </div>
              <div class="receiver-info">
                <div class="receiver-info__item" v-for="(j,i) in item.user" :key="i" v-if="i < 3">
                  <span class="receiver-user-icon">{{ substringName(j.user_name)}}</span>
                  <p class="name">{{j.user_name}}</p>
                </div>

                <div class="receiver-info__item" v-if="item.user.length > 3" @click="viewAllUserInfo(item)">
                  <span class="receiver-user-icon">
                    <i class="iconfont icon-users" style="font-size: 22px;"></i>
                  </span>
                  <p class="name">查看全部</p>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="name">{{item.user_name}} <span v-if="item.status_msg">({{item.status_msg}})</span></div>
              <div class="desc">{{item.audit_context}}</div>
            </div>
          </div>
        </div>

        <!-- 抄送人  -->
        <div class="flow-item" v-if="item.type === 3">
          <div class="flow-slider">
            <div class="avatar-badge">
              <span class="user-icon">
                <i class="iconfont icon-laba" style="font-size: 24px;"></i>
              </span>
              <span class="status-icon">
                <i class="iconfont icon-3 unfinished" v-if="item.status === 0||item.status === 1"></i>
                <i class="iconfont icon-xuanzhong pass-icon" v-if="item.status === 2||item.status === 4"></i>
                <i class="iconfont icon-guanbi11 refuse-icon" v-if="item.status === 3"></i>
              </span>
            </div>
            <div class="line" :class="item.status === 2 ? '':'dotted-line'"
              v-if="state.detailInfo.process_list.length - 1 > index"></div>
          </div>

          <div class="flow-content">
            <div class="df-bt">
              <div class="tit">
                <span>抄送{{item.count}}人</span>
              </div>
              <div class="date" v-if="item.time">
                {{auditDateFormat(item.time)}}
              </div>
            </div>
            <div class="receiver-info">
              <div class="receiver-info__item" v-for="(j,i) in item.user" :key="i" v-if="i < 3">
                <span class="receiver-user-icon">
                  {{substringName(j.user_name)}}
                  <span class="status-icon" v-if="item.status === 2">
                    <i class="iconfont icon-xuanzhong"></i>
                  </span>
                </span>
                <p class="name">{{j.user_name}}</p>
              </div>
              <div class="receiver-info__item" v-if="item.user.length > 3" @click="viewAllUserInfo(item)">
                <span class="receiver-user-icon">
                  <i class="iconfont icon-users" style="font-size: 22px;"></i>
                </span>
                <p class="name">查看全部</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交审批 -->
    <!-- detailInfo.audit_status != 4 && -->
    <div class="footer-box" v-if="state.isAuthority">
      <div class="more-operate">
        <div class=" df-left">
          <div class="subitem-type" v-if="state.detailInfo.audit_status == 2 || state.detailInfo.audit_status == 3"
            @click="handleExportPDF">
            <div class="more-icon">
              <i class="iconfont icon-dayin2"></i>
            </div>
            <p class="tit">打印</p>
          </div>
          <div class="subitem-type" v-if="state.detailInfo.is_initiator" @click="handleCancel">
            <div class="more-icon">
              <i class="iconfont icon-chexiao"></i>
            </div>
            <p class="tit">撤销</p>
          </div>
          <div class="subitem-type" @click="state.showPopper = !state.showPopper"
            v-if="state.detailInfo.is_distribute || state.detailInfo.is_create">
            <div>
              <div class="more-icon">
                <i class="iconfont icon-gengduo"></i>
              </div>
              <p class="tit">更多</p>
            </div>
            <div class="poptip-popper"
              v-if="(state.detailInfo.is_distribute|| state.detailInfo.is_create) && state.showPopper">
              <div class="poptip-content">
                <div class="ivu-poptip-arrow"></div>
                <div class="poptip-inner">
                  <!--细线类名 thinline -->
                  <div class="menu-item" v-if="state.detailInfo.is_distribute" @click="selectTransfer">转交
                  </div>
                  <div class="menu-item" v-if="state.detailInfo.is_create" @click="newCreateModule">新建</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="confirm-button" v-if="state.detailInfo.is_confirm">
        <span class="button refuse-btn" @click="submitAudit(2)">拒绝</span>
        <span class="button agree-btn" @click="submitAudit(1)">同意</span>
      </div>
      <div class="confirm-button" v-if="state.detailInfo.is_transaction">
        <span class="button refuse-btn" @click="submitStorageFlow">暂存</span>
        <span class="button agree-btn" @click="submitTransaction">提交</span>
      </div>
    </div>

    <div style="top: 0;left: 0;position:fixed;width: 100%;height: 100%;z-index: 99;background-color: #fff;"
      v-if="state.showDownloadTips" @click="state.showDownloadTips = false">
      <img :src="TipsImage" alt="" style="width: 100%;">
    </div>
  </div>
</template>

<script lang="ts" setup>
  import * as dd from "dingtalk-jsapi";
  import TipsImage from "@/assets/images/downloadFileTips.png";
  import { reactive, computed, ref, watch, onMounted, getCurrentInstance, markRaw, defineAsyncComponent } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from 'vue-router'
  import { Toast } from 'vant'
  const CurrentCompoent = reactive({
    'single_input': markRaw(defineAsyncComponent(() => import('./module-unit/single-input'))),
  })

  const { ctx, proxy: { $http, $util } } = getCurrentInstance()
  const router = useRouter();
  const store = useStore()
  let routeInfo = useRouter().currentRoute.value.query

  let state = reactive({
    TipsImage,
    showPage: false,
    showPopper: false,
    viewTableVisible: false,
    showDownloadTips: false, //下载附件时提示
    showSelectCity: false, //选择城市
    auditFormPopupVisible: false, //关联审批单
    signPopupVisible: false, //签名弹出窗口
    radioSelectVisible: false, //单选框
    checkSelectVisible: false, //多选框
    citySelectVisible: false, //城市选择弹出窗口
    departmentSelectVisible: false, //部门选择弹出窗口
    citySelectedResult: null,
    openDateType: "", //选择日期类型
    baseUrl: JSON.parse(localStorage.getItem("ENV_HTTP")),
    datePickerValue: $util.dateFormat(new Date(), "yyyy-MM-dd"), //日期
    detailId: '',
    currentUploadType: '', //上传类型
    detailInfo: {},
    curSelectViewData: {}, //编辑内容
    currentTableRowData: {},
    currentTableRowIndex: 0,
    currentFlowItem: null, //审批流程人员数据
    flowUserPopupVisible: false, //审批流程查看全部
  });
  state.isAuthority = computed(() => {
    let status = state.detailInfo.process_list.map(j => j.user_id).includes(state.detailInfo.user);
    return status
  })
  onMounted(async () => {
    document.title = "详情";
    getHandleInfo();
  })

  const auditDateFormat = (time) => {
    return time.substr(0, 16)
  }
  /**
   * 处理名字显示
  */
  const substringName = (name) => {
    return $util.substringName(name)
  }
  /**
   * 获取数据内容
   * */
  const getHandleInfo = async () => {
    $http.handleDetail({
      id: routeInfo.id
    }).then(res => {
      if (res.status === "ok") {
        state.detailInfo = res.data;
      } else {
        Toast(res.message)
      }
      state.showPage = true;
    }).catch(error => {
      console.log(error);
    });
  }
  // import vueArea from '@/components/city-picker';
  // import ESign from "@/components/edit-dialog/esign.vue";
  // import SelectRadio from "@/components/edit-dialog/radio.vue";
  // import SelectCheck from "@/components/edit-dialog/checklist.vue";
  // import SelectCity from "@/components/edit-dialog/selectCity.vue";
  // import SelectDepartment from "@/components/edit-dialog/selectDepartment.vue";
  // import UploadBox from "@/components/upload/index.vue";
  // import auditForm from "@/components/edit-dialog/auditForm.vue";
  // import FlowUser from "./dialog/flowUserList.vue";
  // import TipsImage from "@/assets/images/downloadFileTips.png";
  // import FlowNode from './module-unit/index.vue'

  // filters: { 
  //   computed: {
  //     isAuthority() {
  //       let status = this.detailInfo.process_list.map(j => j.user_id).includes(this.detailInfo.user);
  //       return status;
  //     }
  //   }, 
</script>

<style lang="scss" scoped>
  @import "styles/popup-table-edit.scss";
  @import "styles/index.scss";
</style>