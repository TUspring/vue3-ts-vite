<template>
  <div class="popup-select-box">
    <div class="popup-box__head df-bt">
      <div class="close-popup" @click="close">
        <i class="iconfont icon-xiala"></i>
      </div>
      <div class="title">多选项</div>
      <div>
        <van-button type="primary" size="small" @click="confirm">确定</van-button>
      </div>
    </div>
    <div class="popup-content">
      <van-checkbox-group v-model="selectedValue" class="select-group">
        <van-checkbox class="subitem" :name="item" v-for="(item, index) in optionData" :key="index">
          {{item}}
        </van-checkbox>
      </van-checkbox-group>
      <div>
        <input class="add-input-box" type="text" placeholder="自定义" v-model="addValue" />
        <span class="add-btn" @click="submit">增加</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { reactive, defineComponent, onMounted, toRefs } from 'vue'
  export default defineComponent({
    props: {
      initData: {
        type: Object,
        default: () => { }
      }
    },
    setup(props, contex) {
      const dataMap = reactive({
        addValue: '',
        selectedValue: [],
        optionData: [],
      })

      onMounted(async () => {
        dataMap.optionData = props.initData.data.option;
        let arr = props.initData.data.value || props.initData.value;
        dataMap.selectedValue = arr ? arr : [];
      })

      const confirm = () => {
        contex.emit('selectCallback', dataMap.selectedValue)
        setTimeout(() => {
          close()
        }, 500);
      }
      const submit = () => {
        props.initData.data.option.push(dataMap.addValue)
      }
      const close = () => {
        contex.emit('close')
      }

      return {
        ...toRefs(dataMap),
        confirm,
        submit,
        close
      }
    }
  })
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

    .select-group {
      padding: 0 16px;

      .subitem {
        border-bottom: 1px solid #f1f1f1;
        padding-bottom: 6px;
        margin-bottom: 10px;
      }
    }
  }

  .popup-content {
    padding-bottom: 50px;
    max-height: 400px;
    overflow: auto;
    padding-top: 10px;
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

  .add-input-box::placeholder {
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
</style>