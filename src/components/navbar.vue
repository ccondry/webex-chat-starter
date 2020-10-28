<template>
  <b-navbar
  :transparent="true"
  :fixed-top="true"
  style="background-color: rgba(0, 0, 0, 0)"
  >
    <template slot="end">
      <div class="navbar-item">
        <div class="buttons">
          <b-button
          v-if="isAdmin"
          type="is-info"
          rounded
          @click="clickAdmin"
          >
            Admin
          </b-button>

          <b-button
          type="is-info"
          rounded
          @click="clickLogout"
          >
            Log Out
          </b-button>
        </div>
      </div>
    </template>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'isAdminSu',
      'isAdmin'
    ])
  },
  
  methods: {
    ...mapActions([
      'logout'
    ]),
    clickLogout () {
      this.logout()
    },
    clickAdmin () {
      window.location = '/management'
    }
  }
}
</script>