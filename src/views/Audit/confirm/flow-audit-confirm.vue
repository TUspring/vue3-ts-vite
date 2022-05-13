<template>
  <!-- 审批确认 -->
  <div class="confirm-page" ref="fullScreenView">
    <div class="input-textarea-box">
      <!-- '请输入意见' -->
      <textarea class="textarea" :placeholder="placeholderFormat" v-model="remark"></textarea>
    </div>

    <div class="footer-box">
      <!-- 手签 -->
      <div v-if="detailInfo.is_signature == '1' && detailInfo.status == '1'">
        <div class="sign-img" v-if="resultImg">
          <img :src="resultImg" alt="" style="width: 100%;height: 200px;">
          <div class="operate-sign">
            <i class="iconfont icon-qianming reset-sign" @click="handleShowFullScreenSign"></i>
            <i class="iconfont icon-yichu2 remove-sign" @click="resultImg = ''"></i>
          </div>
        </div>
        <div v-else class="sign-area" @click="handleShowFullScreenSign">
          <p><i class="iconfont icon-qianming icon"></i> 点击签名</p>
          <div class="sign-bg-watermark">
            <span v-for="(item, index) in 50" :key="index">手写签名</span>
          </div>
        </div>
      </div>

      <div class="tips">
        <i class="iconfont icon-xuanzhong select-icon"></i> 审批意见通过聊天转发给 <span
          class="user-name">{{detailInfo.user_name}}</span>
      </div>

      <div class="confirm-button" @click="httpAudit">
        {{detailInfo.status == '2' ? '确认拒绝':'确认同意'}}
      </div>
    </div>

    <div class="full-screen-box" v-if="showFullScreenSign">
      <vue-esign class="esign-canvas" ref="esign" :width="Number(offsetWidth)" :height="Number(offsetHeight)"
        :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="fullScreenBgColor" />
      <div class="operate-button">
        <i class="iconfont icon-eraser-o full-screen__reset-icon" @click="handleReset"></i>
        <i class="iconfont icon-chexiao full-screen__reset-icon" @click="showFullScreenSign = false"></i>
        <mt-button type="primary" size="small" @click="handleComplete">完成</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Indicator, Toast } from "mint-ui";
  import * as dd from "dingtalk-jsapi";
  export default {
    data() {
      return {
        lineWidth: 6,
        lineColor: '#000000',
        fullScreenBgColor: '#fafcfb',
        resultImg: '',
        isCrop: false,
        showFullScreenSign: false,
        remark: '',
        confirmLoading: false,
        detailInfo: {},
        offsetHeight: '', //页面高度
        offsetWidth: '', //页面宽度
      };
    },

    created() {
      this.detailInfo = this.$route.query;
      document.title = this.detailInfo.status == '2' ? '确认拒绝' : '确认同意';
      this.remark = this.detailInfo.status == '1' ? '同意。' : ''; //同意状态默认加上
      dd.biz.navigation.setTitle({
        title: this.detailInfo.status == '2' ? '确认拒绝' : '确认同意',//控制标题文本，空字符串表示显示默认文本
        onSuccess: function (result) { },
        onFail: function (err) { }
      });
    },
    mounted() {
      this.offsetHeight = this.$refs.fullScreenView.offsetHeight - 20;
      this.offsetWidth = this.$refs.fullScreenView.offsetWidth - 20;
    },
    computed: {
      placeholderFormat() {
        if (this.detailInfo.status == '1') {
          return this.detailInfo.approval_prompt ? this.detailInfo.approval_prompt : '请输入审批意见'
        } else {
          return this.detailInfo.refuse_approval_prompt ? this.detailInfo.refuse_approval_prompt : '请输入拒绝理由'
        }
      },
    },
    methods: {
      handleShowFullScreenSign() {
        setTimeout(() => {
          this.showFullScreenSign = true;
        }, 100)
      },
      httpAudit() {
        // if (this.detailInfo.prompt_required == '1' && this.detailInfo.status == '1' && !this.remark) {
        //   return Toast('请输入审批意见');
        // }
        // if (this.detailInfo.refuse_prompt_required == '1' && this.detailInfo.status == '2' && !this.remark) {
        //   return Toast('请输入拒绝理由');
        // }
        //同意状态下是否需要签名 is_signature： 1需要， 0不需
        if (this.detailInfo.status == '1' && this.detailInfo.is_signature == '1' && !this.resultImg) {
          return Toast('请填写签名！');
        }
        if (this.confirmLoading) return false;
        this.confirmLoading = true;
        this.$http.submitAudit({
          id: this.detailInfo.id,
          status: this.detailInfo.status,
          remark: this.remark,
          sign: this.resultImg,
        }).then(res => {
          if (res.status === "ok") {
            Toast('提交成功！');
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000)
          } else {
            Toast(res.message)
          }
          setTimeout(() => {
            this.confirmLoading = false;
          }, 2000)
        }).catch(error => {
          this.confirmLoading = false;
          console.log(error);
        });
      },
      handleReset() {
        this.$refs.esign.reset()
      },
      handleComplete() {
        this.$refs.esign.generate().then(res => {
          this.rotateBase64Img(res, 270, this.callback);
        }).catch(err => {
          this.resultImg = '';
          console.log(err) // 画布没有签字时会执行这里 'Not Signned'
        })
        this.showFullScreenSign = false;
      },

      callback(base64data) {
        this.resultImg = base64data;
      },
      rotateBase64Img(src, edg, callback) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var imgW;//图片宽度
        var imgH;//图片高度
        var size;//canvas初始大小
        if (edg % 90 != 0) {
          console.error("旋转角度必须是90的倍数!");
          throw '旋转角度必须是90的倍数!';
        }
        (edg < 0) && (edg = (edg % 360) + 360)
        const quadrant = (edg / 90) % 4; //旋转象限
        const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; //裁剪坐标
        var image = new Image();
        image.crossOrigin = "anonymous"
        image.src = src;
        image.onload = function () {
          imgW = image.width;
          imgH = image.height;
          size = imgW > imgH ? imgW : imgH;
          canvas.width = size * 2;
          canvas.height = size * 2;
          switch (quadrant) {
            case 0:
              cutCoor.sx = size;
              cutCoor.sy = size;
              cutCoor.ex = size + imgW;
              cutCoor.ey = size + imgH;
              break;
            case 1:
              cutCoor.sx = size - imgH;
              cutCoor.sy = size;
              cutCoor.ex = size;
              cutCoor.ey = size + imgW;
              break;
            case 2:
              cutCoor.sx = size - imgW;
              cutCoor.sy = size - imgH;
              cutCoor.ex = size;
              cutCoor.ey = size;
              break;
            case 3:
              cutCoor.sx = size;
              cutCoor.sy = size - imgW;
              cutCoor.ex = size + imgH;
              cutCoor.ey = size + imgW;
              break;
          }
          ctx.translate(size, size);
          ctx.rotate(edg * Math.PI / 180);
          ctx.drawImage(image, 0, 0);
          var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
          if (quadrant % 2 == 0) {
            canvas.width = imgW;
            canvas.height = imgH;
          } else {
            canvas.width = imgH;
            canvas.height = imgW;
          }
          ctx.putImageData(imgData, 0, 0);
          callback(canvas.toDataURL())
        };
      }
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
      background: pink;

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

    .sign-area {
      width: 100%;
      height: 100px;
      position: relative;
      background: #fafcfb;
      border: 1px dashed #d5d5d5;
      border-radius: 4px;
      margin-bottom: 10px;
      font-size: 18px;
      color: #bfbfbf;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      .sign-bg-watermark {
        width: 100%;
        height: 100%;
        line-height: 60px;
        font-size: 14px;
        top: 0;
        left: 0;
        position: absolute;

        span {
          opacity: 0.2;
          color: #cccccca1;
          white-space: nowrap;
          display: inline-block;
          padding: 0 40px 0 20px;
          transform: rotate(-30deg);
        }
      }

      .icon {
        font-size: 18px;
      }

      .reset-icon {
        bottom: 15px;
        right: 15px;
        position: absolute;
      }

      .full-screen-icon {
        top: 5px;
        right: 10px;
        position: absolute;
      }
    }

    .sign-img {
      border-radius: 4px;
      border: 1px dashed #d5d5d5;
      margin-bottom: 10px;
      position: relative;

      .operate-sign {
        top: 0;
        right: 0;
        position: absolute;
        padding: 5px;

        .reset-sign {
          padding: 10px;
          font-size: 22px;
          color: #0088fe;
        }

        .remove-sign {
          padding: 10px;
          font-size: 18px;
          color: #0088fe;
        }
      }
    }

    .full-screen-box {
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      position: fixed;
      z-index: 9;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      .esign-canvas {
        border-radius: 4px;
        border: 1px dashed #d5d5d5;
      }

      .operate-button {
        left: -30px;
        bottom: 100px;
        position: absolute;
        display: flex;
        align-items: center;
        transform: rotate(90deg);

        .full-screen__reset-icon {
          color: #409eff;
          font-size: 20px;
          padding: 5px 10px;
          margin-right: 10px;
        }
      }
    }
  }
</style>