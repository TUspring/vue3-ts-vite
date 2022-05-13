<template>
  <div class="popup-filter-box">
    <div class="popup-box__head">
      <div class="close-popup" @click="close">
        <i class="iconfont icon-xiala"></i>
      </div>
      <div class="title">筛选</div>
    </div>
    <div class="content-wrap">
      <div v-if="listType != 1">
        <div>状态</div>
        <div class="form-info">
          <span class="subitem status-item" :class="item.selected ? 'current': ''" v-for="(item,index) in statusList"
            @click="selectStatus(item)">{{item.name}}</span>
        </div>
      </div>
      <div>
        <div>表单</div>
        <div class="form-info">
          <span class="subitem" :class="item.selected ? 'current': ''" v-for="(item,index) in initData"
            @click="selectFormType(item)">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="confirm-box">
      <mt-button type="default" size="small" style="margin-right: 10px" @click="reset">重置</mt-button>
      <mt-button type="primary" size="small" @click="confirm">确定</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        optionData: [],
        statusList: [
          { id: 0, name: '全部', selected: true },
          { id: 1, name: '审批完成', selected: false },
          { id: 2, name: '审批中', selected: false },
          { id: 3, name: '已撤销', selected: false },
        ]
      }
    },
    props: {
      listType: {
        type: [Number, String],
        default: null
      },
      initData: {
        type: Array,
        default: () => []
      },
      searchForm: {
        type: Object,
        default: () => { }
      },
    },
    mounted() {
      console.log(this.listType)
      if (this.searchForm.group_id) {
        this.initData.map(j => {
          this.$set(j, 'selected', j.id == this.searchForm.group_id ? true : false)
        })
      }
      if (this.searchForm.status) {
        this.statusList.map(j => {
          this.$set(j, 'selected', j.id == this.searchForm.status ? true : false)
        })
      }
    },
    methods: {
      confirm() {
        this.$emit('selectCallback', {
          group_id: this.initData.filter(j => j.selected).map(h => h.id).join(','),
          status: this.statusList.filter(j => j.selected).map(h => h.id).join(','),
        })
        this.close()
      },
      selectStatus(item) {
        this.statusList.map(j => {
          this.$set(j, 'selected', j.id === item.id ? true : false)
        })
      },
      selectFormType(item) {
        this.initData.map(j => {
          this.$set(j, 'selected', j.id === item.id ? !j.selected : false)
        })
      },
      reset() {
        this.statusList.map(j => {
          this.$set(j, 'selected', j.id === 0 ? true : false)
        })
        this.initData.map(j => {
          this.$set(j, 'selected', false)
        })
      },
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-filter-box {
    width: 100%;
    min-height: 200px;
    padding-bottom: 60px;

    .popup-box__head {
      padding: 8px 15px;
      text-align: center;
      border-bottom: 1px solid #eee;
      position: relative;
      text-align: center;

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

    .sign-area {
      padding: 10px 15px;
      width: 100%;

      .sign-canvas {}
    }

    .confirm-box {
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 60px;
      position: absolute;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-top: 1px solid #eee;
    }

    .content-wrap {
      padding: 15px;
      max-height: 400px;
      overflow: auto;

      .form-info {
        margin-top: 10px;
      }

      .subitem {
        width: 48%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border: 1px solid #d5d5d5;
        display: inline-block;
        border-radius: 6px;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 5px;
        box-sizing: border-box;
        &:nth-child(2n) {
          margin-left: 2%;
        }
      }

      .status-item {
        width: 30%;
        margin-left: 2%;
      }

      .current {
        color: #fff;
        border: 1px solid #409eff;
        background: #409eff;
      }
    }
  }

  ::v-deep {
    .mint-cell-wrapper {
      background-image: none;
      border-bottom: 1px solid #eee;
    }

    .mint-button--small {
      padding: 0 40px;
      height: 40px;
      line-height: 40px;
    }
  }
</style>