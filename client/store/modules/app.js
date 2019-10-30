import * as types from '../mutation-types'
import axios from 'axios'
// import { Toast } from 'buefy/dist/components/toast'
import { ToastProgrammatic as Toast } from 'buefy'

// parse JWT payload
function parseJwt (token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const getters = {
  user: state => state.user,
  jwt: state => state.jwt,
  isAuthenticated: state => state.jwt !== null,
  forwardTo: state => state.forwardTo
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
  },
  user: {},
  jwt: null,
  forwardTo: null
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
  },

  [types.SET_USER] (state, data) {
    state.user = data
  },

  [types.SET_JWT] (state, data) {
    state.jwt = data
  },

  [types.FORWARD_TO] (state, data) {
    state.forwardTo = data
  }
}

const actions = {
  successNotification ({getters}, message) {
    Toast.open({
      // duration: 8000,
      message,
      type: 'is-success'
    })
  },
  errorNotification ({getters}, message) {
    Toast.open({
      duration: 8000,
      message,
      type: 'is-danger'
    })
  },
  async checkLogin ({getters, dispatch, commit, rootState}) {
    console.log('checking localstorage for JWT login token')
    // retrieve auth token from localStorage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token
    if (jwt !== null) {
      console.log('JWT login token found in localStorage')
      // check JWT with API
      try {
        await axios.get(getters.endpoints.authCheck, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        // valid JWT - assign data in JWT to user object in state
        const decodedJwt = parseJwt(jwt)
        commit(types.SET_USER, decodedJwt)
        // and store JWT in state
        commit(types.SET_JWT, jwt)
      } catch (e) {
        console.log(e)
        // invalid JWT? - forward to login page (if this is production)
        if (getters.isProduction) {
          window.location = '/auth/login?destination=' + window.location
        }
      }
    } else {
      // no JWT in localStorage
      console.log('JWT not found in localstorage.')
      // forward user to login page, if this is running in production
      if (getters.isProduction) {
        window.location = '/auth/login?destination=' + window.location
      }
    }
  },
  async logout ({dispatch, commit, getters}) {
    console.log('logging out user')
    try {
      // tell server we're logging out
      const options = {
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        }
      }
      const response = await axios.post(getters.endpoints.logout, null, options)

      // did they successfully log out of superuser mode?
      if (response.status >= 200 && response.status < 300) {
        if (response.data.jwt) {
          // store new auth token in localStorage
          dispatch('setJwt', response.data.jwt)
          // load user data using JWT
          // dispatch('loadUser')
          dispatch('successNotification', `Successfully logged out of ${getters.user.username}`)
        } else {
          // remove JWT
          commit(types.SET_JWT, null)
          // remove JWT from localStorage
          window.localStorage.removeItem('jwt')
          // remove user from state
          commit(types.SET_USER, {})
        }
      } else {
        dispatch('errorNotification', `Failed to log out of ${getters.user.username}`)
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  setForwardTo ({commit}, data) {
    commit(types.FORWARD_TO, data)
  },
  setJwt ({commit}, data) {
    console.log('setting JWT in localStorage and state')
    // trim "Bearer " off the front of the input, if it exists
    if (data.indexOf('Bearer ') === 0) {
      data = data.substring('Bearer '.length)
    }
    commit(types.SET_JWT, data)
    // set authToken in localStorage also
    window.localStorage.setItem('jwt', data)
    // decode jwt and store as user data
    try {
      commit(types.SET_USER, parseJwt(data))
    } catch (e) {
      // invalid JWT?
      console.error('invalid JWT', data)
      // unset JWT in state
      commit(types.SET_JWT, null)
      // remove JWT from localStorage
      window.localStorage.removeItem('jwt')
      // unset user in state
      commit(types.SET_USER, {})
    }
  },
  unsetJwt ({commit}) {
    // unset JWT in state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
    // unset user in state
    commit(types.SET_USER, {})
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
