<template>
  <!-- 选择申请部门组件 -->
  <div class="popup-select-box">
    <div class="popup-box__head">
      <div class="close-popup" @click="close">
        <i class="iconfont icon-xiala"></i>
      </div>
      <div class="title">选择部门</div>
    </div>
    <div style="padding-bottom: 50px;max-height: 400px;overflow: auto;">
      <mt-radio v-model="selectedValue" :options="optionData" @change="selectChange"></mt-radio>
    </div>
  </div>
</template>

<script>
  import { Radio } from 'mint-ui';
  export default {
    data() {
      return {
        selectedValue: '',
        optionData: []
      }
    },
    props: {
      initData: {
        type: Object,
        default: () => { }
      }
    },

    mounted() {
      this.optionData = this.initData.data.department.map(j => j.label);
      this.selectedValue = this.initData.data.department.filter(j => j.id === this.initData.data.value || j.id === this.initData.value).map(o => o.label).join(',')
    },
    methods: {
      selectChange() {
        let ids = this.initData.data.department.filter(j => j.label === this.selectedValue).map(o => o.id).join(',')
        this.$emit('selectCallback', ids)
        this.close()
      },
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-select-box {
    width: 100%;
    min-height: 200px;

    .popup-box__head {
      padding: 8px 15px;
      text-align: center;
      border-bottom: 1px solid #eee;
      position: relative;

      .close-popup {
        top: 0;
        left: 5px;
        height: 100%;
        width: 40px;
        line-height: 40px;
        text-align: center;
        position: absolute;

        i {
          font-size: 20px;
          color: #333;
        }
      }

      .title {
        font-weight: bold;
      }
    }
  }

  ::v-deep {
    .mint-cell-wrapper {
      background-image: none;
      border-bottom: 1px solid #eee;
    }
  }
</style>