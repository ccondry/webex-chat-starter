<template>
  <div id="app">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-4">
      </div>
      <div class="tile is-parent is-4">
        <article class="tile is-child box">
          <h1 class="title">dCloud Collaboration Toolbox</h1>
          <div class="content">
            <ul>
              <li>
                <a href="/pcce">PCCE Instant Demo</a>
              </li>
              <!-- <li>
                <a href="/uccx">UCCX Instant Demo Toolbox</a>
              </li> -->
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
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  methods: {
    ...mapActions(['checkLogin'])
  },

  beforeMount () {
    this.checkLogin()
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
