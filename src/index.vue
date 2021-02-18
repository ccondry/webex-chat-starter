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

        <!-- Cisco Answers KBs -->
        <cisco-answers />

        <!-- debug info -->
        <!-- <debug v-if="!isProduction" /> -->

        <!-- Copyright and version footer -->
        <app-footer />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import navbar from './components/navbar'
import welcome from './components/welcome'
import ciscoAnswers from './components/cisco-answers'
import demoWebsite from './components/demo-website'
import reprovision from './components/reprovision'
import appFooter from './components/app-footer'
// import debug from './components/debug'
import admin from './components/admin'

export default {
  components: {
    navbar,
    welcome,
    ciscoAnswers,
    demoWebsite,
    reprovision,
    appFooter,
    // debug,
    admin
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
    // get the full user object
    this.getUser()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getApiVersion',
      'login',
      'getUser',
    ])
  }
}
</script>
