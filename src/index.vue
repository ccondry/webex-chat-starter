<template>
  <div>
    <b-loading :is-full-page="true" :active="isLoading" />
    <!-- main -->
    <!-- <div
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <section class="main">
        <div class="content">
          <pre>{{ query }}</pre>
          <pre>{{ userId }}</pre>
          <pre>{{ sessionInfo.configuration }}</pre>
        </div>
      </section>
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {getUrlQueryParams} from './utils'

export default {
  data () {
    return {
      query: {},
      userId: '',
      webexLoading: false
    }
  },

  computed: {
    ...mapGetters([
      'sessionInfo',
      'loading'
    ]),
    datacenter () {
      return this.query.datacenter
    },
    session () {
      return this.query.session
    },
    isLoading () {
      return this.loading.user.session || this.webexLoading
    }
  },

  watch: {
    userId (val) {
      if (val.length === 4) {
        // get session info with user config
        this.getSessionInfo({
          datacenter: this.datacenter,
          session: this.session,
          userId: this.userId
        })
      }
    },
    sessionInfo (val) {
      if (val && val.configuration && val.configuration.templateId) {
        const config = val.configuration
        // has chat template ID - try to start chat
        this.initWebexChat({
          async: typeof config.async === 'boolean' ? config.async : true,
          CiscoAppId: config.CiscoAppId,
          appPrefix: config.appPrefix,
          DC: config.DC,
          orgId: config.orgId,
          templateId: config.templateId
        })
      }
    }
  },

  mounted () {
    // copy URL query parameters to data
    this.query = getUrlQueryParams()
    // set user ID, if available
    this.userId = this.query.userId || ''
    this.checkUserId()
  },

  methods: {
    ...mapActions([
      'getSessionInfo'
    ]),
    checkUserId () {
      if (this.userId.length !== 4) {
        // get user ID
        this.$buefy.dialog.prompt({
          message: 'What is your user ID?',
          rounded: true,
          confirmText: 'Submit',
          type: 'is-primary',
          canCancel: false,
          inputAttrs: {
            value: this.userId
          },
          onConfirm: (value) => {
            this.userId = value
          }
        })
      }
    },
    initWebexChat (config) {
      console.log('initWebexChat:', config)
      const bubbleScript = document.createElement('script')
      const element = document.getElementsByTagName('script')[0]
      bubbleScript.async = config.async
      bubbleScript.CiscoAppId = config.CiscoAppId
      bubbleScript.appPrefix = config.appPrefix || ''
      bubbleScript.DC = config.DC
      bubbleScript.orgId = config.orgId
      bubbleScript.templateId = config.templateId
      bubbleScript.src = 'https://' + bubbleScript.appPrefix + 'bubble.' + bubbleScript.DC + '/bubble.js'
      bubbleScript.type = 'text/javascript'
      bubbleScript.setAttribute('charset', 'utf-8')
      element.parentNode.insertBefore(bubbleScript, element)
      element.onload(() => {
        this.webexLoading = false
      })
    }
  }
}
</script>
