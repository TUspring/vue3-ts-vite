
/**
 * 10、说明文字
 * 
 * 组件key: explain
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
      <div class="component-view table-view">
        <div class="table-tit" style="padding-left: 20px">
          <a href={item.data.link ? item.data.link : 'javascript:;'}>
            <p class="white-space" style={item.data.text_color ? { color: item.data.text_color } : {}}>
              {item.data.explain}
            </p>
          </a>
        </div>
      </div >
    )
  },
});