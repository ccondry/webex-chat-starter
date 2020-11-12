<template>
  <!-- full config details for user when using admin using switch-user -->
  <panel title="Admin Configuration" aria-id="panel">
    <p>
      Manually configure this user's demo configuration.
    </p>
    <!-- vertical -->
    <b-field label="Vertical ID">
      <b-input v-model="model.vertical" />
    </b-field>

    <!-- queue -->
    <b-field label="Voice Queue ID">
      <b-input v-model="model.queueId" />
    </b-field>

    <!-- chat template -->
    <b-field label="Chat Template ID">
      <b-input
      v-model="model.templateId"
      :placeholder="defaults.templateId"
      />
    </b-field>

    <!-- org -->
    <b-field label="Org ID">
      <b-input
      v-model="model.orgId"
      :placeholder="defaults.orgId"
      />
    </b-field>

    <!-- DC -->
    <b-field label="DC">
      <b-input
      v-model="model.DC"
      :placeholder="defaults.DC"
      />
    </b-field>

    <!-- app ID -->
    <b-field label="Cisco App ID">
      <b-input
      v-model="model.CiscoAppId"
      :placeholder="defaults.CiscoAppId"
      />
    </b-field>

    <!-- prefix -->
    <b-field label="App Prefix">
      <b-input
      v-model="model.appPrefix"
      :placeholder="defaults.appPrefix"
      />
    </b-field>

    <!-- async -->
    <b-field label="Async">
      <b-checkbox v-model="model.async" />
    </b-field>

    <!-- Save Button -->
    <b-field>
      <b-button
      type="is-success"
      :disabled="disableSave"
      rounded
      expanded
      @click.prevent="clickSave"
      >
        Save
      </b-button>
    </b-field>
    <!-- /Save Button -->
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'defaults',
      'isAdmin',
      'isAdminSu',
      'userDemoConfig'
    ]),
    model () {
      return this.userDemoConfig
    },
    disableSave () {
      return false
    }
  }
}
</script>
