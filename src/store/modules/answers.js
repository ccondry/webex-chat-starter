import * as types from '../mutation-types'
import {
  ToastProgrammatic as Toast,
  DialogProgrammatic as Dialog
} from 'buefy/src'

const state = {
  kb: {}
}

const mutations = {
  [types.SET_KNOWLEDGE_BASE] (state, data) {
    state.kb = data
  }
}

const getters = {
  kb: state => state.kb
}

const actions = {
  async getKnowledgeBase ({dispatch, getters}) {
    const response = await dispatch('fetch', {
      group: 'user',
      type: 'answers',
      url: getters.endpoints.answers,
      message: 'Get Cisco Answers knowledge base',
      showNotification: false,
      mutation: types.SET_KNOWLEDGE_BASE
    })
    if (response instanceof Error) {
      if (response.status === 404) {
        // not found - no error message
      } else {
        // other error
        Toast.open({
          message: 'Get Cisco Answers knowledge base failed: ' + response.message
        })
      }
    } else {
      // success
    }
  },
  async uploadFile ({dispatch, getters}, file) {
    const response = await dispatch('fetch', {
      group: 'user',
      type: 'answers',
      url: getters.endpoints.answers,
      options: {
        method: 'POST',
        body: {
          name: file.name,
          data: file.data
        }
      },
      message: 'Upload Cisco Answers knowledge base',
      showNotification: false
    })

    if (response instanceof Error) {
      // error
    } else {
      // success
      // refresh kb display data
      dispatch('getKnowledgeBase')
      // was it created or updated?
      if (response.status === 201) {
        // created - let user know it could be a while
        let message = 'Your Cisco Answers knowledge base file has been '
        message += 'uploaded. Please allow 24-48 hours for your file to be '
        message += 'added to the demo platform.'
        Dialog.alert({
          title: 'Upload Complete',
          message,
          type: 'is-success',
          rounded: true,
          confirmText: 'OK'
        })
      } else {
        // updated
        Toast.open({
          message: 'Your Cisco Answers knowledge base has been updated successfully.',
          duration: 5 * 1000
        })
      }
    }
  }
}

export default {
  actions,
  getters,
  mutations,
  state
}
