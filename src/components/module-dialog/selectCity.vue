<template>
  <div class="popup-select-box">
    <div class="popup-box__head">
      <div class="close-popup" @click="close">
        <i class="iconfont icon-xiala"></i>
      </div>
      <div class="title">选择城市</div>
    </div>
    <div class="content-bady">
      <div class="section" v-for="(item, index) in cityList" :key="index">
        <p class="area-name">{{item.area}}</p>
        <div class="subitem-wrap">
          <span class="item" v-for="(li, index) in item.list" :key="index" @click="selectCity(li.name)"
            :class="selectedCity.includes(li.name) ? 'selected':''">{{li.name}}</span>
        </div>
      </div>

      <div class="section">
        <div class="subitem-wrap">
          <span class="item" v-for="(li, index) in allCityList" :key="index" @click="selectCity(li.name)"
            :class="selectedCity.includes(li.name) ? 'selected':''">{{li.name}}</span>
        </div>
      </div>
    </div>

    <div class="confirm-box">
      <mt-button type="primary" size="small" @click="confirm">确定</mt-button>
    </div>
  </div>
</template>

<script>
  import { Checklist } from 'mint-ui';
  export default {
    data() {
      return {
        cityList: [],
        allCityList: [], //没有显示区域时，
        selectedCity: []
      }
    },
    props: {
      initData: {
        type: Object,
        default: () => {}
      }
    },
    mounted() {
      if(this.initData.data.show_area){ //显示区域
        this.cityList = this.initData.data.city_list;
      }else{
        this.initData.data.city_list.map( j=>{
          this.allCityList = [...this.allCityList, ...j.list]
        })
      }
    },
    methods: {
      selectCity(city) {
        if (this.initData.data.select_type === 2) { //多选
          if (this.selectedCity.includes(city)) {
            this.selectedCity.map((j, i) => {
              if (j === city) {
                this.selectedCity.splice(i, 1)
              }
            })
          } else {
            this.selectedCity.push(city)
          }
        } else { //单选
          this.selectedCity = [city]
        }
      },
      confirm() {
        this.$emit('selectCallback', this.selectedCity)
        this.close()
      },
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-select-box {
    width: 100%;
    min-height: 200px;

    .popup-box__head {
      padding: 8px 15px;
      text-align: center;
      border-bottom: 1px solid #eee;
      position: relative;

      .close-popup {
        top: 0;
        left: 5px;
        height: 100%;
        width: 40px;
        line-height: 40px;
        text-align: center;
        position: absolute;

        i {
          font-size: 20px;
          color: #333;
        }
      }

      .title {
        font-weight: bold;
      }
    }

    .content-bady {
      padding-top: 10px;
      padding-bottom: 70px;
      min-height: 200px;
      max-height: 500px;
      overflow: auto;

      .section {
        width: 100%;

        .area-name {
          padding: 0 10px;
          color: #999;
        }

        .subitem-wrap {
          padding: 5px 10px 5px 15px;
          width: 100%;
          box-sizing: border-box;

          .item {
            width: 23%;
            height: 32px;
            line-height: 32px;
            background: #eee;
            border-radius: 4px;
            margin-right: 2%;
            margin-bottom: 8px;
            text-align: center;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            display: inline-block;
          }

          .selected {
            background: #409eff;
            color: #fff;
          }
        }
      }
    }


    .confirm-box {
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 60px;
      position: absolute;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-top: 1px solid #eee;

      button {
        width: 90%;
      }
    }
  }

  ::v-deep {
    .mint-cell-wrapper {
      background-image: none;
      border-bottom: 1px solid #eee;
    }
  }
</style>