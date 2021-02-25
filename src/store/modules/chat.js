import * as types from '../mutation-types'
// import {
//   ToastProgrammatic as Toast,
//   DialogProgrammatic as Dialog
// } from 'buefy/src'

const state = {
  session: {}
}

const mutations = {
  [types.SET_SESSION_INFO] (state, data) {
    state.session = data
  }
}

const getters = {
  sessionInfo: state => state.session
}

const actions = {
  async getSessionInfo ({dispatch, getters}, query) {
    return dispatch('fetch', {
      group: 'user',
      type: 'session',
      url: getters.endpoints.session,
      message: 'Get dCloud session information',
      showNotification: false,
      mutation: types.SET_SESSION_INFO,
      options: {
        query
      }
    })
  }
}

export default {
  actions,
  getters,
  mutations,
  state
}
