<template>
  <panel title="Provision Webex Contact Center v4" aria-id="provision">
    <p v-if="isLocked">
      <!-- provisioning is not enabled for this instance -->
      Provisioning is disabled for this demo instance. Please try using
      another dCloud datacenter or a newer version of this demo (if one is
      available).
    </p>
    <p v-if="!isLocked">
      Would you like to provision your account?
    </p>
    <b-field v-if="!isLocked">
      <b-button
      :disabled="working.user.provision"
      type="is-success"
      rounded
      expanded
      @click.prevent="clickProvision"
      >
        {{ buttonText }}
      </b-button>
    </b-field>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'working',
      'isLocked'
    ]),
    buttonText () {
      if (this.working.user.provision) {
        return `Working...`       
      } else {
        return 'Provision Me'
      }
    }
  },

  methods: {
    ...mapActions([
      'provisionUser'
    ]),
    clickProvision () {
      console.log('user clicked Provision Me button')
      this.provisionUser()
    }
  }
}
</script>