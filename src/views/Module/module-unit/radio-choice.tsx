
/**
 * 4、单选框
 * 
 * 组件key: radio_choice
 * */
import "@/styles/module.scss";
import { defineComponent, reactive } from 'vue';
import SelectRadio from "@/components/module-dialog/radio.vue";
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
    let popup = reactive({
      radioSelectVisible: true, //单选框
    });
    //调起单选选择窗口
    let showSelectPopup = (item: any, key: string) => {
      emit('handleSelectRadio', item)
    }
    //移除选项
    let removeValue = (item: any) => {
      item.data.value = '';
    }
    return () => (
      <>
        <div class="component-view input-item-view df-bt">
          <div class="item-label">
            {
              item.data.required
                ? <span class="required-icon">*</span>
                : null
            }
            <div>{item.data?.title}</div>
          </div>
          <div class="item-view__right" onClick={() => showSelectPopup(item, 'radio')}>
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
                  <i class="iconfont icon-guanbi11 close-icon" onClick={() => removeValue(item)}></i>
                </div>
            }

          </div>
        </div>

        {/* <van-popup v-model={[popup.radioSelectVisible, 'show']} position="bottom">
          <SelectRadio initData={item} selectCallback={selectCallback}
            close="popup.radioSelectVisible =false"></SelectRadio>
        </van-popup> */}
      </>
    )
  },
});