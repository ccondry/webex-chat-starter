import * as types from '../mutation-types'
// import {addUrlQueryParams} from '../../utils'

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
  datacenter: (state, getters) => {
    if (getters.isProduction) {
      // get current hostname of the browser location
      const hostname = window.location.hostname
      // get the part before ".cisco.com"
      const part1 = hostname.split('.').shift()
      // get the datacenter part
      return part1.split('-').pop().toUpperCase()
    } else {
      // development
      return 'RTP'
    }
  },
  // brandDemoLink (state, getters) {
  //   return addUrlQueryParams('https://mm-brand.cxdemo.net', {
  //     session: getters.instance.session,
  //     datacenter: getters.instance.datacenter,
  //     userId: getters.jwtUser.id
  //   })
  // },
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
