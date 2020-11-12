<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <p class="title" style="white-space:nowrap">
        {{ agent.name }}
      </p>

      <p class="subtitle">
        {{ agent.description }}
      </p>

      <img :src="agent.picture" style="width: 128px; height: 128px;">

      <p>
        <strong style="white-space:nowrap">
          Username:
          {{ agent.username }}
        </strong>
        <copy :value="agent.username" name="Username" />
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

      <p>
        <b-field v-if="agent.role === 'Agent'">
          <b-button
          type="is-success"
          rounded
          expanded
          @click="clickAgentPortal"
          >
            Go to Agent Desktop
          </b-button>
        </b-field>
        <b-field v-if="agent.role === 'Supervisor'">
          <b-button
          type="is-success"
          rounded
          expanded
          @click="clickWebexAdminPortal"
          >
            Go to Control Hub
          </b-button>
        </b-field>
        <!-- <b-field>
          <b-button
          type="is-success"
          @click="clickCjpAdminPortal"
          >
            Go to Management Portal
          </b-button>
        </b-field> -->
      </p>
    </article>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    agent: {
      required: true,
      type: Object
    }
  },

  computed: {
    ...mapGetters([
      'agentPortalUrl',
      'webexAdminPortalUrl',
      'cjpAdminPortalUrl'
    ])
  },
  
  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    },
    clickAgentPortal (e) {
      // open agent portal in new tab
      window.open(this.agentPortalUrl, '_blank')
    },
    clickWebexAdminPortal (e) {
      // open new admin portal in new tab
      window.open(this.webexAdminPortalUrl, '_blank')
    },
    clickCjpAdminPortal (e) {
      // open old admin portal in new tab
      window.open(this.cjpAdminPortalUrl, '_blank')
    }
  }
}
</script>