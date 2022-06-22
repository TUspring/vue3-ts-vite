
/**
 * 8、图片
 * 
 * 组件key: picture
 * */
import "../styles/module.scss";
import * as dd from "dingtalk-jsapi";
import UploadBox from "@/components/upload/index.vue";
import { defineComponent, ref, reactive } from 'vue';

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
    //移除选项
    let removeArrayValue = (event: any, item: any, index: number) => {
      item.data.value.splice(index, 1)
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
      if (url.includes('.tif') || url.includes('.TIF')) {
        var useUrl = `${baseUrl}/api/get_image?url=${encodeURI(url)}`;
        dd.biz.util.previewImage({
          urls: [useUrl],//图片地址列表
          current: encodeURI(url),//当前显示的图片链接
          onSuccess: function (result) { },
          onFail: function (err) { }
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
        imgLoad(url, imgInfoCallback);
      }
    }
    let imgInfoCallback = (width: number | string, height: number | string, url: string) => {
      //钉钉微应用预览api在安卓设备上，如果图片尺寸很大会出现第一次看不到图片，再次打开预览才能看到， 判断当图片尺寸超过3000，用后端接口处理。
      var useUrl = width > 3000 ? `${baseUrl}/api/get_image?url=${encodeURI(url)}&size=${width}` : encodeURI(url);
      dd.biz.util.previewImage({
        urls: [useUrl],//图片地址列表
        current: encodeURI(url),//当前显示的图片链接
        onSuccess: function (result) { },
        onFail: function (err) { }
      })
    }
    let showUpload = (item: any, key: string) => { }

    const uploadCallback = (url: string) => {
      item.data.value = item.data.value ? [...item.data.value, url] : [url]
      emit('changeCallback', item)
    }

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
            item.data.value && item.data.value.length > 0 ?
              item.data.value.map((path: string, index: number) => {
                return (
                  <div class="images-item">
                    <img src={imageFormat(path)} onClick={() => viewPhoto(`${baseUrl}${path}`)} />
                    <i class="iconfont icon-guanbi11 close-icon remove-img-icon" onClick={(e) => removeArrayValue(e, item, index)}></i>
                  </div>
                )
              })
              : null
          }
          {/* 最多上传9张图片 */}
          {
            !item.data.value || item.data.value.length <= 8
              ? <div class="add-box" onClick={() => showUpload(item, 'img')} >
                <i class="iconfont icon-jia1 add-icon"></i>
                <div class="upload-box">
                  <UploadBox type="image" onUploadCallback={uploadCallback}></UploadBox>
                </div >
              </div >
              : null
          }
        </div>
      </div >
    )
  },
});