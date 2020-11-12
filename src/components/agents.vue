<template>
  <panel title="Agents and Supervisor" aria-id="agents">
    <div style="display: flex; flex-wrap: wrap;">
      <agent
      v-for="(agent, i) of agents"
      :key="i"
      :agent="agent"
      />
    </div>
  </panel>
</template>


<script>
import {mapGetters} from 'vuex'
import Agent from './agent'

export default {
  components: {
    Agent
  },

  computed: {
    ...mapGetters([
      'agents'
    ])
  }
}
</script>
