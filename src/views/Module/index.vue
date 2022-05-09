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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted, onActivated, getCurrentInstance, markRaw, defineAsyncComponent } from "vue";
  import { useRouter } from 'vue-router'
  import { useExpose } from '@/composition/use-expose';

  const CurrentCompoent = reactive({
    'single_input': markRaw(defineAsyncComponent(() => import('@/components/module/single-input'))),
    'multiple_input': markRaw(defineAsyncComponent(() => import('@/components/module/multiple-input'))),
  })
  const { ctx, proxy: { $http } } = getCurrentInstance()
  let routeInfo = useRouter().currentRoute?.value?.query
  let tableFormTotalList = reactive([])
  let state = reactive({
    detailInfo: {}
  });

  onMounted(async () => {
    getModuleDetail()
  })

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

  //缓存改变的值
  const storageValueChange = (info) => {
    let statisticsStatus = false; //表单是否有合计项
    if (tableFormTotalList.length > 0) {
      statisticsStatus = tableFormTotalList[0].list.some(j => j.data.statistics);
    }
    $http.saveEditModule({
      model_id: routeInfo.id,
      model_control_id: info.id,
      value: info.data.value,
      index: tableFormTotalList.length > 0 ? tableFormTotalList[this.currentTableRowIndex].index : '', //表单里面的输入项改变
    }).then(res => {
      if (res.status === "ok") {
        let obj = res.data;
        // if (statisticsStatus) {
        //   this.$set(this.detailInfo, 'process_list', obj.process_list)
        //   this.detailInfo.control_list.map(j => {
        //     if (j.id === this.currentModuleId) {
        //       obj.control_list.map(r => {
        //         if (r.id === this.currentModuleId) {
        //           this.$set(j.data, "statistics", r.data.statistics);
        //         }
        //       })
        //     }
        //   });
        // }
        // if (info.is_condition) {
        //   this.$set(this.detailInfo, 'process_list', obj.process_list)
        // }
      }
    }).catch(error => {
      console.log(error);
    });
  }
</script>


<style scoped lang="scss">
  @import "styles/popup-table-edit.scss";
  @import "styles/index.scss";

  /* ::v-deep {

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
  } */
</style>