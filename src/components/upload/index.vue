<template>
  <div class="upload-input">
    <van-uploader :after-read="afterRead" :accept="type === 'image'? 'image/*': '{accept}'"
      style="width:100%;height: 100%;opacity:0" />
  </div>
</template>

<script>
  import { Toast } from 'vant';
  import http from "@/api/index";
  export default {
    data() {
      return {
      };
    },
    props: ["type", "modelId", "budgetApplyId"], //type等于image为图片类型，不传为所有类型,  modelId:模板id， budgetApplyId：预算申请id
    mounted() { },
    methods: {
      afterRead(file) {
        // 此时可以自行将文件上传至服务器
        if (Array.isArray(file)) { //如果选择多张会返回一个数组
          file.map(j => {
            this.uploadFiles(j, j.file.name);
          })
        } else {
          let files = file.file;
          if (!files) {
            return Toast("请选择上传文件！");
          }
          this.uploadFiles(file, files.name);
        }
      },

      uploadFiles(file, fileName) {
        if (!/\.(gif|jpg|jpeg|png|bmp|tif)$/.test(fileName.toLowerCase()) && this.type == "image") {
          return Toast("只能上传图片文件！");
        }
        let formData = new FormData();
        http.uploadFile({
          name: fileName,
          file: file.content,
          model_id: this.modelId ? this.modelId : '',
          budget_apply_id: this.budgetApplyId ? this.budgetApplyId : '',
        }).then(res => {
          if (res.status === "ok") {
            Toast("上传成功！");
            // emit 子组件向父组件传值
            this.$emit('uploadCallback', res.data.url);
          } else {
            Toast(res.message);
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }
  };
</script>


<style scoped lang="scss">
  .upload-input {
    width: 100%;
    height: 100%;
  }

  ::v-deep {
    input {
      top: 0;
      left: 0;
      width: 100%;
      height: 50px;
      position: absolute;
    }
  }
</style>