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
  demoConfig: {}
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.SET_PROVISION] (state, data) {
    state.demoConfig = data
  }
}

const getters = {
  demoUserConfig: state => state.demoConfig,
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
  },
  isProvisioned: (state, getters) => {
    return Object.keys(getters.demoUserConfig).length > 0
  }
}

const actions = {
  async logout ({dispatch, commit, getters}) {
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
  async deprovisionUser ({dispatch, getters}, password) {
    try {
      await dispatch('fetch', {
        group: 'user',
        type: 'deprovision',
        url: getters.endpoints.provision,
        options: {
          method: 'DELETE'
        },
        message: 'deprovision'
      })
      dispatch('getProvision')
    } catch (e) {
      console.log(e)
    }
  },
  resetPassword ({dispatch, getters}, password) {
    dispatch('fetch', {
      group: 'user',
      type: 'password',
      url: getters.endpoints.password,
      options: {
        method: 'POST',
        body: {
          password
        }
      },
      message: 'reset password'
    })
  },
  async provisionUser ({dispatch, getters}) {
    try {
      await dispatch('fetch', {
        group: 'user',
        type: 'provision',
        url: getters.endpoints.provision,
        options: {
          method: 'POST'
        },
        message: 'provision user'
      })
      dispatch('getProvision')
    } catch (e) {
      console.log(e)
    }
  },
  getProvision ({dispatch, getters}) {
    dispatch('fetch', {
      group: 'user',
      type: 'provision',
      url: getters.endpoints.provision,
      message: 'get provision information',
      mutation: types.SET_PROVISION
    })
  },
  saveDemoUserConfig ({dispatch, getters}, body) {
    dispatch('fetch', {
      group: 'user',
      type: 'demoConfig',
      url: getters.endpoints.demoConfig,
      options: {
        method: 'POST',
        body
      },
      message: 'save demo configuration'
    })
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
      dispatch('getProvision')
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
        message: `Enter your JWT:`,
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
  async checkJwt ({dispatch, getters}) {
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