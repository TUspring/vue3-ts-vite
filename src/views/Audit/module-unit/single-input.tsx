
/**
 * 1、单行输入框 
 * 
 * 组件key: single_input
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
    },
    applyAdjust: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  setup(props: any, { emit }) {
    let { item, applyAdjust } = props

    let onBlurEvent = () => {
      emit('changeCallback', item)
    }
    return () => (
      <div>
        <div class={[item.permission == 1 ? 'editable' : '', 'tit-label']}>{item.name}</div>
        <div>
          {
            item.permission == 2
              ? <div>{item.value}</div>
              : <div class="selected-info">
                <input class="input-box" type="text" placeholder={item.data.tips} v-model={item.value} />
              </div>
          }
        </div>
        {item.name === '表格号' && applyAdjust ?
          <div>
            <span>{applyAdjust.name}：</span>
            <span style="color: red;">{applyAdjust.value}</span>
          </div> : null
        }
      </div>
    )
  },
});