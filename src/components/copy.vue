<template>
  <a
  style="padding-left: 0.2rem;"
  @click="clickCopy"
  >
    <b-icon icon="layers" />
  </a>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    value: {
      required: true,
      type: String
    },
    name: {
      required: true,
      type: String
    }
  },

  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickCopy () {
      this.copyToClipboard({
        string: this.value,
        type: this.name
      })
    }
  }
}
</script>