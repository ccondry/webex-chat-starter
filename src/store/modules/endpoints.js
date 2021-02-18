const getters = {
  endpoints: (state, getters) => {
    let authUrlBase
    const mmUrlBase = 'https://mm.cxdemo.net/api/v1'

    if (getters.isProduction) {
      // production
      authUrlBase = '/api/v1/auth'
    } else {
      // development
      // authUrlBase = 'http://localhost:3032/api/v1/auth'

      // use production APIs
      authUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth'
    }

    return {
      webex: authUrlBase + '/resource/joinGeneralSupportRoom',
      authVersion: authUrlBase + '/version',
      logout: authUrlBase + '/logout',
      demoBaseConfig: mmUrlBase + '/demo',
      vertical: mmUrlBase + '/verticals',
      provision: authUrlBase + '/provision',
      userDemoConfig: authUrlBase + '/user/demo',
      user: authUrlBase + '/user',
      instance: authUrlBase + '/instance',
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