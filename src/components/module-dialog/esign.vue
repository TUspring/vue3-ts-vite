<template>
  <div class="popup-sign-box" ref="pageView">
    <!-- <div class="sign-box__head df-bt">
      <div @click="handleCancel">取消</div>
      <div class="title">手写签名</div>
      <div>
        <mt-button type="primary" size="small" @click="handleGenerate">完成</mt-button>
      </div>
    </div> -->
    <!-- <div class="sign-area">
      <div class="operate-icon">
        <i class="iconfont icon-eraser-o" @click="handleReset"></i>
        <i class="iconfont icon-quanping"></i>
      </div>
      <vue-esign ref="esign" v-if="showEsign" :width="screenWidth" :height="200" style="border: 1px dashed #d5d5d5;border-radius: 4px;"
        :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" />
    </div> -->

    <div class="full-screen-box">
      <vue-esign class="esign-canvas" v-if="showEsign" ref="esign" :width="Number(offsetWidth)" :height="Number(offsetHeight)"
        :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" />
      <div class="operate-button">
        <i class="iconfont icon-eraser-o full-screen__reset-icon" @click="handleReset"></i>
        <mt-button type="primary" size="small" @click="handleGenerate">完成</mt-button>
        <mt-button type="default" size="small" @click="handleCancel">返回</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  
  export default {
    data() {
      return {
        lineWidth: 6,
        lineColor: '#000000',
        bgColor: '#fff',
        resultImg: '',
        isCrop: false,
        showEsign: false,
        offsetHeight: '', //页面高度
        offsetWidth: '', //页面宽度
      }
    },
    mounted() {
      this.offsetHeight = this.$refs.pageView.offsetHeight - 20;
      this.offsetWidth = this.$refs.pageView.offsetWidth - 20;
      console.log(this.offsetHeight)
      console.log(this.offsetWidth)
      this.showEsign = true;
    },
    methods: {
      handleCancel() {
        this.$refs.esign.reset()
        this.$emit('close')
      },
      handleReset() {
        this.$refs.esign.reset()
      },
      handleGenerate() {
        this.$refs.esign.generate().then(res => {
          this.rotateBase64Img(res, 270, this.callback);
        }).catch(err => {
          console.log(err) // 画布没有签字时会执行这里 'Not Signned'
        })
      },
      callback(base64data) {
        this.resultImg = base64data;
        this.$emit('esignCallback', this.resultImg)
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
    }
  }
</script>

<style lang="scss" scoped>
  .popup-sign-box {
    width: 100%;
    height: 100%;
    min-height: 200px;
    position: relative;
    .sign-box__head {
      padding: 8px 15px;
      border-bottom: 1px solid #eee;

      .title {
        font-weight: bold;
      }
    }

    .sign-area {
      padding: 10px 15px 30px;
      width: 100%;
      position: relative;

      .operate-icon {
        top: 12px;
        right: 20px;
        position: absolute;

        i {
          font-size: 24px;
          color: #d8d8d8;
          margin-left: 10px;
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
        left: -60px;
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
        ::v-deep{
          button{
            height: 36px;
            line-height: 36px;
            padding: 0 20px;
            margin-right: 8px;
          }
        }
      }
    }
  }
</style>