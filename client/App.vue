<template>
  <div id="app">
    <!-- main section -->
    <div style="min-height: calc(100vh - 1.6em);">
      <!-- loading indicator -->
      <b-loading
      :is-full-page="true"
      :active="!authCheckDone"
      :can-cancel="false"></b-loading>

      <!-- main content -->
      <div v-if="isAuthenticated">
        <navbar :show="true"></navbar>
        <section class="app-main">
          <div class="container is-fluid is-marginless app-content">
            <!-- <levelbar></levelbar> -->
            <transition
              mode="out-in"
              enter-active-class="fadeIn"
              leave-active-class="fadeOut"
              appear>
              <div>
                <div class="tile is-ancestor">
                  <div class="tile is-parent is-3">
                  </div>
                  <div class="tile is-parent is-6">
                    <article class="tile is-child box">
                      <h1 class="title">dCloud Collaboration Toolbox</h1>
                      <div class="content">
                        <ul>
                          <li v-for="(link, index) of links" :key="index">
                            <span v-if="link.href">
                              <a :href="link.href">{{ link.text }}</a>
                            </span>
                            <span v-else>
                              {{ link.text }}
                            </span>
                            <b-tag v-if="link.tags.includes('new')" :type="flashing">New</b-tag>
                          </li>
                        </ul>
                      </div>
                    </article>
                  </div>
                </div>

                <!-- Admin pages -->
                <div class="tile is-ancestor"
                v-if="user.admin || user.isSupport">
                  <div class="tile is-parent is-3">
                  </div>
                  <div class="tile is-parent is-6">
                    <article class="tile is-child box">
                      <h1 class="title">Support Pages</h1>
                      <div class="content">
                        <ul>
                          <li>
                            <a href="/management">
                              Management and Administration
                            </a>
                          </li>
                        </ul>
                      </div>
                    </article>
                  </div>
                </div>
                <!-- /Admin pages -->
              </div>
            </transition>
          </div>
        </section>
      </div>
    </div>
    <!-- footer -->
    <footer class="footer" style="height: 1.6em; padding: 0; background-color: #ebebeb">
      <div class="content">
        <small style="padding-right: 2em; padding-left: 1em;">
          UI version {{ uiVersion }}
        </small>
        <!-- <small style="padding-right: 2em;">
          REST API version {{ apiVersion }}
        </small> -->
        <small>
          Auth API version {{ authApiVersion }}
        </small>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Navbar from 'components/nav-bar'

export default {
  data () {
    return {
      authCheckDone: false,
      alternator: true
    }
  },

  components: {
    Navbar
  },

  methods: {
    ...mapActions([
      'checkLogin',
      'setJwt',
      'getApiVersion'
    ]),
    async authCheck () {
      try {
        // check the JWT in localstorage to see if the user is already logged in
        console.log('checking login...')
        await this.checkLogin()
        console.log('checking login done.')
        this.authCheckDone = true
        if (this.isAuthenticated === false) {
          // user is not authenticated - send them to login
          if (this.isProduction) {
            // production - redirect to login page
            // window.location = '/auth/login?destination=' + window.location
          } else {
            // development - pop JWT form
            this.clickLogin()
          }
        }
      } catch (e) {
        console.log('failed to check login:', e.message)
      }
    },

    clickLogin () {
      this.$buefy.dialog.prompt({
        message: `Enter your JWT to log in`,
        inputAttrs: {
          placeholder: 'JWT'
        },
        onConfirm: (value) => {
          this.setJwt(value)
        }
      })
    }
  },

  mounted () {
    this.getApiVersion()
    this.authCheck()
    // set up alternator to flip between true and false every second
    setInterval(() => {
      this.alternator = !this.alternator
    }, 1000)
  },

  computed: {
    ...mapGetters([
      'user',
      'isCxdemo',
      'isDcloud',
      'isAuthenticated',
      'isProduction',
      'datacenter',
      'uiVersion',
      'authApiVersion'
    ]),
    flashing () {
      return this.alternator ? 'is-default' : 'is-primary'
    },
    links () {
      return this.allLinks.filter(v => {
        // always show all common links
        if (v.tags.includes('common')) {
          return true
        }
        // remove cxdemo links from dcloud domain viewers
        if (this.isDcloud && v.tags.includes('cxdemo')) {
          return false
        }
        // show all links to admins and users in QA group
        if (this.user.admin || (this.user.groups && this.user.groups.includes('QA'))) {
          return true
        }
        // normal user sees all links, minus development links
        return !v.tags.includes('development')
      })
    },
    allLinks () {
      const ret = []
      ret.push({
        href: '/customer',
        text: 'Customer Profiles',
        tags: ['common']
      })
      ret.push({
        href: '/branding',
        text: 'Demo Branding',
        tags: ['common']
      })
      ret.push({
        href: '/pcce',
        text: 'Packaged Contact Center Enterprise 11.6v3 Instant Demo',
        tags: ['dcloud']
      })
      ret.push({
        href: '/pcce-12-0',
        text: 'Packaged Contact Center Enterprise 12.0v2 Instant Demo',
        tags: ['dcloud', 'new']
      })
      ret.push({
        href: '/uccx',
        text: 'Unified Contact Center Express 12.0v2 Instant Demo',
        tags: ['dcloud']
      })
      ret.push({
        href: '/cwcc',
        text: 'Webex Contact Center v2 Instant Demo',
        tags: ['dcloud']
      })
      ret.push({
        href: '/webex-v3prod',
        text: 'Webex Contact Center v3 Instant Demo',
        tags: ['dcloud', 'new', 'development']
      })
      ret.push({
        href: '/wxm',
        text: 'Webex Experience Management v1 Instant Demo',
        tags: ['dcloud', 'new', 'development']
      })
      ret.push({
        href: '/chat',
        text: 'Facebook & SMS Entry Points',
        tags: ['cxdemo']
      })
      ret.push({
        href: '/cjp-ccone',
        text: 'CJP CCOne Demo',
        tags: ['cxdemo']
      })
      ret.push({
        href: '/cjp-webex',
        text: 'CJP Webex Demo',
        tags: ['cxdemo']
      })
      ret.push({
        href: '/cwcc-tsa',
        text: 'CWCC TSA Demo',
        tags: ['cxdemo']
      })

      return ret
    }
  },

  watch: {
    async isAuthenticated (val, oldVal) {
      // if user goes from logged in to logged out, forward them to the login page
      if (oldVal === true && val === false) {
        if (this.isProduction) {
          // production - redirect to login page
          window.location = '/auth/login?destination=' + window.location
        } else {
          // development - pop JWT form
          this.clickLogin()
        }
      }
    }
  }
}
</script>

<style lang="scss">

html {
  background-color: darkgrey;
  height: 100%;
  overflow: hidden;
}

body {
  height: 100%;
  overflow-y: scroll;
}

#app {
  height: 100%;
}

.app-main {
  padding-top: 50px;
  transform: translate3d(0, 0, 0);
}

.app-content {
  padding: 20px;
}
</style>
