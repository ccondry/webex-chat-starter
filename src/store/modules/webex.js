import {ToastProgrammatic as Toast} from 'buefy/src'

const state = {
  agentPortalUrl: 'https://agent.cjp.cisco.com/ada-ws/home',
  webexAdminPortalUrl: 'https://admin.webex.com/overview',
  cjpAdminPortalUrl: 'https://portal.cjp.cisco.com/portal/home'
}

const getters = {
  agentPortalUrl: state => state.agentPortalUrl,
  webexAdminPortalUrl: state => state.webexAdminPortalUrl,
  cjpAdminPortalUrl: state => state.cjpAdminPortalUrl,
}

const actions = {
  async joinSupportRoom ({dispatch, getters}, email) {
    try {
      await dispatch('fetch', {
        group: 'webex',
        type: 'joinSupportRoom',
        url: getters.endpoints.webex,
        options: {
          method: 'POST',
          body: {personEmail: email}
        }
      })
      Toast.open({
        type: 'is-success',
        message: `You have been added to the support space`
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = {
  actions,
  getters,
  state
}