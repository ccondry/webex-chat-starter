<template>
  <panel title="Cisco Answers" aria-id="agents">
    <upload />
  </panel>
</template>

<script>
import {mapGetters} from 'vuex'
import Upload from './upload'

export default {
  components: {
    Upload
  },

  computed: {
    ...mapGetters([
      'agents'
    ])
  }
}
</script>
