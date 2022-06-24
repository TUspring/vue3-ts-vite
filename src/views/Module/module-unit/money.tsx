
/**
 * 11、金额输入
 * 
 * 组件key: money
 * */
import "../styles/module.scss";
import { defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  // formatNumber
  setup(props: any, { emit }) {
    const { proxy: { $util } } = getCurrentInstance()
    let { item } = props;
    let storageValueChange = (item: any) => {
      emit('changeCallback', item)
    }
    return () => (
      <div class="component-view input-item-view" >
        <div class="df-bt">
          <div class="item-label">
            {
              item.data.required
                ? <span class="required-icon">*</span>
                : null
            }
            <div>{item.data.title}</div>
          </div>
          <div class="item-input">
            <input class="input-box number-input" type="number" placeholder={item.data.tips} v-model={item.data.value}
              onChange={() => storageValueChange(item)} />
          </div>
        </div>
        {
          item.data.strtoupper ?
            <div class="desc-box df-bt" >
              <div class="item-label">大写</div>
              <div class="txt">
                {/* 根据数字转大写  */}
                {
                  item.data.value ?
                    <p>
                      <span>{$util.numberToString(item.data.value)}</span>
                      {item.data.thousands ? <span> ({$util.formatNumber(item.data.value)})</span> : null}
                    </p>
                    : null
                }
                <p>壹万元整（示例）</p>
              </div>
            </div>
            : null
        }
        {
          item.data.thousands && !item.data.strtoupper ?
            <div class="df-right" >
              {
                item.data.value
                  ? <div style="color: #999;font-size: 12px;">
                    ({$util.formatNumber(item.data.value)})
                  </div>
                  : null
              }
            </div>
            : null
        }
      </div>
    )
  },
});