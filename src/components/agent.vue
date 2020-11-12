<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <p class="title">
        {{ agent.name }}
      </p>

      <p class="subtitle">
        {{ agent.description }}
      </p>

      <img :src="agent.picture" style="width: 128px; height: 128px;">

      <p>
        <strong>
          RDP Username:
          {{ agent.rdpUsername }}
        </strong>
        <copy :value="agent.rdpUsername" name="RDP Username" />
      </p>

      <p>
        <strong style="white-space:nowrap">
          Finesse Username:
          {{ agent.finesseUsername }}
        </strong>
        <copy :value="agent.finesseUsername" name="Finesse Username" />
      </p>

      <p>
        <strong>
          Password:
          {{ agent.password }}
        </strong>
        <copy :value="agent.password" name="Password" />
      </p>
      
      <p>
        <strong>
          Extension:
          {{ agent.extension }}
        </strong>
        <copy :value="agent.extension" name="Extension" />
      </p>
    </article>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    agent: {
      required: true,
      type: Object
    }
  },

  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>