<template>
  <panel title="Provision" aria-id="provision">
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
  data () {
    return {
      timerEnd: 0,
      timerNow: 0
    }
  },
  computed: {
    ...mapGetters([
      'jwtUser',
      'working',
      'sessionId',
      'isLocked'
    ]),
    buttonText () {
      if (this.working.user.provision) {
        return `Working - ${this.provisionTime}`       
      } else {
        return 'Provision Me'
      }
    },
    timeLeft () {
      // returns the estimated time remaining to complete provisioning
      // const now = new Date().getTime()
      const timeLeft = this.timerEnd - this.timerNow
      return Math.ceil(timeLeft / 1000)
    },
    provisionTime () {
      if (this.timeLeft < 0) {
        return 'Almost done...'
      } else if (this.timeLeft > 500) {
        // validate sane output
        // over 500 is probably wrong... so say something else
        return `Estimating time remaining...`
      } else {
        return `About ${this.timeLeft} seconds remaining...`
      }
    }
  },

  methods: {
    ...mapActions([
      'provisionUser'
    ]),
    startTimer () {
      // advance the timer every 1 second
      setInterval(() => {
        this.timerNow = new Date().getTime()
      }, 1000)
    },
    clickProvision () {
      console.log('user clicked Provision Me button')
      this.provisionUser()
      // set timer for working estimate to 60 seconds
      this.timerEnd = new Date().getTime() + 60 * 1000
      this.startTimer()
    }
  }
}
</script>