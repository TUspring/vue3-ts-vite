<template>
  <div class="flow-user-list">
    <div class="info">
      <span v-if="flowInfo.type === 1">发起</span>
      <span v-if="flowInfo.type === 2">审批</span>
      <span v-if="flowInfo.type === 3">抄送</span>
      <span v-if="flowInfo.type === 6">办理</span>
      <span> {{flowInfo.user.length}} 人</span>
    </div>

    <div class="list-wrap">
      <div class="subitem" v-for="(subitem, _index) in flowInfo.user">
        <div class="wrap">
          <div class="avatar-sign">
            {{subitem.user_name |substringName}}
          </div>
          <div class="user-name">
            {{subitem.user_name}}
          </div>
        </div>
        <div class="arrange-arrow">
          <i class="iconfont icon-arrow-left" v-if="flowInfo.user.length-1 > _index"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flowInfo: {},
      };
    },
    props: ["dataInfo"],
    created() {
      this.flowInfo = this.dataInfo;
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .flow-user-list {
    width: 100%;
    height: 100%;
    font-size: 14px;
    padding: 20px 15px 30px;
    min-height: 250px;
    max-height: 450px;
    overflow: auto;

    .info {
      color: #898989;
      margin-bottom: 20px;
    }

    .list-wrap {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .subitem {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;

        .avatar-sign {
          width: 36px;
          height: 36px;
          line-height: 38px;
          font-size: 12px;
          color: #fff;
          text-align: center;
          display: inline-block;
          background: #26a2ff;
          border-radius: 50%;
          overflow: hidden;
        }

        .user-name {
          font-size: 12px;
          text-align: center;
          color: #999;
          line-height: 20px;
        }

        .arrange-arrow {
          padding: 8px 3px 0;
          color: #c9c9c9;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
      }
    }
  }
</style>