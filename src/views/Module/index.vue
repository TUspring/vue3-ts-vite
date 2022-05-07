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
        <div class="component-view input-item-view df-bt" v-if="item.key ==='single_input'">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            <div>{{item.data.title}}</div>
          </div>
          <div class="item-input">
            <input class="input-box" type="text" :placeholder="item.data.tips" v-model="item.data.value"
              @blur="storageValueChange(item)" />
          </div>
        </div>
        <!-- 2、多行输入框 -->
        <div class="component-view input-item-view" v-if="item.key ==='multiple_input'">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div class="item-input-many">
            <textarea class="input-textarea-box" rows="4" :placeholder="item.data.tips" v-model="item.data.value"
              @blur="storageValueChange(item)"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted, onActivated, getCurrentInstance } from "vue";
  import { useRouter } from 'vue-router'
  const { ctx, proxy: { $http } } = getCurrentInstance()

  // import CityPicker from "@/components/module/button.tsx";
  let state = reactive({
    detailInfo: {}
  });

  onMounted(async () => {
    let routeInfo = useRouter().currentRoute.value.query
    console.log(routeInfo)

    getModuleDetail(routeInfo)
  })

  const getModuleDetail = (routeInfo) => {
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
        // detailInfo = obj;
        state.detailInfo = obj;
        console.log(state.detailInfo.name)

      }
    }).catch(error => {
      console.log(error);
    });
  }
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