import * as types from '../mutation-types'
import Vue from 'vue'
import {ToastProgrammatic as Toast} from 'buefy/src'
import {addUrlQueryParams} from '../../utils'
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
  apiVersion: 'Loading...',
  authApiVersion: 'Loading...'
}

const getters = {
  isProduction: state => state.isProduction,
  loading: state => state.loading,
  working: state => state.working,
  demoEnvironment: state => state.demoEnvironment,
  uiVersion: state => state.uiVersion,
  apiVersion: state => state.apiVersion,
  authApiVersion: state => state.authApiVersion
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
  [types.SET_API_VERSION] (state, data) {
    state.apiVersion = data.version
  },
  [types.SET_AUTH_API_VERSION] (state, data) {
    state.authApiVersion = data.version
  }
}

const actions = {
  async fetch ({commit, getters, dispatch}, {
    group,
    type,
    url,
    options = {},
    mutation,
    message
  }) {
    if (!url) {
      throw Error('url is a required parameter for fetch')
    }
    message = message || `${options.method === 'POST' ? 'save' : 'get'} ${group} ${type}`
    console.log(`${message}...`)
    const loadingOrWorking = !options.method || options.method === 'GET' ? 'setLoading' : 'setWorking'
    dispatch(loadingOrWorking, {group, type, value: true})
    try {
      // const data = await dispatch('fetch', {url, options})
      // set default headers
      options.headers = options.headers || {}
      // set content type to JSON by default
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
      // set accept to JSON by default
      options.headers['Accept'] = options.headers['Accept'] || 'application/json'
      // set JWT auth header by default
      options.headers['Authorization'] = options.headers['Authorization'] || 'Bearer ' + getters.jwt
      // set instant demo instance name
      options.headers['Instance'] = getters.instanceName
      // stringify body if it is an object
      if (typeof options.body === 'object') {
        options.body = JSON.stringify(options.body)
      }
      // add query parameters to URL
      const endpoint = addUrlQueryParams(url, options.query)
      // console.log('endpoint', endpoint)
      const response = await window.fetch(endpoint, options)
      // get the response body as text
      const text = await response.text()
      // response code 200 - 299?
      if (response.ok) {
        try {
          // parse response text into JSON
          const json = JSON.parse(text)
          console.log(`${message} success:`, json)
          if (mutation) {
            // put JSON data into state
            commit(mutation, json)
          }
          return json
        } catch (e) {
          // body is not json data. return the raw text, and don't attempt
          // to put it into state
          console.log(`${message} success:`, text)
          return text
        }
      } else if (response.status === 401) {
        // expired JWT. forget jwt and forward to SSO login
        window.localStorage.removeItem('jwt')
        return dispatch('login')
      } else {
        // not OK and not 401
        let m = text
        try {
          const json = JSON.parse(text)
          m = json.message || json.apiError || json[Object.keys(json)[0]]
        } catch (e) {
          const regex = /text\/html/i
          if (response.headers.get('content-type').match(regex)) {
            // text/html - don't return that whole thing
            m = ''
          }
        }
        // console.log('bad response', m)
        let message = `${response.status} ${response.statusText}`
        if (m.length) {
          message += ` - ${m}`
        }
        const error = Error(message)
        error.status = response.status
        error.statusText = response.statusText
        error.text = m
        throw error
      }
    } catch (e) {
      console.error(`${message} failed: ${e.message}`)
      Toast.open({
        message: `Failed to ${message}: ${e.message}`,
        type: 'is-danger',
        duration: 6 * 1000,
        queue: false
      })
    } finally {
      dispatch(loadingOrWorking, {group, type, value: false})
    }
  },
  setWorking ({commit}, {group, type, value = true}) {
    commit(types.SET_WORKING, {group, type, value})
  },
  setLoading ({commit}, {group, type, value = true}) {
    commit(types.SET_LOADING, {group, type, value})
  },
  async getApiVersion ({commit, dispatch, getters}) {
    // get REST API version
    dispatch('fetch', {
      group: 'app',
      type: 'version',
      url: getters.endpoints.version,
      message: 'get REST API version',
      mutation: types.SET_API_VERSION
    })
  },
  getAuthApiVersion ({dispatch, getters}) {
    // get Auth REST API version
    dispatch('fetch', {
      group: 'app',
      type: 'authVersion',
      url: getters.endpoints.authVersion,
      message: 'get authentication REST API version',
      mutation: types.SET_AUTH_API_VERSION
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
