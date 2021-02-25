<template>
  <div>
    <!-- top navbar -->
    <navbar />
    <!-- main -->
    <div
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <section class="main">
        <!-- loading -->
        <b-loading :active="isProduction && (isLoading || isWorking)" />

        <!-- welcome -->
        <welcome />

        <!-- upload Agent Answers KB -->
        <upload-agent-answers v-if="isLoggedIn" />

        <!-- current Agent Answers KB -->
        <current-agent-answers v-if="isLoggedIn" />

        <!-- Copyright and version footer -->
        <app-footer />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Navbar from './components/navbar'
import Welcome from './components/welcome'
import UploadAgentAnswers from './components/upload-agent-answers'
import CurrentAgentAnswers from './components/current-agent-answers'
import AppFooter from './components/app-footer'

export default {
  components: {
    Navbar,
    Welcome,
    UploadAgentAnswers,
    CurrentAgentAnswers,
    AppFooter
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser',
      'loading',
      'working',
      'isProduction'
    ]),
    isLoading () {
      return this.loading.app.environment ||
      this.loading.user.details
    },
    isWorking () {
      return false
    }
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
      } else if (!val && oldVal) {
        // user just logged out. make them log in again.
        this.login()
      }
    }
  },

  mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkJwt()
    // get the Authentication REST API version
    this.getApiVersion()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getApiVersion',
      'login'
    ])
  }
}
</script>
