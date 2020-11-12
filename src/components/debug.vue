<template>
  <panel title="Debug" aria-id="debug">
    <pre>{{ userDemoConfig }}</pre>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'userDemoConfig'
    ])
  }
}
</script>
