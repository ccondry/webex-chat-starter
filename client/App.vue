<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="!authCheckDone" :can-cancel="false"></b-loading>
    <div v-if="authenticated">
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
                        <li>
                          <a href="/customer">Customer Profiles</a>
                        </li>
                        <li v-if="isDcloud || user.admin">
                          <a href="/pcce">Packaged Contact Center Enterprise 11.6v3 Instant Demo</a>
                        </li>
                        <li v-if="isDcloud || user.admin">
                          <a href="/uccx">Unified Contact Center Express 12.0v2 Instant Demo</a>
                        </li>
                        <li v-if="isDcloud || user.admin">
                          <a href="/cwcc">Webex Contact Center v1 Instant Demo</a>
                        </li>
                        <li>
                          <a href="/branding">Demo Branding</a>
                        </li>
                        <li v-if="isCxdemo">
                          <a href="/chat">Facebook &amp; SMS Entry Points</a>
                        </li>
                        <li v-if="isCxdemo">
                          <a href="/cjp-ccone">CJP CCOne Demo</a>
                        </li>
                        <li v-if="isCxdemo">
                          <a href="/cjp-webex">CJP Webex Demo</a>
                        </li>
                        <li v-if="isCxdemo">
                          <a href="/cwcc-tsa">CWCC TSA Demo</a>
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>

              <!-- Admin pages -->
              <div class="tile is-ancestor" v-if="user.admin || user.isSupport">
                <div class="tile is-parent is-3">
                </div>
                <div class="tile is-parent is-6">
                  <article class="tile is-child box">
                    <h1 class="title">Support Pages</h1>
                    <div class="content">
                      <ul>
                        <li>
                          <a href="/management">Management and Administration</a>
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>
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
        if (this.authenticated === false) {
          // user is not authenticated - send them to login
          if (this.isProduction) {
            // production - redirect to login page
            window.location = '/auth/login?destination=' + window.location
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
      'authenticated',
      'isProduction'
    ])
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
