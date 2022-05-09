
/**
 * 2、多行输入框
 * 
 * 组件key: multiple_input
 * */
import "@/styles/module.scss";
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
  setup(props: any) {
    let { item } = props

    return () => (
      <div class="component-view input-item-view">
        <div class="item-label">
          {
            item.data.required
              ? <span class="required-icon">*</span>
              : null
          }
          {item.data.title}
        </div>
        <div class="item-input-many">
          <textarea class="input-textarea-box" rows="4" placeholder={item.data.tips} v-model={item.data.value}></textarea>
        </div>
      </div>
    )
  },
});