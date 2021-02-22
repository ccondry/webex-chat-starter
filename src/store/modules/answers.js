const actions = {
  async uploadFile ({dispatch, getters}, file) {
    console.log('uploadFile', file)
    await dispatch('fetch', {
      group: 'user',
      type: 'file',
      url: getters.endpoints.answers,
      options: {
        method: 'POST',
        body: {
          name: file.name,
          data: file.data
        }
      },
      message: 'Upload file',
      showNotification: true
    })
  }
}

module.exports = {
  actions
}
