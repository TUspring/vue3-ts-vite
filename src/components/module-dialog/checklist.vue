<template>
  <div class="popup-select-box">
    <div class="popup-box__head df-bt">
      <div class="close-popup" @click="close">
        <i class="iconfont icon-xiala"></i>
      </div>
      <div class="title">多选项</div>
      <div >
        <mt-button type="primary" size="small" @click="confirm">确定</mt-button>
        
      </div>
    </div>
    <div style="padding-bottom: 50px;max-height: 400px;overflow: auto;">
      <mt-checklist v-model="selectedValue" :options="optionData"></mt-checklist>
      <div>
        <input class="add-input-box" type="text" placeholder="自定义" v-model="addValue" />
        <span class="add-btn" @click="submit">增加</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { Checklist } from 'mint-ui';
  export default {
    data() {
      return {
        addValue: '',
        selectedValue:[],
        optionData: [],
      }
    },
    props:{
      initData:{
        type: Object,
        default: ()=> {}
      }
    },
    mounted() {
      this.optionData = this.initData.data.option;
      let arr = this.initData.data.value || this.initData.value;
      this.selectedValue = arr ? arr : [];
    },
    methods: {
      confirm(){
        this.$emit('selectCallback', this.selectedValue)
        this.close()
      },
      submit(){
        this.initData.data.option.push(this.addValue)
      },
      close(){
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
        height: 100%;
        width: 40px;
        line-height: 40px;
        text-align: center;

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
  .add-input-box {
    width: 150px;
    height: 32px;
    font-size: 14px;
    display: inline-block;
    padding: 0 10px;
    margin-left: 20px;
    margin-top: 10px;
    border-bottom: 1px solid #e5e5e5;
  }
  .add-input-box::placeholder{
    color: #c9c9c9;
  }
  .add-btn {
    display: inline-block;
    background: #409eff;
    padding: 3px 8px;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
  }

  ::v-deep{
    .mint-cell-wrapper{
      background-image: none;
      border-bottom: 1px solid #eee;
    }
  }
</style>