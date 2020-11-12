const state = {
  defaults: {
    async: true,
    CiscoAppId: 'cisco-chat-bubble-app',
    appPrefix: '',
    DC: 'produs1.ciscoccservice.com',
    orgId: 'ed2f91e1-ce22-4313-85cb-9acd7b5ce489',
    templateId: 'd6deef90-59a2-11ea-862b-05baf101fe3f'
  }
}

const getters = {
  defaults: state => state.defaults
}

export default {
  state,
  getters
}