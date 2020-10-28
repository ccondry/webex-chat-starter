import * as types from '../mutation-types'

const state = {
  links: [],
  datacenterNames: {
    'RTP': 'US East',
    'SJC': 'US West',
    'LON': 'EMEAR',
    'SNG': 'APJ'
  }
}

const mutations = {
  [types.SET_LINKS] (state, data) {
    state.links = data
  }
}

const getters = {
  isLocked: (state, getters) => {
    return getters.instance.locked === true
    // return true
  },
  datacenterDisplayName: (state, getters) => {
    return state.datacenterNames[getters.datacenter]
  },
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
  links: state => state.links
}

const actions = {
  getLinks ({dispatch, getters}) {
    dispatch('fetchToState', {
      group: 'dcloud',
      type: 'links',
      url: getters.endpoints.links,
      mutation: types.SET_LINKS,
      message: 'get links list'
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
