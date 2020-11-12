import * as types from '../mutation-types'
import {addUrlQueryParams} from '../../utils'

const state = {
  verticals: [],
  demoBaseConfig: {}
}

const mutations = {
  [types.SET_VERTICALS] (state, data) {
    state.verticals = data
  },
  [types.SET_DEMO_BASE_CONFIG] (state, data) {
    state.demoBaseConfig = data[0]
  }
}

const getters = {
  isLocked: (state, getters) => {
    return getters.demoBaseConfig.locked === true
  },
  verticals: state => state.verticals,
  brandDemoLink (state, getters) {
    return addUrlQueryParams('https://mm-brand.cxdemo.net', {
      session: 'webex-v4',
      datacenter: 'CLOUD',
      userId: getters.jwtUser.id
    })
  },
  demoBaseConfig: state => state.demoBaseConfig
}

const actions = {
  getDemoBaseConfig ({dispatch, getters}) {
    dispatch('fetch', {
      group: 'dcloud',
      type: 'demoBaseConfig',
      url: getters.endpoints.demoBaseConfig,
      options: {
        query: {
          demo: 'webex',
          version: 'v4prod',
          instant: true
        }
      },
      mutation: types.SET_DEMO_BASE_CONFIG,
      message: 'get demo base config'
    })
  },
  getVerticals ({dispatch, getters}) {
    dispatch('fetch', {
      group: 'dcloud',
      type: 'verticals',
      url: getters.endpoints.vertical,
      options: {
        query: {
          all: true,
          summary: true
        }
      },
      mutation: types.SET_VERTICALS,
      message: 'get verticals list'
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
