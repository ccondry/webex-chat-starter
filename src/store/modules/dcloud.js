import * as types from '../mutation-types'
import {addUrlQueryParams} from '../../utils'

const state = {
  // list of demo verticals
  verticals: [],
  // the base configuration for this demo
  demoBaseConfig: {},
  // dcloud session ID and datacenter information
  instance: {}
}

const mutations = {
  [types.SET_VERTICALS] (state, data) {
    state.verticals = data
  },
  [types.SET_DEMO_BASE_CONFIG] (state, data) {
    state.demoBaseConfig = data[0]
  },
  [types.SET_INSTANCE] (state, data) {
    state.instance = data[0]
  }
}

const getters = {
  // is this demo locked to disable provisioning?
  isLocked: (state, getters) => {
    return getters.demoBaseConfig.locked === true
  },
  // which vertical the demo website is set to 
  verticals: state => state.verticals,
  // the customer-side demo website link
  brandDemoLink (state, getters) {
    try {
      return addUrlQueryParams('https://mm-brand.cxdemo.net', {
        session: state.instance.session,
        datacenter: state.instance.datacenter,
        userId: getters.jwtUser.id
      })
    } catch (e) {
      return null
    }
  },
  // the base demo configuration for this instant demo
  demoBaseConfig: state => state.demoBaseConfig,
  // the instant demo instance information, like session ID and datacenter
  instance: state => state.instance
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
  },
  getInstance ({dispatch, getters}) {
    // get instant demo instance information, for the session ID and datacenter
    dispatch('fetch', {
      group: 'dcloud',
      type: 'instance',
      url: getters.endpoints.instance,
      options: {
        query: {
          demo: 'webex',
          version: 'v4prod'
        }
      },
      mutation: types.SET_INSTANCE,
      message: 'get dCloud session information'
    })
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
