<template>
  <panel :title="title" :aria-id="ariaId">
    <ul>
      <li v-for="link of links" :key="link._id">
        <a :href="link.href">{{ link.text }}</a>
        <b-tag
        v-if="link.tags && link.tags.includes('new')"
        style="margin-left: 0.5rem;"
        class="blinking"
        type="is-info"
        >
          New
        </b-tag>
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
      type: String,
      default: ''
    },
    links: {
      required: true,
      type: Array
    }
  }
}
</script>