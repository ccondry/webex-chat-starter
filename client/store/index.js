import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as getters from './getters'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  getters,
  modules,
  state: {
    pkg
  }
})

export default store
