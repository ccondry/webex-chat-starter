const getters = {
  endpoints: (state, getters) => {
    let authUrlBase

    if (getters.isProduction) {
      // production
      authUrlBase = '/api/v1/auth'
    } else {
      // development
      authUrlBase = 'http://localhost:3032/api/v1/auth'

      // use production APIs
      // authUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth'
    }

    return {
      authVersion: authUrlBase + '/version',
      logout: authUrlBase + '/logout',
      user: authUrlBase + '/user',
      answers: authUrlBase + '/answers/kb'
    }
  }
}

export default {
  getters
}
