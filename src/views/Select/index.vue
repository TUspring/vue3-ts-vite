<template>
  <div class="select-wrap">
    <div class="item">
      <van-badge :content="1">
        <van-image class="img-box" :src="Img5" />
      </van-badge>
      <div class="info thin-line">
        <p class="name">朋友</p>
        <p class="message">帮我问问</p>
        <span class="date">17:00</span>
      </div>
    </div>
    <div class="item">
      <van-badge :content="1">
        <van-image class="img-box" :src="Img1" />
      </van-badge>
      <div class="info thin-line">
        <p class="name">扁哥</p>
        <p class="message">我请大家喝</p>
        <span class="date">15:01</span>
      </div>
    </div>
    <div class="item">
      <van-badge :content="2">
        <van-image class="img-box" :src="Img2" />
      </van-badge>
      <div class="info thin-line">
        <p class="name">超哥</p>
        <p class="message">我中彩票了，你要不要皮肤</p>
        <span class="date">13:18</span>
      </div>
    </div>
    <div class="item">
      <van-badge :content="3">
        <van-image class="img-box" :src="Img3" />
      </van-badge>
      <div class="info thin-line">
        <p class="name">新哥</p>
        <p class="message">今晚五黑，有妹子[动画表情]</p>
        <span class="date">12:32</span>
      </div>
    </div>
    <div class="item">
      <van-badge :content="1">
        <van-image class="img-box" :src="Img4" />
      </van-badge>
      <div class="info thin-line">
        <p class="name">丢哥</p>
        <p class="message">我给你辅助位，今晚开黑</p>
        <span class="date">10:09</span>
      </div>
    </div>
    <div class="item">
      <van-badge :content="9">
        <van-image class="img-box" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F24%2F20200524221118_ogcck.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655365670&t=abae92d729a260b0ba945d8820dfc327" />
      </van-badge>
      <div class="info thin-line">
        <p class="name">热巴</p>
        <p class="message">[转账] 已收款100000.00</p>
        <span class="date">5月13日</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
  import Img1 from '@/assets/1.jpg'
  import Img2 from '@/assets/2.jpg'
  import Img3 from '@/assets/3.jpg'
  import Img4 from '@/assets/4.jpg'
  import Img5 from '@/assets/5.jpg'
  import { ref, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const instance = getCurrentInstance();

</script>

<style lang="scss" scoped>
  .select-wrap {
    padding: 20px 0px 10px 15px;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .item {
      width: 100%;
      height: 62px;
      display: flex;
      justify-content: flex-start;
      margin-bottom: 12px;
    }

    .img-box {
      width: 52px;
      height: 52px;
      border-radius: 6px;
      overflow: hidden;

    }

    .info {
      margin-left: 15px;
      padding: 0px 15px 0 0;
      line-height: 26px;
      flex: 1;
      position: relative;

      .name {
        color: #252525;
        font-size: 16px;
      }

      .message {
        font-size: 13px;
        color: #a4a4a4
      }

      .date {
        top: 0px;
        right: 10px;
        font-size: 12px;
        position: absolute;
        color: #bebebe
      }
    }
  }

  ::v-deep(.van-badge) {
    border: none;
    width: 18px;
    height: 18px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    font-family: 'vant-icon';
    background-color: #f54a5e;
  }

  ::v-deep(.van-badge--top-right) {
    top: 5px;
    right: 5px;
  }
</style>