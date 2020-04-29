<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
        </div>
        <div class="nav-center">
          <nav class="level">
            <div class="level-item">
              <p>
                dCloud Collaboration Toolbox
              </p>
            </div>
          </nav>
        </div>
        <div class="nav-right is-flex">
          <span v-if="isAuthenticated" class="nav-item">{{ user.username }} ({{ user.id }})</span>
          <a v-if="isAuthenticated" @click="clickLogout" class="nav-item">Logout</a>
          <a v-if="!isAuthenticated && !isProduction" @click="clickLogin" class="nav-item">Login</a>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },

  props: {
    show: Boolean
  },

  mount () {
    if (!this.isAuthenticated && !this.isProduction) {
      // pop development login modal
      this.clickLogin()
    }
  },

  computed: {
    ...mapGetters([
      'isAuthenticated',
      'user',
      'isProduction'
    ])
  },

  methods: {
    ...mapActions([
      'logout',
      'setJwt'
    ]),
    clickLogout () {
      this.logout()
    },
    clickLogin () {
      this.$buefy.dialog.prompt({
        message: `Enter your JWT`,
        inputAttrs: {
          placeholder: 'JWT'
        },
        onConfirm: (value) => {
          this.setJwt(value)
        }
      })
    }
  },

  watch: {
  }
}
</script>

<style lang="scss" scoped>
@import '~bulma/bulma';
@import '~bulma/sass/utilities/variables';

.app-navbar {
  color: #28374B;
  font-weight: bold;
  a {
    color: #7957d5;
  }
  position: fixed;
  min-width: 100%;
  z-index: 4;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .nav {
    min-height: 0em;
  }

  .container {
    // margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.hero-head {
}
</style>
