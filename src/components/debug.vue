<template>
  <panel title="Debug" aria-id="debug">
    <pre>{{ demoUserConfig }}</pre>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'demoUserConfig'
    ])
  }
}
</script>
