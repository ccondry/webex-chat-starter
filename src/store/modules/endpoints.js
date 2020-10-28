const getters = {
  endpoints: (state, getters) => {
    let authUrlBase

    if (getters.isProduction) {
      // production
      authUrlBase = '/api/v1/auth'
    } else {
      // development
      authUrlBase = 'http://localhost:3032/api/v1/auth'
    }

    return {
      webex: authUrlBase + '/resource/joinUccxSupportRoom',
      version: authUrlBase + '/version',
      links: authUrlBase + '/landing/link',
      logout: authUrlBase + '/logout'
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