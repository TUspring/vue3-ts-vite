<template>
  <div class="page-container">
    <div class="module-wrap">
      <div class="audit-title">
        {{detailInfo.name}}
      </div>
      <div class="component-view" style="padding: 10px 20px; background: #fff;"
        v-if="detailInfo.department_name || detailInfo.create_date">
        <p style="font-size: 16px" v-if="detailInfo.department_name">申请部门：{{detailInfo.department_name}}</p>
        <p style="font-size: 16px" v-if="detailInfo.create_date">申请日期：{{detailInfo.create_date}}</p>
      </div>

      <!-- 组件内容 -->
      <div v-for="(item,index) in detailInfo.control_list" :key="index" v-if="false">
        <!-- 模板组件 -->
        <FlowNode :item="item" :modelId="detailInfo.id" :key="item.key" @valueChange="storageValueChange"
          @showSelectPopup="showSelectPopup" @showSelectCityPopup="showSelectCityPopup" @bindAuditForm="bindAuditForm"
          @showDateSelect="showDateSelect" @showSignPopup="showSignPopup"></FlowNode>
        <!-- 9、明细/表格  这个组件包含大部分可编辑模板组件，特殊处理-->
        <div class="component-view table-view" :class="item.data.way == 1 ? 'table-list-type':'input-item-view'"
          v-if="item.key ==='table'">
          <!-- 列表模式 -->
          <div v-if="item.data.way == 1">
            <div class="table-tit" v-if="!item.data.value">{{item.data.title}}</div>
            <div v-for="(row, index) in item.data.value" :key="index"
              @click="tableListClick(item.data.value, item.id, index)">
              <div class="table-tit">
                <span>{{item.data.title}}{{item.data.value && item.data.value.length > 0 ? `(${index + 1})` :
                  ''}}</span>
                <span class="remove-list-row" v-if="item.data.value && item.data.value.length > 1"
                  @click="item.data.value.splice(index, 1)">删除</span>
              </div>
              <div v-for="(item, index) in row.list" :key="index">
                <FlowNode :item="item" :modelId="detailInfo.id" :key="item.key" @valueChange="storageValueChange"
                  @showSelectPopup="showSelectPopup" @showSelectCityPopup="showSelectCityPopup"
                  @bindAuditForm="bindAuditForm" @showDateSelect="showDateSelect" @showSignPopup="showSignPopup">
                </FlowNode>
              </div>
            </div>
            <div class="add-row" @click="newTableItem(item)">
              <i class="iconfont icon-jia1"></i>
              <span>{{item.data.action_name}}</span>
            </div>
            <!-- 列表模式的统计 -->
            <div class="table-list__total" v-if="item.data.statistics && item.data.statistics.length > 0">
              <p v-for="(obj, index) in item.data.statistics" :key="index" v-if="obj.statistics">
                <span class="title" v-if="obj.data.title">总{{obj.data.title}}：</span>
                <span class="count">{{obj.data.value}}</span>
              </p>
            </div>
          </div>
          <!-- 表格模式 -->
          <div v-if="item.data.way == 2">
            <div class="table-tit">{{item.data.title}}</div>
            <div class="table-type-wrap">
              <div class="wrap-container">
                <!-- 表格左侧索引 -->
                <div class="table-left__index">
                  <div class="index-item empty-index"></div>
                  <div class="index-item index-item__line" v-for="(list, i) in item.data.value" :key="i">{{i+1}}</div>
                  <div class="index-item" v-if="item.data.statistics && item.data.statistics.length > 0"
                    style="font-size: 12px;">合计</div>
                </div>
                <!-- 表格内容 -->
                <div class="table-body">
                  <div class="table-body__scroll">
                    <div class="table-head">
                      <ul class="row-ul">
                        <li class="table-head-li" v-for="(li, i) in item.child" :key="i">
                          <div class="head-name">{{li.data.title ? li.data.title : li.name}}</div>
                        </li>
                      </ul>
                    </div>
                    <div v-for="(row, index) in item.data.value" :key="index"
                      @click="tableRowClick(item.data, row, index, item.id)">
                      <ul class="row-ul" :class="row.list && row.list.length === 0 ? 'empty-li':''">
                        <li class="row-li__line" v-for="(li, i) in row.list" :key="i">
                          <div class="row-li__value">
                            <div v-if="li.key === 'date_rang'">
                              <span v-if="li.data.value && li.data.value.length > 0">
                                {{li.data.value[0]}} 至 {{li.data.value[1]}}
                              </span>
                            </div>
                            <!-- 图片、附件 -->
                            <div v-else-if="li.key === 'picture'||li.key === 'attachment'" class="df-left">
                              <div v-for="(file,index) in li.data.value" :key="index" style="display: inline-block;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              white-space: nowrap;" v-if="li.data">
                                <span>
                                  {{file.substring(file.lastIndexOf('/') + 1)}}
                                </span>
                              </div>
                            </div>
                            <!-- 外部联系人、联系人、部门 -->
                            <div
                              v-else-if="li.key === 'external_contact' ||li.key === 'contact'||li.key === 'department'">
                              <span v-if="li.data && li.data.value">{{li.data.value.map(j => j.name).join('，')}}</span>
                            </div>
                            <!-- 关联审批单 -->
                            <div v-else-if="li.key === 'relation_authorization'">
                              <i class="iconfont icon-guanlian" style="font-size: 14px;"></i>
                              <span v-if="li.data && li.data.value">{{li.data.value.length}}</span>
                            </div>
                            <!-- 省市区 -->
                            <div v-else-if="li.key === 'province'">
                              <span>{{li.data.value.area}}</span>
                            </div>
                            <!-- 金额 -->
                            <div class="value" v-else-if="li.key === 'money'">
                              <span>{{li.data.value | formatNumber}}</span>
                            </div>
                            <div v-else>
                              <span
                                v-if="Object.prototype.toString.call(li.data.value) === '[object Array]'">{{li.data.value.join(',')}}</span>
                              <span v-else v-html="li.data.value"></span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <!-- 合计项  如果表单勾选了统计总数时显示-->
                    <div v-if="item.data.statistics && item.data.statistics.length > 0">
                      <ul class="row-ul">
                        <li v-for="(li, i) in item.data.statistics" :key="i">
                          <div class="row-li__value">
                            {{li.data.value}}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="add-row" @click="newTableItem(item)">
              <i class="iconfont icon-jia1"></i>
              <span>{{item.data.action_name}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 发送到群 -->
      <div class="component-view input-item-view df-bt" @click="shareDingding">
        <div class="item-label">发送到群</div>
        <div class="view-item-icon">
          <i class="iconfont icon-jia"></i>
        </div>
      </div>

      <!-- 审批流程设置 -->
      <div class="component-view flow-view">
        <div class="flow-head df-bt">
          <div>审批流程</div>
        </div>
        <div class="approval-item df-bt" :class="{
          'before-line' : index > 0,
          'after-line' : index +1 !== detailInfo.process_list.length
        }" v-for="(item, index) in detailInfo.process_list">
          <div class="spot"></div>
          <div class="approval-item__left df-left">
            <div>
              <p class="tit">
                <span v-if="item.type === 1">发起人</span>
                <span v-if="item.type === 2">审批人</span>
                <span v-if="item.type === 3">抄送人</span>
                <span v-if="item.type === 6">办理人</span>
              </p>
              <p class="tips">
                <span v-if="item.type === 1">设置发起人</span>
                <span v-if="item.type === 2">
                  <span v-if="item.user.length > 0">
                    <span v-if="item.audit_mode == 1">{{item.user.length}}人依次审批</span>
                    <span v-if="item.audit_mode == 2">{{item.user.length}}人会签</span>
                    <span v-if="item.audit_mode == 3">{{item.user.length}}人或签</span>
                  </span>
                  <span v-else>设置审批人</span>
                </span>
                <span v-if="item.type === 3">设置抄送人</span>
                <span v-if="item.type === 6">设置办理人</span>
              </p>
            </div>
          </div>

          <div class="approval-item__right">
            <!-- 如果人员超过3人， 显示查看全部按钮 -->
            <div class="subitem" v-if="item.user.length > 3">
              <div class="wrap" @click="viewAllUserInfo(item)">
                <div class="avatar-sign" style="background: #41affe;">
                  <i class="iconfont icon-users" style="font-size: 22px;"></i>
                </div>
                <div class="user-name">
                  查看全部
                </div>
              </div>
              <div class="arrange-arrow">
                <!-- 审批人用右箭头(>)分割，抄送人用加号(+)分割 -->
                <i class="iconfont icon-jia1" style="font-size: 12px;" v-if="item.type === 3"></i>
                <i class="iconfont icon-arrow-left" v-else></i>
              </div>
            </div>

            <!-- 小于等于三个人员，全部显示出来； 大于三个人员，显示两人员和一个查看全部按钮 -->
            <div class="subitem" v-for="(subitem,_index) in item.user"
              v-if="(item.user.length > 3 && _index < 2) || item.user.length <= 3">
              <div class="wrap">
                <div class="avatar-sign">
                  {{subitem.user_name |substringName}}
                </div>
                <div class="user-name">
                  {{subitem.user_name}}
                </div>

                <!-- 移除按钮 规则-->
                <!-- 原有流程的审批人和抄送人不能删除 -->
                <!-- 只能删除通过新增按钮加的审批人和抄送人 -->
                <span class="remove-user__button" v-if="subitem.isAdd" @click="item.user.splice(_index, 1)">
                  <i class="iconfont icon-guanbi11 remove-button"></i>
                </span>
              </div>

              <!-- 显示规则 -->
              <!-- 情况一：如果是抄送人，全部都显示分割图标 -->
              <!-- 情况二：如果是审批人，显示情况
                        1.人员多于3人：item.user.length > 3 && _index < 1 
                        2.人员等于3人：item.user.length === 3  && _index < 2
                        3.人员小于3人：item.user.length < 3 && _index < item.user.length - 1
               -->
              <div class="arrange-arrow" v-if="
              (item.user.length > 3 && _index < 1 ) 
              || (item.user.length === 3  && _index < 2 )
              || (item.user.length < 3 && _index < item.user.length - 1 )
              || item.type === 3 
              || item.user.some(j=>j.isAdd) ">
                <!-- 审批人用右箭头(>)分割，抄送人用加号(+)分割 -->
                <i class="iconfont icon-jia1" style="font-size: 12px;" v-if="item.type === 3"></i>
                <i class="iconfont icon-arrow-left" v-else></i>
              </div>
            </div>

            <!-- 规则 -->
            <!-- 如果审批人有审批人员，不在显示增加按钮。 如果没有审批人，显示增加按钮，并显示必填提示的星号。如果是新增的(isAdd为true代表是后面新增的)还是会显示增加按钮 -->
            <!-- 如果是抄送人，一直显示增加按钮，不带必填星号 -->
            <div class="add" @click="selectFlowContact(item)"
              v-if="(item.user.length === 0 && item.type !== 3) || item.user.some(j=>j.isAdd) || item.type === 3">
              <i class="iconfont icon-jia1"></i>
              <span class="require-icon" v-if="item.type !== 3 && item.user.length === 0">*</span>
            </div>
          </div>
        </div>

        <div v-if="detailInfo.process_list === false" style="padding: 0 15px 30px;color: #403f3f">
          {{detailInfo.process_warn_msg}}
        </div>
      </div>
    </div>

    <!-- 底部提交按钮 -->
    <div class="footer-box">
      <mt-button class="form-button" type="primary" :disabled="submitLoading" @click="submitApproval">提交</mt-button>
    </div>


    <!-- 编辑表格表单 -->
    <mt-popup v-model="editTableVisible" position="bottom" style="width: 100%;">
      <template v-if="editTableVisible">
        <div class="popup-box">
          <div class="popup-box__head">
            <div class="close-popup" @click="closeTableFormEdit">
              <i class="iconfont icon-xiala"></i>
            </div>
            <div class="title">明细/表格</div>
          </div>
          <div class="info-tips">当前编辑的是第 {{currentTableRowIndex+1}} 行</div>
          <div style="padding-bottom: 100px;max-height: 450px;overflow: auto;">
            <div v-for="(item, index) in currentTableRowData" :key="index">
              <FlowNode :item="item" :modelId="detailInfo.id" :key="item.key" @valueChange="storageValueChange"
                @showSelectPopup="showSelectPopup" @showSelectCityPopup="showSelectCityPopup"
                @bindAuditForm="bindAuditForm" @showDateSelect="showDateSelect" @showSignPopup="showSignPopup">
              </FlowNode>
            </div>
          </div>
          <div class="confirm-box">
            <mt-button type="default" size="small" style="margin-right: 10px" @click="removeTableRow"
              v-if="tableFormTotalList.length > 1">删除</mt-button>
            <mt-button type="primary" size="small" @click="confirm">保存</mt-button>
          </div>
        </div>
      </template>
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

    <!-- 日期 年月日date  年月日时分datetime-->
    <mt-datetime-picker ref="picker" style="z-index: 2500;"
      :type="curSelectViewData.data && curSelectViewData.data.date_type && curSelectViewData.data.date_type == '1' ? 'datetime':'date'"
      v-model="datePickerValue" @confirm="handleDateConfirm" :start-date="new Date('1978-01-01')"
      :end-date="new Date('2050-01-01')">
    </mt-datetime-picker>

    <!-- 签名窗口 -->
    <mt-popup v-model="signPopupVisible" position="bottom" style="width: 100%;height: 100%;">
      <e-sign @esignCallback="signResult" @close="signPopupVisible =false" v-if="signPopupVisible"></e-sign>
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

    <!-- 查看审批流程全部人员窗口 -->
    <mt-popup v-model="flowUserPopupVisible" position="bottom" style="width: 100%;">
      <flow-user v-if="flowUserPopupVisible" :dataInfo="currentFlowItem"></flow-user>
    </mt-popup>

    <!-- 关联工作单 -->
    <mt-popup v-model="auditFormPopupVisible" position="bottom" style="width: 100%;height: 80%;">
      <audit-form v-if="auditFormPopupVisible" :initData="curSelectViewData" @callback="selectAuditFormCallback">
      </audit-form>
    </mt-popup>

    <!-- 城市级联 address_type == 3表示省市项；1：为二级联动，2为三级联动-->
    <vue-area v-if="showSelectCity" :level="curSelectViewData.data.address_type == 3 ? 1: 2"
      :props-show="showSelectCity" v-on:result="areaResult"></vue-area>
  </div>
</template>


<script>
  // import { Indicator, Toast, Popup, Button, DatetimePicker } from "mint-ui";
  // import vueArea from '@/components/city-picker';
  // import ESign from "@/components/edit-dialog/esign.vue";
  // import SelectRadio from "@/components/edit-dialog/radio.vue";
  // import SelectCheck from "@/components/edit-dialog/checklist.vue";
  // import SelectCity from "@/components/edit-dialog/selectCity.vue";
  // import SelectDepartment from "@/components/edit-dialog/selectDepartment.vue";
  // import auditForm from "@/components/edit-dialog/auditForm.vue";
  // import UploadBox from "@/components/upload/index.vue";
  // import FlowUser from "./dialog/flowUserList.vue";
  // import FlowNode from './module-unit/index.vue'

  // import * as dd from "dingtalk-jsapi";
  export default {
    components: {
      // ESign,
      // SelectRadio,
      // SelectCheck,
      // SelectCity,
      // SelectDepartment,
      // UploadBox,
      // FlowUser,
      // auditForm,
      // vueArea,
      // FlowNode
    },
    data() {
      return {
        submitLoading: false,
        showSelectCity: false,
        editTableVisible: false, //编辑表单
        flowUserPopupVisible: false, //审批流程查看全部
        auditFormPopupVisible: false, //关联审批单
        citySelectedResult: null,
        baseUrl: JSON.parse(localStorage.getItem("ENV_HTTP")),
        regIdCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        regPhone: /^1[3456789][0-9]{9}$/,
        detailInfo: {},
        curSelectViewData: {},
        signPopupVisible: false, //签名弹出窗口
        radioSelectVisible: false, //单选弹出窗口
        checkSelectVisible: false, //多选弹出窗口
        citySelectVisible: false, //城市选择弹出窗口
        departmentSelectVisible: false, //部门选择弹出窗口
        // datePickerValue: new Date().format("yyyy-MM-dd"), //日期
        openDateType: "", //选择日期类型
        detailId: "",
        modify_audit_id: "",
        currentFlowItem: null,
        tableModuleCopyData: null,//表单组件默认数据项
        currentTableRowData: [],//点击表格列数据
        tableFormTotalList: [],//表格所有列表数据
        currentTableRowIndex: 0, //索引
        currentModuleId: null, //组件id
      };
    },
    created() {
      this.detailId = this.$route.query.id;
      this.modify_audit_id = this.$route.query.modify_audit_id; //用于处理生成重审单
      // this.getModuleDetail();
    },
    methods: {
      navigateTo(item) {
        this.$router.push({
          path: '/flowDetail',
          query: item
        })
      },
      /*
      * 显示选择窗口
      */
      showSelectPopup({ item, key }) {
        console.log(item)
        this.curSelectViewData = item;
        if (key == "radio") {
          this.radioSelectVisible = true;
        } else if (key == "check") {
          this.checkSelectVisible = true;
        } else if (key == "city") {
          this.citySelectVisible = true;
        } else if (key == "department") {
          this.departmentSelectVisible = true;
        }
      },
      showSignPopup(item) {
        this.curSelectViewData = item;
        this.signPopupVisible = true;
      },
      //签名完成结果
      signResult(res) {
        this.signPopupVisible = false;
        this.$set(this.curSelectViewData.data, "value", res);
        this.storageValueChange(this.curSelectViewData)
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
          this.curSelectViewData.data.value = {
            area: selectType == 3 ? `${result.province.name}，${result.city.name}` : `${result.province.name}，${result.city.name}，${result.area.name}`
          }
          this.storageValueChange(this.curSelectViewData)
        }
      },
      // 关联审批单 
      bindAuditForm(item) {
        this.curSelectViewData = item;
        this.auditFormPopupVisible = true
      },
      //缓存改变的值
      storageValueChange(info) {
        let statisticsStatus = false; //表单是否有合计项
        if (this.tableFormTotalList.length > 0) {
          statisticsStatus = this.tableFormTotalList[0].list.some(j => j.data.statistics);
        }
        this.$http.saveEditModule({
          model_id: this.detailId,
          model_control_id: info.id,
          value: info.data.value,
          index: this.tableFormTotalList.length > 0 ? this.tableFormTotalList[this.currentTableRowIndex].index : '', //表单里面的输入项改变
        }).then(res => {
          if (res.status === "ok") {
            let obj = res.data;
            if (statisticsStatus) {
              this.$set(this.detailInfo, 'process_list', obj.process_list)
              // this.$set(this.detailInfo, 'control_list', obj.control_list)
              this.detailInfo.control_list.map(j => {
                console.log(obj.control_list)
                if (j.id === this.currentModuleId) {
                  obj.control_list.map(r => {
                    if (r.id === this.currentModuleId) {
                      this.$set(j.data, "statistics", r.data.statistics);
                    }
                  })
                }
              });
            }
            if (info.is_condition) {
              this.$set(this.detailInfo, 'process_list', obj.process_list)
            }
          }
        }).catch(error => {
          console.log(error);
        });
      },

      // 选择回调
      selectCallback(data) {
        this.$set(this.curSelectViewData.data, 'value', data);//基于表单里面选择多选项等处理
        this.storageValueChange(this.curSelectViewData)
        // this.detailInfo.control_list.map(item => {
        //   if (item.id === this.curSelectViewData.id) {
        //     this.$set(item.data, "value", data);
        //     this.storageValueChange(item)
        //   }
        // });
      },

      //模板详情内容
      getModuleDetail() {
        Indicator.open();
        this.$http.approvalModuleDetail({
          id: this.detailId,
          modify_audit_id: this.modify_audit_id,
        }).then(res => {
          if (res.status === "ok") {
            let obj = res.data;
            obj.control_list.map(j => {
              if (j.key === 'province') {
                j.data.value = j.data.value ? j.data.value : {}
              }
              if (j.key === 'date_rang') { //日期区间
                if (j.data.value) {
                  j.data.start_value = j.data.value[0]
                  j.data.end_value = j.data.value[1]
                }
              }
              if (j.key === 'table') {
                this.tableModuleCopyData = JSON.stringify(j.child); //复制一份空的默认数组，给列表添加项使用
              }
            })
            console.log(obj)
            this.detailInfo = obj;
          } else {
            Toast(res.message)
          }
          Indicator.close();
        }).catch(error => {
          console.log(error);
        });
      },
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
          console.log(9)
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
          this.$set(this.curSelectViewData.data, "value", dateStr);
        }
        if (this.curSelectViewData.data.start_value && this.curSelectViewData.data.end_value) {
          this.$set(this.curSelectViewData.data, "value", [this.curSelectViewData.data.start_value, this.curSelectViewData.data.end_value])
        }
        this.storageValueChange(this.curSelectViewData)
      },
      // 提交审批
      submitApproval() {
        let arr = this.detailInfo.control_list;
        console.log(arr)
        arr.map(j => {
          if (j.key === "date_rang") { //日期区间
            j.data.value = j.data.start_value && j.data.end_value ? [j.data.start_value, j.data.end_value] : [];
          }
          if (j.key === "electronic_invoice") {
            j.data.value = ['电子发票']
          }
          if (j.key === "collection_account") {
            j.data.value = ['收款账户']
          }
        });

        for (let obj in arr) {
          // 如果身份证不是必填项，没值不拦截，如果填写了值进行身份证格式校验；
          if (arr[obj].key === 'id_card' && !this.regIdCard.test(arr[obj].data.value) && arr[obj].data.value) {
            return Toast(`请填写正确的身份证号！`);
            break
          }
          //验证手机
          if (arr[obj].key === 'phone' && !this.regPhone.test(arr[obj].data.value) && arr[obj].data.value) {
            return Toast(`请填写正确的手机号！`);
            break
          }
          if (arr[obj].data.required && (!arr[obj].data.value && arr[obj].data.value.length === 0 && Object.keys(arr[obj].data.value).length === 0)) {
            if (arr[obj].key === 'date_rang') { //日期区间
              return Toast(`${arr[obj].name}为必填项！`);
              break
            } else {
              return Toast(`${arr[obj].data.title}为必填项！`);
              break
            }
          }
        }

        let ajaxData = {
          id: this.detailInfo.id,
          modify_audit_id: this.modify_audit_id,
          control_list: arr,
          process_list: this.detailInfo.process_list
        };
        this.submitLoading = true;
        console.log(ajaxData);
        this.$http.submitApproval(ajaxData).then(res => {
          let { status, data, message } = res;
          if (status === "ok") {
            Indicator.close();
            Toast("提交成功！");
            this.$router.push({
              path: '/flowSetting'
            })
          } else {
            Toast(message);
          }
          this.submitLoading = false;
        }).catch(error => {
          this.submitLoading = false;
          Toast(error.message);
        });
      },

      //自定义选人
      customSelectUser(item) {
        let self = this;
        this.currentFlowItem = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            self.$http.availableAuditUser().then(response => {
              if (response.status === 'ok') {
                dd.biz.customContact.multipleChoose({
                  title: '选择审批人', //标题
                  users: response.data.map(j => j.user_id),//一组员工userid
                  corpId: 'ding55d1ed30f1647b6235c2f4657eb6378f',//加密的企业 ID，
                  isShowCompanyName: true,   //true|false，默认为 false
                  disabledUsers: [], //不能选的人
                  onSuccess: function (data) {
                    data.map(j => {
                      j.isAdd = true;
                      j.user_name = j.name;
                      j.userid = j.emplId;
                      return j;
                    }); //插入识别标识，区分是原来的流程数据还是新增的；
                    self.currentFlowItem.user = [...self.currentFlowItem.user, ...data];
                    /* data结构
                      [{
                        "name": "张三", //姓名
                        "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                        "emplId": '0573', //即员工userId，[<font color=red>获取成员详情接口</font>](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.DHPTF8&treeId=385&articleId=106816&docType=1#s1)
        
                       }]
                    */
                  },
                  onFail: function (err) { }
                });
              }
              Indicator.close();
            })
          });
        });
      },


      // 设置审批人
      selectFlowContact(item) {
        Indicator.open();
        let self = this;
        if (item.type == 2) {
          this.customSelectUser(item)
        } else {
          self.currentFlowItem = item;
          this.$http.dd_config().then(res => {
            Indicator.close();
            dd.config(res.data);
            dd.ready(function () {
              dd.biz.contact.complexPicker({
                title: "选择联系人", //标题
                corpId: "ding55d1ed30f1647b6235c2f4657eb6378f", //企业的corpId
                multiple: true, //是否多选
                limitTips: "超出了", //超过限定人数返回提示
                maxUsers: 1000, //最大可选人数
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
                  console.log(result);
                  result.users.map(j => {
                    j.isAdd = true;
                    j.user_name = j.name;
                    return j;
                  }); //插入识别标识，区分是原来的流程数据还是新增的；
                  self.currentFlowItem.user = [...self.currentFlowItem.user, ...result.users];
                  /**{
                        selectedCount:1,  //选择人数
                        users:[{"name":"","avatar":"","userid":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
                        departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
                    }*/
                },
                onFail: function (err) {
                  console.log(err);
                }
              });
            });
          });
        }
      },

      //查看全部人员信息
      viewAllUserInfo(item) {
        this.currentFlowItem = item;
        this.flowUserPopupVisible = true;
      },
      // 发送到群
      shareDingding() {
        dd.ready(function () {
          dd.biz.util.share({
            type: 1,//分享类型，0:全部组件 默认；1:只能分享到钉钉；2:不能分享，只有刷新按钮
            url: String,
            title: String,
            content: String,
            image: String,
            onSuccess: function () {
              //onSuccess将在调起分享组件成功之后回调
            },
            onFail: function (err) { }
          })
        })
      },
      //增加表格项
      newTableItem(item) {
        if (item.data.value.length === 0 || !item.data.value) {
          this.$set(item, 'value', [...item.data.value ? item.data.value : [], {}]);
        } else {
          this.$set(item.data, 'value', [...item.data.value, {
            index: item.data.value.length + 1,
            sort: item.data.value.length + 1,
            list: JSON.parse(this.tableModuleCopyData)
          }]);
        }
      },

      /**
      * 表单列点击
      * @param data: 表单数据
      * @param row: 单列数据
      * @param index: 单列索引
      * @param id: 最后层组件id
      */
      tableRowClick(data, row, index, id) {
        this.tableFormTotalList = data.value;
        this.currentTableRowData = row.list;
        this.currentTableRowIndex = index;
        this.currentModuleId = id;
        this.editTableVisible = true;
      },
      //点击表单 (列表模式)
      tableListClick(list, id, index) {
        this.tableFormTotalList = list;
        this.currentTableRowIndex = index;
        this.currentModuleId = id;
      },
      //删除表单 列
      removeTableRow() {
        this.$http.deleteTableRow({
          model_id: this.detailId,
          table_control_id: this.currentModuleId,
          index: this.tableFormTotalList.length > 0 ? this.tableFormTotalList[this.currentTableRowIndex].index : '', //表单里面的输入项改变
        }).then(res => {
          if (res.status === "ok") {
            let obj = res.data;
            let statisticsStatus = false; //表单是否有合计项
            if (this.tableFormTotalList.length > 0) {
              statisticsStatus = this.tableFormTotalList[0].list.some(j => j.data.statistics);
            }
            if (statisticsStatus) {
              //将表单改变的合计列数据更新
              let _item = obj.control_list.filter(j => j.id === this.currentModuleId);
              this.detailInfo.control_list.map(j => {
                if (j.id === this.currentModuleId) {
                  this.$set(j.data, "statistics", _item[0].data.statistics);
                }
              });
            }
            this.$set(this.detailInfo, 'process_list', obj.process_list)
            this.tableFormTotalList.splice(this.currentTableRowIndex, 1);
            this.editTableVisible = false;
          } else {
            Toast(res.message)
          }
          Indicator.close();
        }).catch(error => {
          console.log(error);
        });
      },

      //选择完审批单回调
      selectAuditFormCallback(list) {
        this.auditFormPopupVisible = false
        this.curSelectViewData.is_condition = true;
        this.$set(this.curSelectViewData.data, "value", list);
        this.storageValueChange(this.curSelectViewData)
      },
      confirm() {
        this.closeTableFormEdit()
      },
      closeTableFormEdit() {
        this.editTableVisible = false;
      }
    },

    beforeDestroy() {
      Indicator.close();
    }
  };
</script>

<style scoped lang="scss">
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
      z-index: 2500 !important;
      background: #0000006e !important;
    }

    .ProvCityBox {
      z-index: 2599 !important;
    }
  }
</style>