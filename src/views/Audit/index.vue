<template>
  <div class="page-wrap" v-if="showPage">
    <div class="head">
      <div class="title">{{detailInfo.model_name}}</div>
      <div class="status" :style="{color: detailInfo.audit_status ===2 ? '#67C23A':'#ffa114'}">
        {{detailInfo.audit_status_msg}}
      </div>
      <i class="iconfont icon-yitongguo1 audit-status-icon pass-icon-color" v-if="detailInfo.audit_status === 2"></i>
      <i class="iconfont icon-yijujue3 audit-status-icon refuse-icon-color" v-if="detailInfo.audit_status === 3"></i>
    </div>

    <div class="flow-info">
      <div class="detail-info">
        <div class="subitem" v-if="detailInfo.cancel_remark">
          <div class="tit-label">已撤销</div>
          <div>{{detailInfo.cancel_remark}}</div>
        </div>
        <div class="subitem">
          <div class="tit-label">审批编号</div>
          <div>{{detailInfo.audit_sn}}</div>
        </div>
        <div class="subitem">
          <div class="tit-label">所在部门</div>
          <div>{{detailInfo.department_name}} {{detailInfo.city ? `(${detailInfo.city})`: ''}}</div>
        </div>
        <!-- 组件内容 -->
        <div class="subitem module-wrap" v-for="(item,index) in detailInfo.content_list" v-if="item.permission != 3">
          <!-- permission: 3 为对办理隐藏, 2为只读，1为可编辑 -->
          <FlowNode :item="item" :detailInfo="detailInfo" :applyAdjust="detailInfo.apply_adjust" :key="item.key" @showSelectPopup="showSelectPopup"
            @showSelectCityPopup="showSelectCityPopup" @bindAuditForm="bindAuditForm" @showDateSelect="showDateSelect"
            @showSignPopup="showSignPopup" 
            @handleDownloadTips="handleDownloadTips">
          </FlowNode>

          <!--表单 -->
          <div v-if="item.key === 'table'">
            <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
            <!--列表模式 -->
            <div class="table-content" v-if="item.data.way == '1'">
              <div v-for="(list, index) in item.value" :key="index">
                <div class="table-head">{{item.name}}{{item.value.length > 0 ? `(${index + 1})`:''}}</div>

                <!-- 组件内容 -->
                <div class="subitem module-wrap row-info" v-for="(item,index) in list" v-if="item.permission != 3">
                  <!-- permission: 3 为对办理隐藏, 2为只读，1为可编辑 -->
                  <FlowNode :item="item" :detailInfo="detailInfo" :key="item.key" @showSelectPopup="showSelectPopup"
                    @showSelectCityPopup="showSelectCityPopup" @bindAuditForm="bindAuditForm"
                    @showDateSelect="showDateSelect" @showSignPopup="showSignPopup">
                  </FlowNode>
                </div>
              </div>

              <!-- 合计项  如果表单勾选了统计总数时显示-->
              <div v-if="item.statistics && item.statistics.length > 0">
                <div class="table-head">合计</div>
                <p class="table-list__total" v-for="(obj, index) in item.statistics" :key="index" v-if="obj.statistics">
                  <span class="title" v-if="obj.data.title">总{{obj.data.title}}：</span>
                  <span class="count">{{obj.data.value}}</span>
                </p>
              </div>
            </div>
            <!--表格模式 -->
            <div class="table-content" v-if="item.data.way == '2'">
              <div class="table-type-wrap">
                <div class="wrap-container">
                  <div class="table-left__index">
                    <div class="index-item empty-index"></div>
                    <div class="index-item index-item__line" v-for="(list, index) in item.value" :key="index">
                      {{index + 1}}</div>
                    <div class="index-item" v-if="item.statistics && item.statistics.length > 0"
                      style="font-size: 12px;">
                      合计</div>
                  </div>
                  <div class="table-body">
                    <div class="table-body__scroll">
                      <div class="table-head">
                        <ul class="row-ul">
                          <li class="table-head-li" v-for="(li, i) in item.value[0]" :key="i">
                            <div class="head-name">{{li.name}}</div>
                          </li>
                        </ul>
                      </div>
                      <div v-for="(row, index) in item.value" :key="index" v-if="item.value.length > 0"
                        @click="handleClickTableRow(row, index)">
                        <ul class="row-ul">
                          <li class="row-li__line" v-for="(li, i) in row" :key="i">
                            <div class="row-li__content">
                              <!-- 外部联系人、联系人、部门 -->
                              <div class="value"
                                v-if="li.key === 'external_contact' ||li.key === 'contact'||li.key === 'department'">
                                <span v-if="li.value">{{li.value.map(j => j.name).join('，')}}</span>
                              </div>
                              <!-- 图片、附件 -->
                              <div class="value" v-else-if="li.key === 'picture' || li.key === 'attachment'">
                                <div v-for="(file,index) in li.value" :key="index">
                                  <span>{{file.substring(file.lastIndexOf('/') + 1)}}</span>
                                </div>
                              </div>
                              <!-- 说明文字 -->
                              <div class="value" v-else-if="li.key === 'explain'">
                                <a :href="item.value.link ? item.value.link: 'javascript:;'" v-if="!item.value.show">
                                  <p :style="{'white-space': 'pre-wrap', color: item.value.text_color ? item.value.text_color:'#969696'}"
                                    v-html="item.value.explain"></p>
                                </a>
                              </div>
                              <!-- 关联审批单 -->
                              <div class="value" v-else-if="li.key === 'relation_authorization'">
                                <i class="iconfont icon-guanlian" style="font-size: 14px;"></i>
                                <span v-if="li && li.value">{{li.value.length}}</span>
                              </div>
                              <!-- 省市区 -->
                              <div class="value" v-else-if="li.key === 'province'">
                                <span>{{li.value.area}}</span>
                              </div>
                              <!-- 金额 -->
                              <div class="value" v-else-if="li.key === 'money'">
                                <span>{{li.value | formatNumber}}</span>
                              </div>

                              <div class="value" v-else>
                                <span v-if="Object.prototype.toString.call(li.value) === '[object Array]'">
                                  {{li.value.join('，')}}
                                </span>
                                <span v-else>{{li.value}}</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <!-- 合计 -->
                      <div v-if="item.statistics && item.statistics.length > 0">
                        <ul class="row-ul">
                          <li v-for="(li, index) in item.statistics" :key="index">
                            <div style="text-align: center;width: 100%;">
                              <span v-if="Object.prototype.toString.call(li.data.value) === '[object Array]'">
                                {{li.data.value.join('，')}}
                              </span>
                              <span v-else>{{li.data.value}}</span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="empty-list" v-if="item.value.length === 0">1</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 审批人内容 -->
    <div class="flow-progress">
      <div v-for="(item,index) in detailInfo.process_list" :key="index">
        <div class="flow-item" v-if="item.type !== 3">
          <div class="flow-slider">
            <div class="avatar-badge">
              <span class="user-icon">
                <span v-if="item.user_name">{{item.user_name |substringName}}</span>
                <i v-else class="iconfont icon-users" style="font-size: 24px;"></i>
              </span>
              <span class="status-icon">
                <i class="iconfont icon-3 unfinished" v-if="item.status === 0||item.status === 1"></i>
                <i class="iconfont icon-xuanzhong pass-icon" v-if="item.status === 2||item.status === 4"></i>
                <i class="iconfont icon-guanbi11 refuse-icon" v-if="item.status === 3"></i>
              </span>
            </div>
            <div class="line" :class="item.status === 2 ? '':'dotted-line'"
              v-if="detailInfo.process_list.length - 1 > index"></div>
          </div>

          <div class="flow-content">
            <div class="df-bt">
              <div class="tit">
                <span v-if="item.type === 1">发起申请</span>
                <span v-if="item.type === 2">审批人</span>
                <span v-if="item.type === 3">抄送人</span>
                <span v-if="item.type === 6">办理人</span>
              </div>
              <div class="date" v-if="item.time">{{item.time |auditDateFormat}}</div>
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
                  <span class="receiver-user-icon">{{ j.user_name |substringName}}</span>
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
              v-if="detailInfo.process_list.length - 1 > index"></div>
          </div>

          <div class="flow-content">
            <div class="df-bt">
              <div class="tit">
                <span>抄送{{item.count}}人</span>
              </div>
              <div class="date" v-if="item.time">{{item.time |auditDateFormat}}</div>
            </div>
            <div class="receiver-info">
              <div class="receiver-info__item" v-for="(j,i) in item.user" :key="i" v-if="i < 3">
                <span class="receiver-user-icon">{{ j.user_name |substringName}}
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
    <div class="footer-box" v-if="isAuthority">
      <div class="more-operate">
        <div class=" df-left">
          <div class="subitem-type" v-if="detailInfo.audit_status == 2 || detailInfo.audit_status == 3"
            @click="handleExportPDF">
            <div class="more-icon">
              <i class="iconfont icon-dayin2"></i>
            </div>
            <p class="tit">打印</p>
          </div>
          <div class="subitem-type" v-if="detailInfo.is_initiator" @click="handleCancel">
            <div class="more-icon">
              <i class="iconfont icon-chexiao"></i>
            </div>
            <p class="tit">撤销</p>
          </div>
          <div class="subitem-type" @click="showPopper = !showPopper" v-if="detailInfo.is_distribute || detailInfo.is_create">
            <div>
              <div class="more-icon">
                <i class="iconfont icon-gengduo"></i>
              </div>
              <p class="tit">更多</p>
            </div>
            <div class="poptip-popper" v-if="(detailInfo.is_distribute|| detailInfo.is_create) && showPopper">
              <div class="poptip-content">
                <div class="ivu-poptip-arrow"></div>
                <div class="poptip-inner">
                  <!--细线类名 thinline -->
                  <div class="menu-item" v-if="detailInfo.is_distribute" @click="selectTransfer">转交
                  </div>
                  <div class="menu-item" v-if="detailInfo.is_create" @click="newCreateModule">新建</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="confirm-button" v-if="detailInfo.is_confirm">
        <span class="button refuse-btn" @click="submitAudit(2)">拒绝</span>
        <span class="button agree-btn" @click="submitAudit(1)">同意</span>
      </div>
      <div class="confirm-button" v-if="detailInfo.is_transaction">
        <span class="button refuse-btn" @click="submitStorageFlow">暂存</span>
        <span class="button agree-btn" @click="submitTransaction">提交</span>
      </div>
    </div>
    <!-- 查看表格表单 -->
    <mt-popup v-model="viewTableVisible" position="bottom" style="width: 100%;">
      <template v-if="viewTableVisible">
        <div class="popup-box">
          <div class="popup-box__head">
            <div class="close-popup" @click="closeTableFormPopup">
              <i class="iconfont icon-xiala"></i>
            </div>
            <div class="title">明细/表格</div>
          </div>
          <div class="info-tips">
            当前查看的是第 {{currentTableRowIndex+1}} 行
          </div>

          <div class="table-info" style="padding-bottom: 100px;max-height: 450px;overflow: auto;">
            <!-- 组件内容 -->
            <div class="subitem module-wrap" v-for="(item, index) in currentTableRowData" :key="index"
              v-if="item.permission != 3">
              <!-- permission: 3 为对办理隐藏, 2为只读，1为可编辑 -->
              <FlowNode :item="item" :detailInfo="detailInfo" :key="item.key" @showSelectPopup="showSelectPopup"
                @showSelectCityPopup="showSelectCityPopup" @bindAuditForm="bindAuditForm"
                @showDateSelect="showDateSelect" @showSignPopup="showSignPopup">
              </FlowNode>
            </div>
          </div>
        </div>
      </template>
    </mt-popup>
    <!-- 签名窗口 -->
    <mt-popup v-model="signPopupVisible" position="bottom" style="width: 100%;height: 100%;">
      <e-sign @esignCallback="signResult" @close="signPopupVisible =false" v-if="signPopupVisible"></e-sign>
    </mt-popup>
    <!-- 单选窗口 -->
    <mt-popup v-model="radioSelectVisible" position="bottom" style="width: 100%;">
      <select-radio v-if="radioSelectVisible" :initData="curSelectViewData" @selectCallback="selectCallback"
        @close="radioSelectVisible =false"></select-radio>
    </mt-popup>

    <!-- 多选窗口 -->
    <mt-popup v-model="checkSelectVisible" position="bottom" style="width: 100%;">
      <select-check v-if="checkSelectVisible" :initData="curSelectViewData" @selectCallback="selectCallback"
        @close="checkSelectVisible =false"></select-check>
    </mt-popup>

    <!-- 城市选择窗口 -->
    <mt-popup v-model="citySelectVisible" position="bottom" style="width: 100%;">
      <select-city v-if="citySelectVisible" :initData="curSelectViewData" @selectCallback="selectCallback"
        @close="citySelectVisible =false"></select-city>
    </mt-popup>


    <!-- 部门选择窗口 -->
    <mt-popup v-model="departmentSelectVisible" position="bottom" style="width: 100%;">
      <select-department v-if="departmentSelectVisible" :initData="curSelectViewData" @selectCallback="selectCallback"
        @close="departmentSelectVisible =false"></select-department>
    </mt-popup>

    <!-- 日期 年月日date  年月日时分datetime-->
    <mt-datetime-picker ref="picker" style="z-index: 2500;" :type="curSelectViewData.data 
         &&curSelectViewData.data.date_type
         && curSelectViewData.data.date_type == '1' ? 'datetime':'date'" v-model="datePickerValue"
      @confirm="handleDateConfirm" :start-date="new Date('1978-01-01')" :end-date="new Date('2050-01-01')">
    </mt-datetime-picker>

    <!-- 关联工作单 -->
    <mt-popup v-model="auditFormPopupVisible" position="bottom" style="width: 100%;height: 80%;">
      <audit-form v-if="auditFormPopupVisible" :initData="curSelectViewData" @callback="selectAuditFormCallback">
      </audit-form>
    </mt-popup>

    <!-- 查看审批流程全部人员窗口 -->
    <mt-popup v-model="flowUserPopupVisible" position="bottom" style="width: 100%;">
      <flow-user v-if="flowUserPopupVisible" :dataInfo="currentFlowItem"></flow-user>
    </mt-popup>

    <!-- 城市级联 address_type == 3表示省市项；1：为二级联动，2为三级联动-->
    <vue-area v-if="showSelectCity" :level="curSelectViewData.data.address_type == 3 ? 1: 2"
      :props-show="showSelectCity" v-on:result="areaResult"></vue-area>

    <div style="top: 0;left: 0;position:fixed;width: 100%;height: 100%;z-index: 99;background-color: #fff;"
      v-if="showDownloadTips" @click="showDownloadTips = false">
      <img :src="TipsImage" alt="" style="width: 100%;">
    </div>
  </div>
</template>

<script>
  // import { Indicator, Toast, Popup, Button, DatetimePicker, MessageBox, Lazyload } from "mint-ui";
  import vueArea from '@/components/city-picker';
  import ESign from "@/components/edit-dialog/esign.vue";
  import SelectRadio from "@/components/edit-dialog/radio.vue";
  import SelectCheck from "@/components/edit-dialog/checklist.vue";
  import SelectCity from "@/components/edit-dialog/selectCity.vue";
  import SelectDepartment from "@/components/edit-dialog/selectDepartment.vue";
  import UploadBox from "@/components/upload/index.vue";
  import auditForm from "@/components/edit-dialog/auditForm.vue";
  import FlowUser from "./dialog/flowUserList.vue";
  import TipsImage from "@/assets/images/downloadFileTips.png";
  import FlowNode from './module-unit/index.vue'
  import * as dd from "dingtalk-jsapi";
  export default {
    components: {
      ESign,
      SelectRadio,
      SelectCheck,
      SelectCity,
      SelectDepartment,
      UploadBox,
      auditForm,
      FlowUser,
      vueArea,
      FlowNode
    },
    data() {
      return {
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
        datePickerValue: new Date().format("yyyy-MM-dd"), //日期
        detailId: '',
        currentUploadType: '', //上传类型
        detailInfo: {},
        curSelectViewData: {}, //编辑内容
        currentTableRowData: {},
        currentTableRowIndex: 0,
        currentFlowItem: null, //审批流程人员数据
        flowUserPopupVisible: false, //审批流程查看全部
      };
    },
    watch: {
      '$route.query.id'() {
        this.detailId = this.$route.query.id;
        this.getHandleInfo();
      },
      showDownloadTips() {
        if (!this.showDownloadTips) {
          dd.biz.navigation.setRight({
            show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
            control: false,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) { },
            onFail: function (err) { }
          });
        }
      }
    },
    filters: {
      auditDateFormat(time) {
        // let date = new Date(new Date(time).getTime()).format('yyyy-MM-dd hh:mm');
        return time.substr(0, 16)
      },
    },
    computed: {
      isAuthority() {
        let status = this.detailInfo.process_list.map(j => j.user_id).includes(this.detailInfo.user);
        return status;
      }
    },
    created() {
      document.title = "详情";
      this.detailId = this.$route.query.id;
      this.getHandleInfo();
    },
    methods: {
      navigateTo(item) {
        this.viewTableVisible = false;
        this.$router.push({
          path: `/flowDetail?id=${item.id}`,
          query: item
        })
      },
      newCreateModule(){
        this.$router.push({
          path: `/moduleDetail?id=${this.detailInfo.model_data.id}&modify_audit_id=${this.detailInfo.id}`,
        })
      },
      handleDownloadTips(status){
        this.showDownloadTips = status;
      },
      previewFile(src, path) {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          console.log('手机端')
          //手机端
          const a = document.createElement('a'); // 创建a标签
          a.setAttribute('href', src);// href链接
          a.click();// 自执行点击事件
        } else {
          console.log('pc端')
          //pc端
          window.open(`${this.baseUrl}/api/preview_file?url=${this.baseUrl}/${encodeURIComponent(path)}`, '_blank')
        }
      },
      downLoadFile(src, path) {
        let _self = this;
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if (isiOS) {
          this.showDownloadTips = true;
          dd.biz.navigation.setRight({
            show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
            control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '去下载',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
              _self.showDownloadTips = false;
              window.open(src, '_self')
            },
            onFail: function (err) { }
          });
        } else if (isAndroid) {
          window.open(`${this.baseUrl}/api/download_file?url=${this.baseUrl}/${encodeURIComponent(path)}`, '_blank')
          // const a = document.createElement('a'); // 创建a标签
          // a.setAttribute('download', '');// download属性
          // a.setAttribute('href', src);// href链接
          // a.click();// 自执行点击事件
        } else {
          window.open(`${this.baseUrl}/api/download_file?url=${this.baseUrl}/${encodeURIComponent(path)}`, '_blank')
        }
      },
      //导出报告
      handleExportPDF() {
        const TOKEN = localStorage.getItem('ACCESS_TOKEN');
        window.open(`${this.baseUrl}/api/user/approval/export_pdf?id=${this.detailInfo.id}&download=1&token=${TOKEN}`, '_blank')
      },
      //查看全部人员信息
      viewAllUserInfo(item) {
        this.currentFlowItem = item;
        this.flowUserPopupVisible = true;
      },
      //缓存数据
      async storageData() {
        await this.$http.storageModuleData({
          id: this.detailInfo.id,
          content_list: this.detailInfo.content_list
        }).then(res => {
          if (res.status === "ok") {
            this.$set(this.detailInfo, 'process_list', res.data)
          }
        }).catch(error => {
          console.log(error);
        });
      },
      // 移除值
      removeValue(data) {
        this.curSelectViewData = data;
        this.$set(this.curSelectViewData, 'value', '');//基于表单里面选择多选项等处理
      },
      // 移除日期值
      removeDateValue(data, type) {
        this.curSelectViewData = data;
        if (type === "start_value") {
          this.$set(this.curSelectViewData.data, "start_value", "");
        } else if (type === "end_value") {
          this.$set(this.curSelectViewData.data, "end_value", "");
        } else {
          // this.$set(this.curSelectViewData.data, "value", "");
        }
      },
      // 设置评分值
      setScore(item, index) {
        this.curSelectViewData = item;
        this.$set(this.curSelectViewData, 'value', index);//基于表单里面选择多选项等处理
      },
      showSelectCityPopup(item) {
        this.curSelectViewData = item;
        this.showSelectCity = true;
      },
      // 城市选择回调
      areaResult(show, result) {
        this.showSelectCity = show;
        if (result) {
          let selectType = this.curSelectViewData.data.address_type;//3为省市，1为省市区
          this.curSelectViewData.value = {
            area: selectType == 3 ? `${result.province.name}，${result.city.name}` : `${result.province.name}，${result.city.name}，${result.area.name}`
          }
          console.log(this.curSelectViewData)
        }
      },
      // 显示日期选择
      showDateSelect({ item, type }) {
        this.curSelectViewData = item;
        this.openDateType = type;
        this.$refs.picker.open();
      },
      // 确定日期选择
      handleDateConfirm(value) {
        this.datePickerValue = new Date(value).format("yyyy-MM-dd");

        let dateStr = this.curSelectViewData.data.date_type == '1' ? new Date(value).format("yyyy-MM-dd hh:mm") : new Date(value).format("yyyy-MM-dd");
        if (this.openDateType === "start_value") {
          if (this.curSelectViewData.data.end_value && dateStr) {
            if (new Date(dateStr).getTime() > new Date(this.curSelectViewData.data.end_value).getTime()) {
              return Toast(`开始时间要小于结束时间！`);
            }
          }
          this.$set(
            this.curSelectViewData.data,
            "start_value",
            dateStr
          );
        } else if (this.openDateType === "end_value") {
          if (this.curSelectViewData.data.start_value && dateStr) {
            if (new Date(dateStr).getTime() < new Date(this.curSelectViewData.data.start_value).getTime()) {
              return Toast(`结束时间要大于开始时间！`);
            }
          }
          this.$set(
            this.curSelectViewData.data,
            "end_value",
            dateStr
          );
        } else {
          this.$set(this.curSelectViewData, "value", dateStr);
        }

        if (this.curSelectViewData.data.start_value && this.curSelectViewData.data.end_value) {
          this.$set(this.curSelectViewData, "value", [this.curSelectViewData.data.start_value, this.curSelectViewData.data.end_value])
        }
      },
      // 签名
      showSignPopup(item) {
        this.curSelectViewData = item;
        this.signPopupVisible = true;
      },
      showUpload(item, type) {
        this.curSelectViewData = item;
        this.currentUploadType = type;
      },
      // 上传回调
      uploadCallback(url) {
        let item = this.curSelectViewData
        this.$set(this.curSelectViewData, "value", item.value ? [...item.value, url] : [url]);
      },
      // 选择回调
      selectCallback(data) {
        this.$set(this.curSelectViewData, 'value', data);//基于表单里面选择多选项等处理
        // this.detailInfo.control_list.map(item => {
        //   if (item.id === this.curSelectViewData.id) {
        //     this.$set(item.data, "value", data);
        //     this.inputChange(item)
        //   }
        // });
      },
      //签名完成结果
      signResult(res) {
        this.signPopupVisible = false;
        this.$set(this.curSelectViewData, "value", res);
      },
      // 显示选择窗口
      showSelectPopup({ item, key }) {
        this.curSelectViewData = item;
        if (key == "radio") {
          this.radioSelectVisible = true;
        } else if (key == "check") {
          this.checkSelectVisible = true;
        } else if (key == "city") {
          this.citySelectVisible = true;
        }else if (key == "department") {
          this.departmentSelectVisible = true;
        }
      },
      // 处理
      getHandleInfo() {
        Indicator.open();
        this.$http.handleDetail({
          id: this.detailId
        }).then(res => {
          if (res.status === "ok") {
            this.detailInfo = res.data;
          } else {
            Toast(res.message)
          }
          this.showPage = true;
          Indicator.close();
        }).catch(error => {
          console.log(error);
        });
      },
      //撤销
      handleCancel() {
        MessageBox.prompt('请输入撤销原因').then(({ value, action }) => {
          if (action) {
            this.$http.cancelApproval({
              id: this.detailId,
              remark: value
            }).then(res => {
              if (res.status === "ok") {
                Toast('撤销成功！')
                this.getHandleInfo();
              } else {
                Toast(res.message)
              }
            }).catch(error => {
              console.log(error);
            });
          }
        });
      },
      //转交
      handleTransmit(userList) {
        this.$router.push({
          path: '/transmitConfirm',
          query: {
            id: this.detailInfo.id,
            userList,
          }
        })
      },

      /*
       *status: 1同意， 2拒绝
      */
      submitAudit(status) {
        this.$router.push({
          path: '/auditFlowConfirm',
          query: {
            id: this.detailInfo.id,
            user_name: this.detailInfo.user_name,
            approval_prompt: this.detailInfo.approval_prompt,
            prompt_required: this.detailInfo.prompt_required,
            refuse_prompt_required: this.detailInfo.refuse_prompt_required,
            is_signature: this.detailInfo.is_signature,
            status,
          }
        })
      },
      //办理人提交
      submitTransaction() {
        console.log(this.detailInfo)
        this.$router.push({
          path: '/middlemanConfirm',
          query: {
            id: this.detailInfo.id,
            user_name: this.detailInfo.user_name,
            approval_prompt: this.detailInfo.approval_prompt,
            prompt_required: this.detailInfo.prompt_required,
            is_signature: this.detailInfo.is_signature,
            content_list: this.detailInfo.content_list
          }
        })
      },
      // 暂存
      submitStorageFlow() {
        this.$http.storageFlow({
          id: this.detailId,
          content_list: this.detailInfo.content_list
        }).then(res => {
          if (res.status === "ok") {
            Toast('暂存成功！')
          } else {
            Toast(res.message)
          }
          Indicator.close();
        }).catch(error => {
          console.log(error);
        });
      },
      imgInfoCallback(width, height, url) {
        let that = this;
        //钉钉微应用预览api在安卓设备上，如果图片尺寸很大会出现第一次看不到图片，再次打开预览才能看到， 判断当图片尺寸超过3000，用后端接口处理。
        var useUrl = width > 3000 ? `${that.baseUrl}/api/get_image?url=${encodeURI(url)}&size=${width}` : encodeURI(url);
        dd.biz.util.previewImage({
          urls: [useUrl],//图片地址列表
          current: encodeURI(url),//当前显示的图片链接
          onSuccess: function (result) {
            /**/
          },
          onFail: function (err) {
          }
        })
      },
      // 图片预览
      viewPhoto(url) {
        var imgWidth = 0;
        var imgHeight = 0;
        var callback = null;
        var imgLoad = function (url, callback) {
          var img = new Image();
          img.src = encodeURI(url);
          if (img.complete) {
            callback(img.width, img.height, url);
          } else {
            img.onload = function () {
              callback(img.width, img.height, url);
              img.onload = null;
            };
          };
        };
        imgLoad(url, this.imgInfoCallback);
      },

      //查看表格列内容
      handleClickTableRow(item, index) {
        this.currentTableRowData = item;
        this.currentTableRowIndex = index;
        this.viewTableVisible = true;
      },
      //关闭查看表格内容
      closeTableFormPopup() {
        this.viewTableVisible = false;
      },
      // 选择回调
      selectCallback(data) {
        this.$set(this.curSelectViewData, 'value', data);//基于表单里面选择多选项等处理
      },
      // 关联审批单 
      bindAuditForm(item) {
        this.curSelectViewData = item;
        this.auditFormPopupVisible = true
      },
      //选择完审批单回调
      selectAuditFormCallback(list) {
        this.auditFormPopupVisible = false
        this.curSelectViewData.is_condition = true;
        this.$set(this.curSelectViewData, "value", list);
      },
      //获取当前位置
      getLocation(item) {
        Indicator.open('正在获取位置信息');
        let self = this;
        self.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            dd.device.geolocation.get({
              targetAccuracy: Number,
              coordinate: Number,
              withReGeocode: Boolean,
              useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
              onSuccess: function (result) {
                Indicator.close();
                if (result.errorCode === 4) {
                  Toast(`获取位置失败，请打开手机定位服务`);
                }
                console.log(result.address)
                self.selectCallback(result.address)
                /* 高德坐标 result 结构
                  {
                      longitude : Number,
                      latitude : Number,
                      accuracy : Number,
                      address : String,
                      province : String,
                      city : String,
                      district : String,
                      road : String,
                      netType : String,
                      operatorType : String,
                      errorMessage : String,
                      errorCode : Number,
                      isWifiEnabled : Boolean,
                      isGpsEnabled : Boolean,
                      isFromMock : Boolean,
                      provider : wifi|lbs|gps,
                      isMobileEnabled : Boolean
                  }
                  */
              },
              onFail: function (err) {
                console.log(err);
              }
            });
          })

        });
      },

      // 选择转交人
      selectTransfer() {
        let self = this;
        let ids = this.detailInfo.distribute_user.length > 0 ? this.detailInfo.distribute_user.map(j => j.user_id) : [];
        if (ids.length > 0) {
          this.$http.dd_config().then(res => {
            dd.config(res.data);
            dd.biz.customContact.choose({
              title: '选择联系人', //标题
              users: ids,//一组员工userid
              corpId: 'ding55d1ed30f1647b6235c2f4657eb6378f',//加密的企业 ID，
              isShowCompanyName: true,   //true|false，默认为 false
              disabledUsers: [], //不能选的人
              onSuccess: function (data) {
                if (data.length > 0) {
                  self.handleTransmit(data);
                }
                /* data结构
                  [{
                    "name": "张三", //姓名
                    "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                    "emplId": '0573', //即员工userId，[<font color=red>获取成员详情接口</font>](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.DHPTF8&treeId=385&articleId=106816&docType=1#s1)
            
                   },
                   ...
                  ]
                */
              },
              onFail: function (err) { }
            });
          });
        } else {
          this.$http.dd_config().then(res => {
            dd.config(res.data);
            dd.ready(function () {
              self.$http.availableAuditUser().then(response => {
                if (response.status === 'ok') {
                  dd.biz.customContact.choose({
                    title: '选择转交人', //标题
                    users: response.data.map(j => j.user_id),//一组员工userid
                    corpId: 'ding55d1ed30f1647b6235c2f4657eb6378f',//加密的企业 ID，
                    isShowCompanyName: true,   //true|false，默认为 false
                    disabledUsers: [], //不能选的人
                    onSuccess: function (data) {
                      console.log(data)
                      if (data.length > 0) {
                        self.handleTransmit(data);
                      }
                    },
                    onFail: function (err) { }
                  });
                }
                Indicator.close();
              })
            });
          });
        }
      },
      // 选择联系人
      selectContact(item) {
        /*
        * @option_type: 1只能选择一人   2可同时选择多人
        */
        let self = this;
        this.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            dd.biz.contact.complexPicker({
              title: "选择联系人", //标题
              corpId: "ding55d1ed30f1647b6235c2f4657eb6378f", //企业的corpId
              multiple: true, //是否多选
              limitTips: "设置了只能选择一个联系人", //超过限定人数返回提示
              maxUsers: item.data.option_type == '1' ? 1 : 1000, //最大可选人数
              pickedUsers: [], //已选用户
              pickedDepartments: [], //已选部门
              disabledUsers: [], //不可选用户
              disabledDepartments: [], //不可选部门
              requiredUsers: [], //必选用户（不可取消选中状态）
              requiredDepartments: [], //必选部门（不可取消选中状态）
              appId: 158, //微应用Id，企业内部应用查看AgentId
              permissionType: "xxx", //可添加权限校验，选人权限，目前只有GLOBAL这个参数
              responseUserOnly: true, //返回人，或者返回人和部门
              startWithDepartmentId: 0, //仅支持0和-1
              onSuccess: function (result) {
                if (result.users && result.users.length > 0) {
                  result.users.map(j => {
                    j.user_name = j.name;
                    return j;
                  })
                }
                self.selectCallback(result.users)
                /**
                  {
                      selectedCount:1,  //选择人数
                      users:[{"name":"","avatar":"","userid":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
                      departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
                  }
                  */
              },
              onFail: function (err) {
                console.log(err);
              }
            });
          });
        });
      },

      // 选择部门
      setCompany(item) {
        /*
        * @option_type: 1只能选择一人   2可同时选择多人
        */
        let self = this;
        this.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          if (res.status === "ok") {
            dd.config(res.data);
            dd.ready(function () {
              dd.biz.contact.departmentsPicker({
                title: "选择部门", //标题
                corpId: "ding55d1ed30f1647b6235c2f4657eb6378f", //企业的corpId
                multiple: true, //是否多选
                limitTips: "设置了只能选择一个部门", //超过限定人数返回提示
                maxDepartments: item.data.option_type == '1' ? 1 : 1000, //最大选择部门数量
                pickedDepartments: [], //已选部门
                disabledDepartments: [], //不可选部门
                requiredDepartments: [], //必选部门（不可取消选中状态）
                appId: 158, //微应用的Id
                permissionType: "xxx", //选人权限，目前只有GLOBAL这个参数
                onSuccess: function (result) {
                  self.selectCallback(result.departments)
                  /**
                    {
                        userCount:1,                              //选择人数
                        departmentsCount:1，//选择的部门数量
                        departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
                    }
                    */
                },
                onFail: function (err) {
                  console.log(err);
                }
              });
            });
          }
        });
      },
      // 选择外部联系人
      selectOutContact(item) {
        let self = this;
        this.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            dd.biz.contact.externalComplexPicker({
              title: "选择外部联系人",
              corpId: "ding55d1ed30f1647b6235c2f4657eb6378f",
              multiple: false, //默认只有单选
              limitTips: "超出了",
              maxUsers: 1000, //默认不限制
              pickedUsers: [], //已选，但可取消，只针对多选生效
              disabledUsers: [], //不可选，，只针对多选生效
              requiredUsers: [], //必选，只针对多选生效
              onSuccess: function (data) {
                if (data && data.length > 0) {
                  data.map(j => {
                    j.user_name = j.name;
                    return j;
                  })
                }
                self.selectCallback(data)
                /* data结构
                    [
                      {
                          "emplId":"123",//选人的员工id
                          "name":"name",//员工姓名
                          "avatar":"avatarURL",//头像url
                          "orgName":"org"//公司名字
                      },
                     ...
                    ]
                  */
              },
              onFail: function (err) {
                console.log(err);
              }
            });
          });
          dd.error(function (error) {
            console.log(error);
          });
        });
      },
    },
    beforeRouteLeave(to, from, next) {
      dd.biz.navigation.setRight({
        show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
        control: false,//是否控制点击事件，true 控制，false 不控制， 默认false
        text: '',//控制显示文本，空字符串表示显示默认文本
        onSuccess: function (result) { },
        onFail: function (err) { }
      });
      next()
    }
  };
</script>

<style lang="scss" scoped>
  @import "styles/popup-table-edit.scss";
  @import "styles/index.scss";

  ::v-deep {

    .ProvCityHeaderConfirm,
    .ProvCityHeaderCancle {
      color: #409eff !important;
    }

    .footer-box .mint-button {
      height: 48px;
    }

    .mint-cell-wrapper {
      background-image: none;
      border-bottom: 1px solid #eee;
    }

    .mint-button--small {
      padding: 0 40px;
      height: 40px;
      line-height: 40px;
    }

    .ProvCityBoxBg {
      position: fixed !important;
      z-index: 2500 !important;
      background: #0000006e !important;
    }

    .ProvCityBox {
      z-index: 2599 !important;
    }
  }
</style>