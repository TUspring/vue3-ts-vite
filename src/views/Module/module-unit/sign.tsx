
/**
 * 14、手写签名 
 * 
 * 组件key: sign
 * */
import "../styles/module.scss";
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
    let { item } = props
    let arrLen = new Array(50)
    const baseUrl = JSON.parse(localStorage.getItem("ENV_HTTP") as string)
 
    //移除选项
    let removeValue = (event: any, item: any) => {
      item.data.value = '';
      event.stopPropagation();//阻止冒泡
    }
    let showSignPopup = () => { 
      emit('showSignPopup', item)
    }

    return () => (
      <div class="component-view input-item-view">
        <div class="df-bt">
          <div class="item-label">
            {
              item.data.required
                ? <span class="required-icon">*</span>
                : null
            }
            <div>{item.data.title}</div>
          </div>
          <div class="view-item-icon" onClick={() => showSignPopup()}>
            <i class="iconfont icon-qianming"></i>
          </div>
        </div>

        {
          !item.data.value
            ? <div class="sign-view" onClick={() => showSignPopup()}>
              <p>点击签名</p>
              <div class="sign-bg-watermark">
                {
                  arrLen.map(() => {
                    return <span>手写签名</span>
                  })
                }
              </div>
            </div>
            : <div class="canvas-img">
              <img src={`${item.data.value.includes('base64') ? '' : baseUrl}${item.data.value}`}
                style="width: 100%;height: 180px;" />
              <i class="iconfont icon-guanbi11 remove-img-icon" onClick={(e) => removeValue(e, item)}></i>
            </div>
        }
      </div>
    )
  },
});