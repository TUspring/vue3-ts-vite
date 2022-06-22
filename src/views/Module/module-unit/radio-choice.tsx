
/**
 * 4、单选框
 * 
 * 组件key: radio_choice
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
    let { item } = props;
    //调起单选选择窗口
    let showSelectPopup = (item: any) => {
      emit('handleSelectPopup', item, 'radio')
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
        <div class="item-view__right" onClick={() => showSelectPopup(item)}>
          {
            !item.data.value
              ?
              <div>
                <span class="item-view-tips">{item.data.tips}</span>
                <i class="iconfont icon-arrow-left icon-arrow"></i>
              </div>
              :
              <div class="selected-info">
                <span>{item.data.value}</span>
                <i class="iconfont icon-guanbi11 close-icon" onClick={(e) => removeValue(e, item)}></i>
              </div>
          }

        </div>
      </div>
    )
  },
});