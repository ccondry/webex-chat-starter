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
      try {
        const encodedPayload = jwt.split('.')[1]
        console.log('encoded payload =', encodedPayload)
        // parse payload out of JWT
        const payload = JSON.parse(window.atob(encodedPayload))
        console.log('JWT decoded and parsed. payload =', payload)
        // check expiry
        if (payload.exp <= Date.now()) {
          console.log('JWT expired. forwarding to login page')
          // expired - forward to login page
          window.location = '/auth/login?destination=' + window.location
        }
      } catch (e) {
        console.log('failed to parse JWT:', e)
        // invalid JWT? - forward to login page (if this is production)
        if (process.env.NODE_ENV === 'production') {
          window.location = '/auth/login?destination=' + window.location
        }
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
