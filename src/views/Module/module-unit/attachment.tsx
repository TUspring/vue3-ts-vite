
/**
 * 12、附件
 * 
 * 组件key: attachment
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

    //附件预览
    let previewFile = (src: string, path: string) => {
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        console.log('手机端')
        //手机端
        const a = document.createElement('a'); // 创建a标签
        a.setAttribute('href', src);// href链接
        a.click();// 自执行点击事件
      } else {
        console.log('pc端')
        //pc端
        window.open(`${baseUrl}/api/preview_file?url=${baseUrl}/${encodeURIComponent(path)}`, '_blank')
      }
    }

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
        <div class="files-list">
          {
            item.data.value && item.data.value.length > 0 ?
              item.data.value.map((path: string, index: number) => {
                return (
                  <div class="file-item df-left" onClick={() => previewFile(`${baseUrl}${path}`, `${path}`)} >
                    <div class="upload-type__icon df-m">
                      {
                        ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'tif', 'TIF', 'bmp', 'BMP'].includes(path.substring(path.lastIndexOf('.') + 1))
                          ? <i class="iconfont icon-tupian icon"></i>
                          : <i class="iconfont icon-wenjian1 icon"></i>
                      }
                    </div>
                    <div class="file-info">
                      <p class="file-name">{path.substring(path.lastIndexOf('/') + 1)}</p>
                      <div class="file-remove">
                        <i class="iconfont icon-guanbi11 close-icon" onClick={(e) => removeArrayValue(e, item, index)}></i>
                      </div>
                    </div>
                  </div>
                )
              })
              : null
          }
          {/* 最多上传9张图片 */}
          {
            !item.data.value || item.data.value.length <= 8
              ? <div class="add-box">
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