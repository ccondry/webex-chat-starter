import {
  DialogProgrammatic as Dialog,
} from 'buefy/src'

import * as types from '../mutation-types'

// parse a JWT payload into a JSON object
function parseJwt (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const state = {
  jwt: null,
  user: null
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.SET_USER] (state, data) {
    state.user = data
  }
}

const getters = {
  user: state => state.user,
  userDemoConfig: state => {
    try {
      return state.user.demo['cloud-config'] || {}
    } catch (e) {
      return {}
    }
  },
  isAdminSu: (state, getters) => {
    try {
      return getters.jwtUser.suJwt
    } catch (e) {
      return false
    }
  },
  isAdmin: (state, getters) => {
    try {
      return getters.jwtUser.admin
    } catch (e) {
      return false
    }
  },
  jwt: state => state.jwt,
  isLoggedIn: (state, getters) => {
    try {
      return getters.jwtUser.email.length > 0
    } catch (e) {
      return false
    }
  },
  jwtUser: state => {
    try {
      return parseJwt(state.jwt)
    } catch (e) {
      return {}
    }
  }
}

const actions = {
  async logout ({dispatch, getters}) {
    try {
      const response = await dispatch('fetch', {
        group: 'user',
        type: 'logout',
        url: getters.endpoints.logout,
        options: {
          method: 'POST'
        },
        message: 'logout'
      })
      // did we get a new JWT (from logging out of switch-user)?
      if (response.jwt) {
        // save new JWT
        dispatch('setJwt', response.jwt)
      } else {
        // remove JWT
        dispatch('unsetJwt')
      }
    } catch (e) {
      console.log(e)
    }
  },
  getUser ({dispatch, getters}) {
    dispatch('fetch', {
      group: 'user',
      type: 'details',
      url: getters.endpoints.user,
      message: 'get user details',
      mutation: types.SET_USER
    })
  },
  async saveUserDemoConfig ({dispatch, getters}, body) {
    try {
      await dispatch('fetch', {
        group: 'user',
        type: 'demoConfig',
        url: getters.endpoints.userDemoConfig,
        options: {
          method: 'POST',
          body,
          query: {
            id: 'cloud-configprod'
          }
        },
        message: 'save user demo configuration'
      })
      // refresh state data
      dispatch('getUser')
    } catch (e) {
      console.log(e.message)
    }
  },
  setJwt ({commit, dispatch}, jwt) {
    try {
      // test parse JWT to user JSON
      parseJwt(jwt)
      // put JWT in state
      commit(types.SET_JWT, jwt)
      // put JWT in localStorage
      window.localStorage.setItem('jwt', jwt)
      // get provision info for this user
      dispatch('getUser')
    } catch (e) {
      // parseJwt failed - delete this invalid JWT
      dispatch('unsetJwt')
    }
  },
  unsetJwt ({commit}) {
    // remove JWT from state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
  },
  login ({dispatch, getters}) {
    if (getters.isProduction) {
      // production - forward to auth page for SSO
      window.location = '/auth'
    } else {
      // development - prompt for JWT
      Dialog.prompt({
        title: 'Log In',
        message: 'Enter your JWT:',
        onConfirm: (jwt) => {
          dispatch('setJwt', jwt)
        },
        canCancel: false,
        confirmText: 'Log In',
        type: 'is-success',
        rounded: true
      })
    }
  },
  async checkJwt ({dispatch}) {
    dispatch('setWorking', {group: 'user', type: 'login', value: true})
    // check jwt in browser local storage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null && jwt.length > 40) {
      console.log('found existing JWT in localStorage')
      // store JWT in state
      dispatch('setJwt', jwt)
    } else {
      // no JWT found - make the user log in
      dispatch('login')
    }
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
