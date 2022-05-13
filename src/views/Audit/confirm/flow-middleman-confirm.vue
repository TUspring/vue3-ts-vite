<template>
  <!-- 办理人确认 -->
  <div class="confirm-page">
    <div class="input-textarea-box">
      <textarea class="textarea" placeholder="请输入办理意见" v-model="remark"></textarea>
    </div>

    <div class="footer-box">
      <div class="tips" v-if="detailInfo.userList && detailInfo.userList.length > 0">
        <i class="iconfont icon-xuanzhong select-icon"></i> 审批意见通过聊天转发给 <span
          class="user-name">{{detailInfo.userList.map(j=>j.name).join(',')}}</span>
      </div>
      <div class="confirm-button" @click="submitAudit">确认办理</div>
    </div>


  </div>
</template>

<script>
  import { Indicator, Toast } from "mint-ui";
  export default {
    data() {
      return {
        remark: '',
        detailInfo: {},
      };
    },

    mounted() {
      this.detailInfo = this.$route.query;
    },
    methods: {
      submitAudit() {
        this.$http.submitAudit({
          id: this.detailInfo.id,
          status: 1,
          remark: this.remark,
          sign: this.resultImg,
          content_list: this.detailInfo.content_list
        }).then(res => {
          if (res.status === "ok") {
            Toast('提交成功！');
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000)
          } else {
            Toast(res.message)
          }
          this.confirmLoading = false;
        }).catch(error => {
          this.confirmLoading = false;
          console.log(error);
        });
      },

    },
  };
</script>

<style lang="scss" scoped>
  .confirm-page {
    width: 100%;
    height: 100%;
    background: #fff;

    .input-textarea-box {
      width: 100%;
      height: 100%;
      padding-bottom: 80px;

      .textarea {
        width: 100%;
        height: 100%;
        padding: 12px;
        border: none;
        font-size: 16px;
        color: #353535;
        letter-spacing: 1px;

        &:focus {
          border: none;
          outline: none;
        }

        &::placeholder {
          color: #999;
          font-size: 16px;
        }
      }
    }

    .footer-box {
      width: 100%;
      bottom: 0;
      left: 0;
      position: fixed;
      padding: 8px 15px 12px;
      background: #fff;
      border-top: 1px solid #eee;
      text-align: center;

      .tips {
        color: #898989;
        text-align: left;
        margin-bottom: 10px;

        .select-icon {
          color: #409eff;
        }

        .user-name {
          color: #61709a;
        }
      }

      .confirm-button {
        border: 1px solid #409eff;
        height: 44px;
        line-height: 44px;
        background: #409eff;
        border-radius: 28px;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
        overflow: hidden;
        text-align: center;
      }
    }
  }
</style>