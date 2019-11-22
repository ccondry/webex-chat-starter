<template>
  <div id="app">
    <b-loading
    :is-full-page="true"
    :active="!authCheckDone"
    :can-cancel="false"></b-loading>
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
                        <li v-for="link of links">
                          <span v-if="link.href">
                            <a :href="link.href">{{ link.text }}</a>
                          </span>
                          <span v-else>
                            {{ link.text }}
                          </span>
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
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Navbar from 'components/nav-bar'

export default {
  data () {
    return {
      authCheckDone: false
    }
  },

  components: {
    Navbar
  },

  methods: {
    ...mapActions([
      'checkLogin',
      'setJwt'
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
    this.authCheck()
  },

  computed: {
    ...mapGetters([
      'user',
      'isCxdemo',
      'isDcloud',
      'isAuthenticated',
      'isProduction',
      'datacenter'
    ]),
    links () {
      const ret = []
      // for everyone
      ret.push({
        link: '/customer',
        text: 'Customer Profiles'
      })
      ret.push({
        link: '/branding',
        text: 'Demo Branding'
      })

      // for dcloud users, or admins
      if (this.isDcloud || this.user.admin) {
        ret.push({
          link: '/pcce',
          text: 'Packaged Contact Center Enterprise 11.6v3 Instant Demo'
        })
        if (this.datacenter !== 'RTP') {
          // disable UCCX RTP for now
          ret.push({
            text: 'Unified Contact Center Express 12.0v2 Instant Demo (Temporarily Unavailable in RTP)'
          })
        } else {
          ret.push({
            link: '/uccx',
            text: 'Unified Contact Center Express 12.0v2 Instant Demo'
          })
        }
        ret.push({
          link: '/cwcc',
          text: 'Webex Contact Center v1 Instant Demo'
        })
      }
      // for cxdemo domains
      if (this.isCxdemo) {
        ret.push({
          link: '/chat',
          text: 'Facebook &amp; SMS Entry Points'
        })
        ret.push({
          link: '/cjp-ccone',
          text: 'CJP CCOne Demo'
        })
        ret.push({
          link: '/cjp-webex',
          text: 'CJP Webex Demo'
        })
        ret.push({
          link: '/cwcc-tsa',
          text: 'CWCC TSA Demo'
        })
      }

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
