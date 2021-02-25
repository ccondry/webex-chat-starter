<template>
  <div>
    <!-- main -->
    <div
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <section class="main">
        <!-- links list -->
        <links />

        <!-- Copyright and version footer -->
        <app-footer />
      </section>
    </div>
  </div>
</template>

<script>
import Links from './components/links'
import AppFooter from './components/app-footer'

export default {
  components: {
    Links,
    AppFooter
  }
}
</script>
