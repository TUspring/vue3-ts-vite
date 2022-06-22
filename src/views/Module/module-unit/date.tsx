
/**
 * 5、日期
 * 
 * 组件key: date
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
    let showDateSelect = (item: any) => {
      emit('handleSelectPopup', item, 'date')
    }

    //移除选项
    let removeValue = (event: any, item: any) => {
      item.data.value = '';
      event.stopPropagation();//阻止冒泡
    }

    return () => (
      <div class="component-view input-item-view df-bt">
        <div class="item-label">
          {
            item.data.required
              ? <span class="required-icon">*</span>
              : null
          }
          <div>{item.data.title}</div>
        </div>
        <div class="item-view__right" onClick={() => showDateSelect(item)}>
          {
            !item.data.value
              ? <div>
                <span class="item-view-tips">请选择</span>
                <i class="iconfont icon-arrow-left icon-arrow"></i>
              </div>
              : <div class="selected-info">
                <span>{item.data.value}</span>
                <i class="iconfont icon-guanbi11 close-icon" onClick={(e) => removeValue(e, item)}></i>
              </div>
          }
        </div>
      </div>
    )
  },
});