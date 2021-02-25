<template>
  <panel title="Webex Contact Center v4 - Instant Demo Links">
    <ul>
      <li v-for="(link, index) of links" :key="index">
        <a 
        :href="link.href"
        style="font-size: 1.5rem;"
        target="_blank"
        >
          {{ link.text }}
        </a>
        <copy :value="link.href" :name="link.text" />
      </li>
    </ul>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      links: [{
        text: 'Agent Desktop',
        href: 'https://desktop.wxcc-us1.cisco.com'
      }, {
        text: 'Control Hub',
        href: 'https://admin.webex.com'
      }, {
        text: 'Management Portal',
        href: 'https://portal.wxcc-us1.cisco.com'
      }]
    }
  }
}
</script>
