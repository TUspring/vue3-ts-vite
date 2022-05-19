import { createStore } from 'vuex'
export default createStore({
  state: {
    listData: null,
    flowDetail: sessionStorage.getItem('storageFlowDetail') || {}  //审批流程-单条记录数据
  },
  mutations: {
    setData(state, value) {
      state.listData = value
    },
    storageFlowDetail(state, payload) {
      state.flowDetail = payload
    }
  },
  actions: {
    actionSetData(context, value) {
      context.commit('setData', value)
    }
  },
  modules: {}
})