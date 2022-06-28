<template>
  <div class="page-container">
    <div class="module-wrap">
      <div class="audit-title">
        {{state.detailInfo.name}}
      </div>
      <div class="component-view" style="padding: 10px 20px; background: #fff;"
        v-if="state.detailInfo.department_name || state.detailInfo.create_date">
        <p style="font-size: 16px" v-if="state.detailInfo.department_name">申请部门：{{state.detailInfo.department_name}}</p>
        <p style="font-size: 16px" v-if="state.detailInfo.create_date">申请日期：{{state.detailInfo.create_date}}</p>
      </div>
      <div v-for="(item,index) in state.detailInfo.control_list" :key="index">
        <!-- 1、单行输入框 -->
        <component :is="CurrentCompoent['single_input']" v-if="item.key ==='single_input'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!-- 2、多行输入框 -->
        <component :is="CurrentCompoent['multiple_input']" v-if="item.key ==='multiple_input'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!-- 3、数字输入框 -->
        <component :is="CurrentCompoent['number_input']" v-if="item.key ==='number_input'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!-- 4、单选框 -->
        <component :is="CurrentCompoent['radio_choice']" v-if="item.key ==='radio_choice'" :item="item"
          @changeCallback="storageValueChange" @handleSelectPopup="handlePopup"></component>
        <!-- 5、多选框 -->
        <component :is="CurrentCompoent['multiple_choice']" v-if="item.key ==='multiple_choice'" :item="item"
          @changeCallback="storageValueChange" @handleSelectPopup="handlePopup"></component>
        <!--  6、日期 -->
        <component :is="CurrentCompoent['date']" v-if="item.key ==='date'" :item="item"
          @changeCallback="storageValueChange" @handleSelectPopup="handlePopup"></component>
        <!--  7、日期区间 -->
        <component :is="CurrentCompoent['date_rang']" v-if="item.key ==='date_rang'" :item="item"
          @changeCallback="storageValueChange" @handleSelectPopup="showDateSelect"></component>
        <!--  8、图片 -->
        <component :is="CurrentCompoent['picture']" v-if="item.key ==='picture'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!--  9、说明文字 -->
        <component :is="CurrentCompoent['explain']" v-if="item.key ==='explain'" :item="item"></component>
        <!--  10、金额 -->
        <component :is="CurrentCompoent['money']" v-if="item.key ==='money'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!--  11、附件 -->
        <component :is="CurrentCompoent['attachment']" v-if="item.key ==='attachment'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!--  12、身份证 -->
        <component :is="CurrentCompoent['id_card']" v-if="item.key ==='id_card'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!--  13、电话 -->
        <component :is="CurrentCompoent['phone']" v-if="item.key ==='phone'" :item="item"
          @changeCallback="storageValueChange"></component>
        <!--  14、手写签名 -->
        <component :is="CurrentCompoent['sign']" v-if="item.key ==='sign'" :item="item"
          @changeCallback="storageValueChange"></component>
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
                'after-line' : index +1 !== state.detailInfo.process_list.length
              }" v-for="(item, index) in state.detailInfo.process_list">
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
                  {{ substringName(subitem.user_name) }}
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

        <div v-if="state.detailInfo.process_list === false" style="padding: 0 15px 30px;color: #403f3f">
          {{detailInfo.process_warn_msg}}
        </div>
      </div>
    </div>

    <!-- 底部提交按钮 -->
    <div class="footer-box">
      <van-button class="form-button" type="primary" :disabled="state.submitLoading" @click="submitApproval">提交
      </van-button>
    </div>

    <!-- 单选窗口 -->
    <van-popup v-model:show="popup.radioSelectVisible" position="bottom">
      <SelectRadio v-if="popup.radioSelectVisible" :initData="state.curSelectViewData" @selectCallback="selectCallback"
        @close="popup.radioSelectVisible =false"></SelectRadio>
    </van-popup>
    <!-- 多选窗口 -->
    <van-popup v-model:show="popup.multipleSelectVisible" position="bottom">
      <SelectCheck v-if="popup.multipleSelectVisible" :initData="state.curSelectViewData"
        @selectCallback="selectCallback" @close="popup.multipleSelectVisible =false"></SelectCheck>
    </van-popup>

    <!-- 日期 年月日date  年月日时分datetime-->
    <van-popup v-model:show="popup.dateSelectVisible" position="bottom">
      <van-datetime-picker v-model:show="state.datePickerValue"
        :type="state.curSelectViewData.data.date_type && state.curSelectViewData.data.date_type == '1' ? 'datetime':'date'"
        title="选择日期" :min-date="new Date('1978-01-01')" :max-date="new Date('2050-01-01')"
        @cancel="popup.dateSelectVisible=false" @confirm="handleDateConfirm" />
    </van-popup>

    <!-- 签名-->
    <van-popup v-model:show="popup.signPopupVisible" position="bottom">
      <ESign v-if="signPopupVisible" @esignCallback="signResult" @close="signPopupVisible =false"></ESign>
    </van-popup>

  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted, onActivated, getCurrentInstance, markRaw, defineAsyncComponent } from "vue";
  import { Toast, DatetimePicker } from 'vant';
  import { useRouter } from 'vue-router'
  import SelectRadio from "@/components/module-dialog/radio.vue";
  import SelectCheck from "@/components/module-dialog/checklist.vue";
  import ESign from "@/components/module-dialog/esign.vue";
  const CurrentCompoent = reactive({
    'single_input': markRaw(defineAsyncComponent(() => import('./module-unit/single-input'))),
    'multiple_input': markRaw(defineAsyncComponent(() => import('./module-unit/multiple-input'))),
    'number_input': markRaw(defineAsyncComponent(() => import('./module-unit/number-input'))),
    'radio_choice': markRaw(defineAsyncComponent(() => import('./module-unit/radio-choice'))),
    'multiple_choice': markRaw(defineAsyncComponent(() => import('./module-unit/multiple-choice'))),
    'date': markRaw(defineAsyncComponent(() => import('./module-unit/date'))),
    'date_rang': markRaw(defineAsyncComponent(() => import('./module-unit/date-rang'))),
    'picture': markRaw(defineAsyncComponent(() => import('./module-unit/picture'))),
    'explain': markRaw(defineAsyncComponent(() => import('./module-unit/explain'))),
    'money': markRaw(defineAsyncComponent(() => import('./module-unit/money'))),
    'attachment': markRaw(defineAsyncComponent(() => import('./module-unit/attachment'))),
    'id_card': markRaw(defineAsyncComponent(() => import('./module-unit/id-card'))),
    'phone': markRaw(defineAsyncComponent(() => import('./module-unit/phone'))),
    'sign': markRaw(defineAsyncComponent(() => import('./module-unit/sign'))),
  })
  const { ctx, proxy: { $http, $util } } = getCurrentInstance()
  let routeInfo = useRouter().currentRoute.value.query
  let tableFormTotalList = reactive([])
  let state = reactive({
    detailInfo: {},
    curSelectViewData: {},
    currentModuleId: null, //组件id
    currentTableRowIndex: 0, //索引
    submitLoading: false,
    datePickerValue: $util.dateFormat(new Date(), "yyyy-MM-dd"), //日期
  });
  let popup = reactive({
    radioSelectVisible: false, //单选框
    multipleSelectVisible: false, //多选框
    dateSelectVisible: false, //日期
    signPopupVisible: false,//签名窗口
  });

  onMounted(async () => {
    getModuleDetail()
  })
  const handlePopup = (data, key) => {
    state.curSelectViewData = data;
    switch (key) {
      case 'radio':
        popup.radioSelectVisible = true
        break;
      case 'check':
        popup.multipleSelectVisible = true;
        break;
      case 'date':
        popup.dateSelectVisible = true;
        break;
      default: return false
    }
  }
  const showDateSelect = (item, type) => {
    state.curSelectViewData = item;
    state.openDateType = type;
    popup.dateSelectVisible = true;
  }
  const showSignPopup = (item) => {
    state.curSelectViewData = item;
    state.signPopupVisible = true;
  }
  /**
   * 处理名字显示
  */
  const substringName = (name) => {
    return $util.substringName(name)
  }

  const shareDingding = () => { }

  //提交
  const submitApproval = (data) => { }

  //设置审批人员
  const viewAllUserInfo = (data) => { }

  /**
   * 选择回调
   * */
  const selectCallback = (data) => {
    state.detailInfo.control_list.map(item => {
      if (item.id === state.curSelectViewData.id) {
        item.data.value = data;
        storageValueChange(item)
      }
      return item;
    });
  }
  /**
   * 确定日期选择
   * */
  let handleDateConfirm = (value) => {
    state.datePickerValue = $util.dateFormat(new Date(value), "yyyy-MM-dd");
    let dateStr = state.curSelectViewData.data.date_type == '1'
      ? $util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm")
      : $util.dateFormat(new Date(value), "yyyy-MM-dd");
    if (state.openDateType === "start_value") {
      if (state.curSelectViewData.data.end_value && dateStr) {
        if (new Date(dateStr).getTime() > new Date(state.curSelectViewData.data.end_value).getTime()) {
          return Toast(`开始时间要小于结束时间！`);
        }
      }
      state.curSelectViewData.data.start_value = dateStr
    } else if (state.openDateType === "end_value") {
      if (state.curSelectViewData.data.start_value && dateStr) {
        if (new Date(dateStr).getTime() < new Date(state.curSelectViewData.data.start_value).getTime()) {
          return Toast(`结束时间要大于开始时间！`);
        }
      }
      state.curSelectViewData.data.end_value = dateStr
    } else {
      state.curSelectViewData.data.value = dateStr
    }
    if (state.curSelectViewData.data.start_value && state.curSelectViewData.data.end_value) {
      state.curSelectViewData.data.value = [state.curSelectViewData.data.start_value, state.curSelectViewData.data.end_value]
    }
    storageValueChange(state.curSelectViewData)
    popup.dateSelectVisible = false
  }
  /**
   * 组件详情内容
  */
  const getModuleDetail = () => {
    $http.approvalModuleDetail({
      id: routeInfo.id,
      modify_audit_id: routeInfo.modify_audit_id,
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
          return j
        })
        state.detailInfo = obj;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * 缓存改变的值
  */
  const storageValueChange = (info) => {
    let statisticsStatus = false; //表单是否有合计项
    if (tableFormTotalList.length > 0) {
      statisticsStatus = tableFormTotalList[0].list.some(j => j.data.statistics);
    }
    $http.saveEditModule({
      model_id: routeInfo.id,
      model_control_id: info.id,
      value: info.data.value,
      index: tableFormTotalList.length > 0 ? tableFormTotalList[state.currentTableRowIndex].index : '', //表单里面的输入项改变
    }).then(res => {
      if (res.status === "ok") {
        let obj = res.data;
        if (statisticsStatus) {
          detailInfo.process_list = obj.process_list;
          detailInfo.control_list.forEach(j => {
            if (j.id === state.currentModuleId) {
              obj.control_list.forEach(r => {
                if (r.id === state.currentModuleId) {
                  j.data.statistics = r.data.statistics
                }
              })
            }
          });
        }
        if (info.is_condition) { //只有is_condition为true才重新赋值
          detailInfo.process_list = obj.process_list;
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  //签名完成结果
  const signResult = (res) => {
    state.signPopupVisible = false;
    state.curSelectViewData.data.value = res
    storageValueChange(state.curSelectViewData)
  }
</script>

<style scoped lang="scss">
  @import "styles/popup-table-edit.scss";
  @import "styles/index.scss";
</style>