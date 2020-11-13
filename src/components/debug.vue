<template>
  <panel title="Debug" aria-id="debug">
    <pre>{{ userDemoConfig }}</pre>
    <!-- <pre>{{ user }}</pre> -->
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'user',
      'userDemoConfig'
    ])
  }
}
</script>
