<template>
  <div class="page-wrap">
    <div class="filter-box df-bt">
      <div class="input-box">
        <i class="iconfont icon-sousuo search-icon" @click="getListInfo"></i>
        <input type="text" placeholder="搜索关键字、标题、城市、审批编号" v-model="keyword">
      </div>
      <div class="fitler-type">
        <div class="el-select">
          <div class="el-input el-input--suffix">
            <input type="text" readonly="readonly" v-model="curSelectTypeItem.name" autocomplete="off" placeholder="请选择"
              class="el-input__inner" @click="selectTypeDropdown = !selectTypeDropdown">
            <span class="el-input__suffix">
              <span class="el-input__suffix-inner">
                <i class="iconfont icon-xiala el-select__caret" :class="selectTypeDropdown ? 'is-reverse':''"></i>
              </span>
            </span>
          </div>
          <div class="el-select-dropdown el-popper"
            style="width: 120px; position: absolute; top: 40px; right: 1px; transform-origin: center top; z-index: 2025;"
            x-placement="bottom-start" v-if="selectTypeDropdown">
            <div class="el-scrollbar">
              <div class="el-select-dropdown__wrap el-scrollbar__wrap">
                <ul class="el-scrollbar__view el-select-dropdown__list">
                  <li class="el-select-dropdown__item" v-for="(item, index) in typeList" :key="index"
                    @click="typeChange(item)">
                    <span>{{item.name}}</span></li>
                </ul>
                <div v-if="typeList.length === 0"
                  style="color: #999;text-align:center;line-height: 28px;padding-bottom: 10px;">没有数据</div>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
              </div>
            </div>
            <div x-arrow="" class="popper__arrow"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="approval-wrap">
      <div class="audit-info" v-for="(item,index) in listData" :key="index" @click="listClick(item)">
        <div class="avatar">
          <span class="user-icon">{{item.user_name |substringName}}</span>
        </div>
        <div class="approval-details">
          <div style="flex: 1;">
            <div class="title">{{item.model_name}}</div>
            <div class="date">{{item.create_time}}</div>
            <div>
              <span class="status pass-status" v-if="item.audit_status ===2">{{item.audit_status_msg}}</span>
              <span class="status refuse-status" v-else-if="item.audit_status ===3">{{item.audit_status_msg}}</span>
              <span class="status" v-else>{{item.audit_user_name}}处理中</span>
            </div>
          </div>
          <div style="padding: 5px 10px">
            <i class="iconfont icon-gouxuan select-icon selected" v-if="item.selected"></i>
            <i class="iconfont icon-gouxuanzhong11 select-icon" v-else></i>
          </div>
        </div>
      </div>

      <div v-if="listData.length === 0 && loaded" class="no-data-tips">
        <p>
          <i class="iconfont icon-wushuju no-result"></i>
        </p>
        <p>没找到相关记录！</p>
      </div>
    </div>

    <div class="confirm-box">
      <mt-button type="primary" size="small" @click="confirm">确定</mt-button>
    </div>

  </div>
</template>

<script>
  import { Indicator, Toast, Popup, Button, Checklist } from "mint-ui"; 
  export default { 
    data() {
      return {
        timer: null,
        keyword: '',
        queryInfo: {},
        curSelectTypeItem: {},
        filterVisible: false,
        selectTypeDropdown: false,
        loaded: false,
        listData: [],
        typeList: [],
      };
    },
    props: {
      initData: {
        type: Object,
        default: () => { }
      }
    },
    watch: {
      keyword() {
        this.httpSearchSubmit()
      }
    },
    created() {
      this.getListInfo();
    },
    methods: {
      typeChange(item) {
        this.curSelectTypeItem = item;
        this.selectTypeDropdown = false;
        this.getListInfo();
      },
      listClick(item) {
        this.$set(item, 'selected', !item.selected)
      },
      //搜索
      httpSearchSubmit() {
        //函数节流处理
        clearInterval(this.timer)
        this.timer = setTimeout(() => {
          this.getListInfo();
        }, 800)
      },

      navigateTo(item) {
        this.$router.push({
          path: '/flowDetail',
          query: item
        })
      },

      getListInfo() {
        Indicator.open();
        this.loaded = false;
        this.$http.relationAuditList({
          model_control_id: this.initData.model_control_id || this.initData.id,
          keyword: this.keyword,
          type: this.curSelectTypeItem.id,
          page: 1,
          limits: 30
        }).then(res => {
          if (res.status === "ok") {
            this.listData = res.data.list;
            this.typeList = res.data.type_list;
          } else {
            Toast(res.message)
          }
          Indicator.close();
          this.loaded = true;
        }).catch(error => {
          console.log(error);
        });
      },

      confirm() {
        this.$emit('callback', this.listData.filter(j => j.selected))
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page-wrap {
    width: 100%;
    height: 100%;
    min-height: 100%;
    font-size: 14px;
    padding: 66px 0 60px;
    background: #f8f8f8;

    .filter-box {
      background: #fff;
      padding: 0 15px;
      margin-bottom: 10px;
      height: 56px;
      width: 100%;
      top: 0px;
      left: 0px;
      position: fixed;

      .input-box {
        width: 70%;
        height: 36px;
        line-height: 36px;
        position: relative;

        .search-icon {
          top: 0px;
          left: 10px;
          font-size: 18px;
          color: #666;
          position: absolute;
        }

        input {
          width: 100%;
          height: 100%;
          line-height: 36px;
          background: #f5f5f5;
          padding: 0 10px 0 35px;
          border-radius: 4px;

          &::placeholder {
            color: #b9b9b9;
          }
        }
      }

      .fitler-type {
        width: 27%;

        .el-select {
          width: 100%;
          display: inline-block;
          position: relative;

          .el-select-dropdown {
            position: absolute;
            z-index: 1001;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            box-sizing: border-box;
            margin: 5px 0;
          }

          .el-input__inner {
            border-color: #409eff;
            padding-right: 30px;
            cursor: pointer;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #dcdddf;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 34px;
            line-height: 34px;
            outline: none;
            padding: 0 15px 0 10px;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .el-input__suffix {
            position: absolute;
            height: 100%;
            right: 5px;
            top: 0;
            text-align: center;
            color: #c0c4cc;
            transition: all .3s;
            pointer-events: none;
          }

          .el-input__suffix-inner {
            pointer-events: all;
          }

          .el-select__caret {
            color: #c0c4cc;
            font-size: 16px;
            transition: transform .3s;
            transform: rotate(0deg);
            cursor: pointer;
            position: absolute;
            top: 5px;
            right: 2px;
          }

          .el-select__caret.is-reverse {
            transform: rotate(180deg);
          }

          .el-scrollbar {
            overflow: hidden;
            position: relative;
          }

          .popper__arrow {
            top: -6px;
            right: 30px;
            margin-right: 3px;
            border-top-width: 0;
            border-bottom-color: #ebeef5;
            border-width: 6px;
            filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
          }

          .el-popper .popper__arrow,
          .el-popper .popper__arrow:after {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
          }

          .popper__arrow:after {
            content: " ";
            border-width: 6px;
            top: -5px;
            margin-left: -6px;
            border-top-width: 0;
            border-bottom-color: #fff !important;
          }

          .el-scrollbar__bar {
            position: absolute;
            right: 2px;
            bottom: 2px;
            z-index: 1;
            border-radius: 4px;
            opacity: 0;
            transition: opacity .12s ease-out;
          }

          .el-scrollbar__wrap {
            overflow: scroll;
            height: 100%;
          }

          .el-select-dropdown__wrap {
            max-height: 274px;
          }

          .el-select-dropdown__list {
            list-style: none;
            padding: 6px 0;
            margin: 0;
            max-height: 180px;
            box-sizing: border-box;
          }

          .el-select-dropdown__item {
            font-size: 14px;
            padding: 0 5px 0 10px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;
          }

          .el-select-dropdown__item.hover,
          .el-select-dropdown__item:hover {
            background-color: #f5f7fa;
          }

          .el-scrollbar__bar.is-horizontal {
            height: 6px;
            left: 2px;
          }

          .el-scrollbar__bar.is-vertical {
            width: 6px;
            top: 2px;
          }

          .el-scrollbar__thumb {
            position: relative;
            display: block;
            width: 0;
            height: 0;
            cursor: pointer;
            border-radius: inherit;
            background-color: rgba(144, 147, 153, .3);
            transition: background-color .3s;
          }
        }

        .el-select>.el-input {
          display: block;
          position: relative;
          font-size: 14px;
          width: 100%;
        }

        .el-input input::placeholder {
          color: #a9a9a9;
        }

        .operate-button {
          height: 30px;
          line-height: 30px;
          border-radius: 20px;
          text-align: center;
          border: 1px solid #666;

          .name {
            margin-left: 5px;
          }
        }
      }
    }

    .approval-wrap {
      overflow: auto;
      flex: 1;
      height: 100%;
      /* padding: 0 12px; */
    }

    .audit-info {
      border-radius: 5px;
      background: #fff;
      padding: 10px 12px;
      margin-bottom: 5px;
      display: flex;
      justify-content: flex-start;

      .avatar {
        padding: 5px 10px;
      }

      .user-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        display: inline-block;
        background: #26a2ff;
        border-radius: 50%;
        margin-right: 8px;
      }

      .approval-details {
        font-size: 14px;
        display: flex;
        flex: 1;
        justify-content: space-between;

        .title {
          font-size: 14px;
          margin-bottom: 10px;
        }

        .date {
          font-size: 12px;
        }

        .status {
          font-size: 12px;
          border-radius: 4px;
          display: inline-block;
          color: #ffa114;
        }

        .pass-status {
          color: #67C23A;
        }

        .refuse-status {
          color: #F56C6C;
        }

        .select-icon {
          color: #ccc;
          font-size: 18px;
        }

        .selected {
          color: #409eff;
        }
      }
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

      button {
        width: 90%;
      }
    }

    .no-data-tips {
      text-align: center;
      margin-top: 50px;
      color: #888;

      i {
        font-size: 60px;
        color: #b5b5b5;
      }
    }
  }
</style>