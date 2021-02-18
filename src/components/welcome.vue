<template>
  <panel :title="`Welcome ${jwtUser.firstName}!`" aria-id="welcome">
    <p>
      Welcome to the dCloud
      <strong>Cloud Configuration</strong>
      Toolbox!
    </p>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'jwtUser'
    ])
  }
}
</script>
