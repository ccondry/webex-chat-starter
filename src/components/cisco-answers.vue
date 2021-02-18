<template>
  <panel title="Agents and Supervisor" aria-id="agents">
    <div style="display: flex; flex-wrap: wrap;">
      hi
    </div>
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
