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
        <b-loading :active="isLoading || isWorking" />

        <!-- welcome -->
        <welcome />

        <!-- Provision -->
        <provision v-if="!isProvisioned" />

        <!-- Agents and Supervisors -->
        <agents v-if="isProvisioned" />

        <!-- Demo Website -->
        <demo-website v-if="isProvisioned" />

        <!-- Reprovision -->
        <reprovision v-if="isProvisioned" />

        <!-- Admin -->
        <admin v-if="isAdmin || isAdminSu" />

        <!-- debug info -->
        <debug v-if="!isProduction" />

        <!-- Copyright and version footer -->
        <app-footer />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Navbar from './components/navbar'
import Welcome from './components/welcome'
import Provision from './components/provision'
import Agents from './components/agents'
import DemoWebsite from './components/demo-website'
import Reprovision from './components/reprovision'
import AppFooter from './components/app-footer'
import Debug from './components/debug'
import Admin from './components/admin'

export default {
  components: {
    Navbar,
    Welcome,
    Provision,
    Agents,
    DemoWebsite,
    Reprovision,
    AppFooter,
    Debug,
    Admin
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isAdmin',
      'isAdminSu',
      'jwtUser',
      'loading',
      'working',
      'isProvisioned',
      'isProduction',
      'userDemoConfig',
      'provisionStatus'
    ]),
    isLoading () {
      return this.loading.app.environment ||
      this.loading.user.provision ||
      this.loading.user.details
    },
    isWorking () {
      return this.working.user.provision || this.provisionStatus === 'working'
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
    },
    provisionJobId (val) {
      if (val) {
        if (this.provisionStatus === null || this.provisionStatus === 'working') {
          
        } else {
          // stop interval
          clearInterval(this.interval)
        }
      }
    },
    provisionStatus (val) {
      if (val === 'working') {
        // start interval to refresh provision status until its done
        this.interval = setInterval(() => {
          this.getProvisionStatus()
        }, 4 * 1000)
      } else if (val !== null) {
        // success or error - stop interval
        clearInterval(this.interval)
        // get updated user data
        this.getUser()
      }
    }
  },

  mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkJwt()
    // get the REST API version
    this.getApiVersion()
    // get the Authentication REST API version
    this.getAuthApiVersion()
    // get the demo base configuration for webex-v4
    this.getDemoBaseConfig()
    // get demo verticals list
    this.getVerticals()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getAuthApiVersion',
      'getApiVersion',
      'login',
      'getDemoBaseConfig',
      'getVerticals',
      'getProvisionStatus',
      'getUser'
    ])
  }
}
</script>
