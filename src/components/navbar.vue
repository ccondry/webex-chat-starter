<template>
  <b-navbar
  :transparent="true"
  :fixed-top="true"
  style="background-color: rgba(0, 0, 0, 0)"
  >
    <template slot="end">
      <b-field class="navbar-item">
        <b-button
        type="is-info"
        rounded
        @click="clickLogout"
        >
          Log Out
        </b-button>
      </b-field>
    </template>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'isAdminSu'
    ])
  },
  
  methods: {
    ...mapActions([
      'logout'
    ]),
    clickLogout () {
      this.logout()
    }
  }
}
</script>