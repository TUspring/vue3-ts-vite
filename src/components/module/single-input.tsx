
/**
 * 1、单行输入框 
 * 
 * 组件key: single_input
 * */
import "@/styles/module.scss";
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

    let onBlurEvent = () => {
      emit('changeCallback', item)
    }
    return () => (
      <div class="component-view input-item-view df-bt">
        <div class="item-label">
          {
            item.data.required
              ? <span class="required-icon">*</span>
              : null
          }
          <div>{item?.data?.title}</div>
        </div>
        <div class="item-input">
          <input class="input-box" type="text" placeholder={item.data.tips} v-model={item.data.value} onBlur={onBlurEvent} />
        </div>
      </div>
    )
  },
});