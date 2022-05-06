<template>
  <div class="flow-user-list">
    <div class="info">
      <span v-if="flowInfo.type === 1">发起</span>
      <span v-if="flowInfo.type === 2">审批</span>
      <span v-if="flowInfo.type === 3">抄送</span>
      <span v-if="flowInfo.type === 6">办理</span>
      <span> {{flowInfo.user.length}} 人</span>
    </div>

    <div class="list-wrap">
      <div class="subitem" v-for="(subitem, _index) in flowInfo.user">
        <div class="wrap">
          <div class="avatar-sign">
            {{subitem.user_name |substringName}}
          </div>
          <div class="user-name">
            {{subitem.user_name}}
          </div>
          <!-- 移除按钮 -->
          <span class="remove-user__button" v-if="subitem.isAdd" @click="flowInfo.user.splice(_index, 1)">
            <i class="iconfont icon-guanbi11 remove-button"></i>
          </span>
        </div>
        <div class="arrange-arrow">
          <i class="iconfont icon-jia1" style="font-size: 12px;" v-if="flowInfo.type === 3"></i>
          <i class="iconfont icon-arrow-left" v-else></i>
        </div>
      </div>

      <div class="add" @click="selectFlowContact()">
        <i class="iconfont icon-jia1"></i>
        <span class="require-icon" v-if="flowInfo.type !== 3 && flowInfo.user.length === 0">*</span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as dd from "dingtalk-jsapi";
  export default {
    data() {
      return {
        flowInfo: {},
        userType: {
          1: '发起人',
          2: '审批人',
          3: '抄送人',
          6: '办理人',
        }
      };
    },
    props: ["dataInfo"],
    created() {
      this.flowInfo = this.dataInfo;
      // document.title = this.userType[this.flowInfo.type];)
    },
    methods: {
      // 设置审批人
      selectFlowContact() {
        let self = this;
        this.$http.dd_config().then(res => {
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
                self.flowInfo.user = [...self.flowInfo.user, ...result.users];

              },
              onFail: function (err) {
                console.log(err);
              }
            });
          });
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .flow-user-list {
    width: 100%;
    height: 100%;
    font-size: 14px;
    padding: 20px 15px 30px;
    min-height: 250px;
    max-height: 450px;
    overflow: auto;

    .info {
      color: #898989;
      margin-bottom: 20px;
    }

    .list-wrap {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .subitem {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;

        .avatar-sign {
          width: 36px;
          height: 36px;
          line-height: 38px;
          font-size: 12px;
          color: #fff;
          text-align: center;
          display: inline-block;
          background: #26a2ff;
          border-radius: 50%;
          overflow: hidden;
        }

        .user-name {
          font-size: 12px;
          text-align: center;
          color: #999;
          line-height: 20px;
        }

        .arrange-arrow {
          padding: 8px 3px 0;
          color: #c9c9c9;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          .remove-user__button {
            position: absolute;
            top: -4px;
            right: -1px;
            width: 10px;
            height: 10px;
            line-height: 14px;
            background: #fff;
            border-radius: 50%;
            text-align: center;

            .remove-button {
              font-size: 14px;
              color: #333;
            }
          }
        }
      }

      .add {
        width: 36px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border: 1px dashed #409eff;
        border-radius: 50%;
        color: #409eff;
        position: relative;

        i {
          font-size: 18px;
        }
      }
    }
  }
</style>