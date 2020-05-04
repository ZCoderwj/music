// 初始化vuex
import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

// 每次修改mutation时，会在控制台打印一个log
import  createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 调试工具
const debug = process.env.NOD_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict:debug,
  plugins:debug ? [createLogger()] :[]
})
