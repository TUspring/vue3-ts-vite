
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    }
  },
  setup() {
    const columns = reactive([
      {
        values: ['']
      }, 
    ])

    return () => (
      <div>882222222</div>
    )
  },
});