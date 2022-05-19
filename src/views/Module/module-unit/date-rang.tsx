
/**
 * 5、日期区间
 * 
 * 组件key: date_rang
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
    let showDateSelect = (item: any, key: string) => {
      emit('handleSelectPopup', item, key)
    }

    //移除选项
    let removeValue = (event: any, item: any) => {
      item.data.value = '';
      event.stopPropagation();//阻止冒泡
    }

    return () => (
      <div class="component-view">
        <div class="input-item-view df-bt">
          <div>
            {
              item.data.required
                ? <span class="required-icon">*</span>
                : null
            }
            {item.data.start_date_title}
          </div>
          <div class="item-view__right" onClick={() => showDateSelect(item, 'start_value')} >
            {
              !item.data.start_value
                ? <div>
                  <span class="item-view-tips">{item.data.tips}</span>
                  <i class="iconfont icon-arrow-left icon-arrow"></i>
                </div>
                : <div class="selected-info">
                  <span>{item.data.start_value}</span>
                  <i class="iconfont icon-guanbi11 close-icon" onClick={(e) => removeValue(e, item)}></i>
                </div>
            }
          </div>
        </div>
        <div class="input-item-view df-bt" style="border-top: 1px solid #f5f5f5;position: relative;">
          <div>
            {
              item.data.required
                ? <span class="required-icon">*</span>
                : null
            }
            {item.data.end_date_title}
          </div>
          <div class="item-view__right" onClick={() => showDateSelect(item, 'end_value')}>
            {
              !item.data.end_value
                ? <div  >
                  <span class="item-view-tips">{item.data.tips}</span>
                  <i class="iconfont icon-arrow-left icon-arrow"></i>
                </div>
                : <div class="selected-info">
                  <span>{item.data.end_value} </span>
                  <i class="iconfont icon-guanbi11 close-icon" onClick={(e) => removeValue(e, item)}></i>
                </div>
            }
          </div>
        </div >
      </div >
    )
  },
});