const getters = {
  endpoints: (state, getters) => {
    let urlBase
    let authUrlBase
    const mmUrlBase = 'https://mm.cxdemo.net/api/v1'

    if (getters.isProduction) {
      // production
      authUrlBase = '/api/v1/auth'
      urlBase = 'https://dcloud-collab-toolbox.cxdemo.net/api/v1/webex-v4'
    } else {
      // development
      authUrlBase = 'http://localhost:3032/api/v1/auth'
      urlBase = 'http://localhost:4005/api/v1/webex-v4'
    }

    return {
      webex: authUrlBase + '/resource/joinWebexSupportRoom',
      version: urlBase + '/version',
      authVersion: authUrlBase + '/version',
      logout: authUrlBase + '/logout',
      demoBaseConfig: mmUrlBase + '/demo',
      vertical: mmUrlBase + '/verticals',
      provision: urlBase + '/provision'
    }
  },
  defaultRestOptions: (state, getters) => {
    return {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
  }
}

export default {
  getters
}