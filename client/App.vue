<template>
  <div id="app">
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
              <li>
                <a href="/pcce">PCCE 11.6v3 Instant Demo</a>
              </li>
              <li>
                <a href="/uccx">UCCX 12.0v2 Instant Demo</a>
              </li>
              <li>
                <a href="/branding">Demo Branding</a>
              </li>
              <li>
                <a href="/chat">Facebook &amp; SMS Entry Points</a>
              </li>
              <li>
                <a href="/cjp-ccone">CJP CCOne Demo</a>
              </li>
              <li>
                <a href="/cjp-webex">CJP Webex Demo</a>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>

    <!-- Admin pages -->
    <div class="tile is-ancestor" v-if="user.admin">
      <div class="tile is-parent is-3">
      </div>
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h1 class="title">Admin Pages</h1>
          <div class="content">
            <ul>
              <li>
                <a href="/rcdn">RCDN (Compete Lab) Demos (in development)</a>
              </li>
              <!-- <li>
                <a href="/wccc">Webex Cloud Contact Center Instant Demo</a>
              </li> -->
            </ul>
          </div>
        </article>
      </div>
    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  methods: {
    ...mapActions(['checkLogin'])
  },

  beforeMount () {
    this.checkLogin()
  },

  computed: {
    ...mapGetters(['user'])
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

</style>
