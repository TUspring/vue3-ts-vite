
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
    let { item } = props;
    console.log(props)
    //调起单选选择窗口
    let showSelectPopup = (item: any) => {
      emit('handleSelectPopup', item, 'radio')
    }
    //移除选项
    let removeValue = (event: any, item: any) => {
      item.data.value = '';
      event.stopPropagation();//阻止冒泡
    }
    let storageValueChange = (event: any, item: any) => {
      item.data.value = '';
      event.stopPropagation();//阻止冒泡
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
          </div>
          <div class="item-input">
            {/* <input class="input-box number-input" type="number" placeholder="{item.data.tips}" v-model="item.data.value"
              onChange={(e) => storageValueChange(item)} /> */}
          </div>
        </div>
        {/* v-if="item.data.strtoupper" */}
        <div class="desc-box df-bt" >
          <div class="item-label">大写</div>
          <div class="txt">
            {/* 根据数字转大写  */}
            {/* v-if="item.data.value" */}
            {/* <p>
              <span>{item.data.value | numberToString}</span>
              <span v-if="item.data.thousands"> ({item.data.value | formatNumber})</span>
            </p> */}
            <p  >壹万元整（示例）</p>
          </div>
        </div>
        {/* <div class="df-right" v-if="item.data.thousands && !item.data.strtoupper">
          <div style="color: #999;font-size: 12px;" v-if="item.data.value">({ item.data.value | formatNumber })</div>
        </div> */}
      </div>
    )
  },
});