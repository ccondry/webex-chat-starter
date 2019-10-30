import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as getters from './getters'
import modules from './modules'

Vue.use(Vuex)

// production url
let baseUrl = '/api/v1/auth'
if (process.env.NODE_ENV !== 'production') {
  // dev environment url
  baseUrl = 'http://localhost:3032/api/v1/auth'
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  getters,
  modules,
  state: {
    pkg,
    isProduction: process.env.NODE_ENV === 'production',
    endpoints: {
      logout: baseUrl + '/logout'
    }
  }
})

export default store
