<template>
  <div class="detail-wrap">
    <p class="title">{{item.title}}</p>
    <div class="img" v-for="(img, index) in item.imgs" :key="index">
      <img :src="img" class="img" />
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { reactive, toRefs, computed } from "vue";
export default {
  name: "Detail",
  setup(props) {
    interface Data {
      id?: string | Array<string>;
      item?: Object;
    }
    let data: Data = {
      id: "",
      item: Object
    };
    const state = reactive(data);

    const route = useRoute();
    const item = computed(() => route.params.item).value;
    state.id = computed(() => route.params.id).value;
    state.item = JSON.parse(item);

    return {
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.detail-wrap {
  width: 100%;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    color: #cccc;
    font-size: 20px;
    margin-block-start: 0;
    margin-block-end: 0;
    background-color: #2c323c;
  }
  .img {
    width: 100%;
    height: 100%;
  }
}
</style>