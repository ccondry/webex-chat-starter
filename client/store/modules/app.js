import * as types from '../mutation-types'
import { ToastProgrammatic as Toast } from 'buefy'
import pkg from '../../../package.json'

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
  forwardTo: state => state.forwardTo,
  authApiVersion: state => state.authApiVersion,
  uiVersion: () => pkg.version,
  links: state => state.links
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
  forwardTo: null,
  authApiVersion: 'loading...',
  links: []
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
  },

  [types.SET_VERSION] (state, data) {
    state.authApiVersion = data.version
  },

  [types.SET_LINKS] (state, data) {
    state.links = data
  }
}

const actions = {
  async getLinks ({getters, dispatch, commit}) {
    const operation = 'links'
    console.log('getting', operation, '...')
    // dispatch('setLoading', {group: 'app', type: 'links', value: true})
    try {
      const endpoint = getters.endpoints.links
      console.log('getting', operation, 'endpoint', endpoint, '...')
      // get REST data
      const response = await window.fetch(endpoint, {
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        }
      })
      const text = await response.text()
      if (response.ok) {
        // parse response
        const data = JSON.parse(text)
        // put in state
        commit(types.SET_LINKS, data)
        console.log('get', operation, '- response:', data)
      } else {
        console.log('get', operation, '- failed:', response.status, response.statusText, text)
      }
    } catch (e) {
      console.log('error getting', operation, e)
      // dispatch('errorNotification', {title: 'Failed to get ' + operation, error: e})
    } finally {
      // dispatch('setLoading', {group: 'app', type: 'links', value: false})
    }
  },
  async getApiVersion ({getters, dispatch, commit}) {
    // dispatch('setLoading', {group: 'app', type: 'authApiInfo', value: true})
    const operation = 'auth API version'
    console.log('getting', operation, '...')
    try {
      const endpoint = getters.endpoints.version
      console.log('getting', operation, 'endpoint', endpoint, '...')
      // get REST data
      const response = await window.fetch(endpoint)
      if (response.ok) {
        // parse response
        const data = await response.json()
        // put in state
        commit(types.SET_VERSION, data)
        console.log('get', operation, '- response:', data)
      } else {
        // parse error response text
        const error = await response.text()
        console.log('get', operation, '- failed:', response.status, response.statusText, error)
      }
    } catch (e) {
      console.log('error getting', operation, e)
      dispatch('errorNotification', {title: 'Failed to get ' + operation, error: e})
    } finally {
      // dispatch('setLoading', {group: 'app', type: 'authApiInfo', value: false})
    }
  },
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
    console.log('jwt', jwt)
    // if we found a token
    if (jwt !== null) {
      console.log('JWT login token found in localStorage')
      // check JWT with API
      try {
        const response = await window.fetch(getters.endpoints.authCheck, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        if (response.ok) {
          // valid JWT - assign data in JWT to user object in state
          const decodedJwt = parseJwt(jwt)
          commit(types.SET_USER, decodedJwt)
          // and store JWT in state
          commit(types.SET_JWT, jwt)
        } else {
          // response not OK
          if (response.status === 401) {
            console.log('server said 401. unsetting JWT.')
            // invalid JWT - forward to login page (if this is production)
            if (getters.isProduction) {
              window.location = '/auth/login?destination=' + window.location
            } else {
              // development - just unset the JWT from localstorage
              dispatch('unsetJwt')
            }
          }
        }
      } catch (e) {
        console.log('fetch error?', e)
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
      const response = await window.fetch(getters.endpoints.logout, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        }
      })
      // did they successfully log out of superuser mode?
      if (response.ok) {
        try {
          const json = await response.json()
          if (json.jwt) {
            // switch-user was active - logging back in as previous user
            // store new auth token in localStorage
            dispatch('setJwt', response.data.jwt)
            // load user data using JWT
            // dispatch('loadUser')
            dispatch('successNotification', `Successfully logged out of ${getters.user.username}`)
          } else {
            // normal logout
            // remove JWT
            commit(types.SET_JWT, null)
            // remove JWT from localStorage
            window.localStorage.removeItem('jwt')
            // remove user from state
            commit(types.SET_USER, {})
          }
        } catch (e) {
          // no json data in response - normal logout
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
