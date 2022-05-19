
/**
 * 3、数字输入框 
 * 
 * 组件key: number_input
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
          <div>{item.data?.title} {item.data?.unit ? `(${item.data.unit})` : ''}</div>
        </div>
        <div class="item-input">
          <input class="input-box" type="number" placeholder={item.data.tips} v-model={item.data.value} onBlur={onBlurEvent} />
        </div>
      </div>
    )
  },
});