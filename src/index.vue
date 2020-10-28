<template>
  <div>
    <!-- top navbar -->
    <navbar />
    <!-- loading -->
    <b-loading :active="isProduction && !links.length" :is-full-page="true" />
    <!-- main -->
    <div
    v-if="isLoggedIn && links.length"
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <section class="main">
        <!-- welcome -->
        <welcome />

        <!-- common links -->
        <link-group
        :links="commonLinks"
        title="Tools"
        aria-id="tools"
        />

        <!-- dcloud demos -->
        <link-group
        v-if="dcloudLinks.length"
        :links="dcloudLinks"
        title="Instant Demos"
        aria-id="instant-demos"
        />

        <!-- cxdemo demos -->
        <link-group
        v-if="cxdemoLinks.length"
        :links="cxdemoLinks"
        title="Other Demos"
        aria-id="other-demos"
        />

        <!-- QA -->
        <link-group
        v-if="qaLinks.length"
        :links="qaLinks"
        title="QA Testing"
        aria-id="qa"
        />

        <!-- Copyright and version footer -->
        <app-footer style="margin-bottom: 1rem;" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Navbar from './components/navbar'
import LinkGroup from './components/link-group'
import Welcome from './components/welcome'
import AppFooter from './components/app-footer'

export default {
  components: {
    Navbar,
    LinkGroup,
    Welcome,
    AppFooter
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isAdmin',
      'jwtUser',
      'links',
      'isProduction'
    ]),
    qaLinks () {
      return this.links.filter(link => link.tags.includes('qa'))
    },
    commonLinks () {
      return this.links.filter(link => link.tags.includes('common'))
    },
    dcloudLinks () {
      return this.links.filter(link => link.tags.includes('dcloud'))
    },
    cxdemoLinks () {
      return this.links.filter(link => link.tags.includes('cxdemo'))
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
    // get the REST API version
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

<style lang="scss">
// hide scroll bar
html, body {
  background-image: url(./assets/images/sign_in_background.jpg);
  // background-position: 0 0;
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

// make container fill viewport
#main-container {
  height: 100vh;
  padding-top: 1rem;
}

// each route content container class - centered
section.main {
  // flex layout
  display: flex;
  // keep small amounts of content vertically centered
  min-height: 100%;
  justify-content: center;
  // center panels horizontally
  align-items: center;
  // put content in a column down the page
  flex-direction: column;
}

section.main > div {
  // padding-bottom: 1rem;
}

// blinking for "new" tag
.blinking{
  animation: blinkingText 2s infinite;
}

@keyframes blinkingText{
  0% { background-color: currentColor; }
  49% { background-color: currentColor; }
  60% { background-color: transparent; }
  99% { background-color: transparent; }
  100% { background-color: currentColor; }
}

</style>
