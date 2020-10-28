<template>
  <panel :title="title" :aria-id="ariaId">
    <ul>
      <li v-for="link of links" :key="link._id">
        <strong><a :href="link.href">{{ link.text }}</a></strong>
      </li>
    </ul>
  </panel>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    ariaId: {
      type: String
    },
    links: {
      required: true,
      type: Array
    }
  }
}
</script>