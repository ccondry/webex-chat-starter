import * as types from '../mutation-types'
import Vue from 'vue'
import {ToastProgrammatic as Toast} from 'buefy/src'
import {version} from '../../../package.json'

const state = {
  loading: {
    app: {},
    user: {},
    users: {},
    ldap: {},
    dcloud: {}
  },
  working: {
    app: {},
    user: {},
    users: {},
    ldap: {},
    dcloud: {}
  },
  isProduction: process.env.NODE_ENV === 'production',
  demoEnvironment: {},
  uiVersion: version,
  apiVersion: 'Loading...'
}

const getters = {
  isProduction: state => state.isProduction,
  loading: state => state.loading,
  working: state => state.working,
  demoEnvironment: state => state.demoEnvironment,
  uiVersion: state => state.uiVersion,
  apiVersion: state => state.apiVersion
}

const mutations = {
  [types.SET_WORKING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.working[data.group]) {
      Vue.set(state.working, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.working[data.group][data.type]) {
      Vue.set(state.working[data.group], data.type, data.value)
    } else {
      state.working[data.group][data.type] = data.value
    }
  },
  [types.SET_LOADING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.loading[data.group]) {
      Vue.set(state.loading, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.loading[data.group][data.type]) {
      Vue.set(state.loading[data.group], data.type, data.value)
    } else {
      state.loading[data.group][data.type] = data.value
    }
  },
  [types.SET_AUTH_API_VERSION] (state, data) {
    state.apiVersion = data.version
  }
}

const actions = {
  setWorking ({commit}, {group, type, value = true}) {
    commit(types.SET_WORKING, {group, type, value})
  },
  setLoading ({commit}, {group, type, value = true}) {
    commit(types.SET_LOADING, {group, type, value})
  },
  getApiVersion ({dispatch, getters}) {
    // get Auth REST API version
    dispatch('fetch', {
      group: 'app',
      type: 'authVersion',
      url: getters.endpoints.authVersion,
      message: 'get authentication REST API version',
      mutation: types.SET_AUTH_API_VERSION,
      showNotification: false
    })
  },
  copyToClipboard ({}, {string, type = 'Text'}) {
    // copy text to clipboard
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.value = string
    input.select()
    const result = document.execCommand('copy')
    if (result === 'unsuccessful') {
      // failed
      console.error('Failed to copy text.')
    } else {
      // success
      Toast.open({
        message: type + ' Copied to Your Clipboard',
        queue: false
      })
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported
    window.getSelection().removeAllRanges()
    // remove the input field
    input.remove()
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
