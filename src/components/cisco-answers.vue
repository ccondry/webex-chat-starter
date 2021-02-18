<template>
  <panel title="Cisco Answers" aria-id="agents">
    Upload Knowledge Base
  </panel>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  components: {
  },

  computed: {
    ...mapGetters([
      'agents'
    ])
  }
}
</script>
