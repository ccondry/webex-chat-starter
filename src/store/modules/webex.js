import {ToastProgrammatic as Toast} from 'buefy/src'

const actions = {
  async joinSupportRoom ({dispatch, getters}, email) {
    try {
      await dispatch('fetchToState', {
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
  actions
}