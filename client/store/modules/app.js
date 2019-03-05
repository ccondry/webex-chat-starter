import * as types from '../mutation-types'

const getters = {
}

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  }
}

const mutations = {
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
}

const actions = {
  async checkLogin ({getters, dispatch, commit, rootState}) {
    console.log('checking localstorage for JWT login token')
    // retrieve auth token from localStorage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token
    if (jwt !== null) {
      console.log('JWT login token found in localStorage')
      // parse payload out of JWT
      const payload = JSON.parse(window.atob(jwt.split('.')[1]))
      // check expiry
      if (payload.exp <= Date.now()) {
        // expired - forward to login page
        window.location = '/auth/login?destination=' + window.location
      }
    } else {
      // no JWT in localStorage
      console.log('JWT not found in localstorage.')
      // forward user to login page, if this is running in production
      if (process.env.NODE_ENV === 'production') {
        window.location = '/auth/login?destination=' + window.location
      }
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
