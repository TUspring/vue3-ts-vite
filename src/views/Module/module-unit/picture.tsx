
/**
 * 8、图片
 * 
 * 组件key: picture
 * */
import "../styles/module.scss";
import * as dd from "dingtalk-jsapi";
import UploadBox from "@/components/upload/index.vue";
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  setup(props: any, { emit }) {
    let { item } = props;
    const baseUrl = JSON.parse(localStorage.getItem("ENV_HTTP") as string)
    let showDateSelect = (item: any) => {
      emit('handleSelectPopup', item, 'date')
    }

    //移除选项
    let removeValue = (event: any, item: any) => {
      item.data.value = '';
      event.stopPropagation();//阻止冒泡
    }
    /**
    * 图片格式化
   */
    let imageFormat = (path: string) => {
      if (['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'tif', 'TIF', 'bmp', 'BMP'].includes(path.substring(path.lastIndexOf('.') + 1))) {
        return `${baseUrl}/api/get_image?url=${baseUrl}${encodeURIComponent(path)}&size=300`
      } else {
        return ''
      }
    }
    let viewPhoto = (url: string) => {
      let that = this;
      if (url.includes('.tif') || url.includes('.TIF')) {
        var useUrl = `${baseUrl}/api/get_image?url=${encodeURI(url)}`;
        dd.biz.util.previewImage({
          urls: [useUrl],//图片地址列表
          current: encodeURI(url),//当前显示的图片链接
          onSuccess: function (result) { },
          onFail: function (err) {
          }
        })
      } else {
        var imgWidth = 0,
          imgHeight = 0,
          callback = null;
        var imgLoad = function (url: string, callback: any) {
          var img = new Image();
          img.src = encodeURI(url);
          if (img.complete) {
            callback(img.width, img.height, url);
          } else {
            img.onload = function () {
              callback(img.width, img.height, url);
              img.onload = null;
            };
          };
        };
        // imgLoad(url,  this.imgInfoCallback);
      }
    }

    let showUpload = (item:any, key:string) => { }
    return () => (
      <div class="component-view input-item-view" >
        <div class="item-label">
          {
            item.data.required
              ? <span class="required-icon">*</span>
              : null
          }
          {item.data.title}
        </div>
        <div class="images-list">
          {
            item.data.value.map((path: any, i: number) => {
              item.data.value && item.data.value.length > 0
                ? <div class="images-item">
                  <img src={imageFormat(path)} onClick={() => viewPhoto(`${baseUrl}${path}`)} />
                  <i class="iconfont icon-guanbi11 close-icon remove-img-icon" onClick={(e) => removeValue(e, item)}></i>
                </div>
                : null
            })
          }
          {/* 最多上传9张图片 */}
          {
            !item.data.value || item.data.value.length <= 8
              ? <div class="add-box" onClick={() => showUpload(item, 'img')} >
                <i class="iconfont icon-jia1 add-icon"></i>
                <div class="upload-box">
                  {/* @uploadCallback="uploadCallback"  */}
                  <UploadBox type="image"></UploadBox>
                </div >
              </div >
              : null
          }
        </div>
      </div>
    )
  },
});