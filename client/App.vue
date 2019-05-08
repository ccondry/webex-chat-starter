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
                <a href="/pcce">PCCE Instant Demo</a>
              </li>
              <!-- <li><a href="/uccx">UCCX Instant Demo Toolbox</a></li> -->
              <li>
                <a href="/branding">Demo Branding</a>
              </li>
              <li>
                <a href="/chat">Facebook &amp; SMS Entry Points</a>
              </li>
              <li>
                <a href="/cjp-ccone">CJP CCOne Demo</a>
              </li>
            </ul>
            <!-- Admin pages -->
            <div v-if="user.admin">
              <p>
                Admin Pages
              </p>
              <ul>
                <li>
                  <a href="/customer">Customer Profile (in development)</a>
                </li>
                <li>
                  <a href="/uccx">UCCX Instant Demo (in development)</a>
                </li>
                <li>
                  <a href="/rcdn">RCDN (Compete Lab) Demos (in development)</a>
                </li>
              </ul>
            </div>
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
