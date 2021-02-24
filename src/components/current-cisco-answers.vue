<template>
  <panel
  title="Your Current Cisco Answers KB"
  aria-id="current-cisco-answers-kb"
  :has-refresh="true"
  >
    <b-table
    style="width: 100%;"
    :loading="isLoading || isWorking"
    :data="kbJson"
    :narrowed="true"
    :paginated="true"
    >
      <b-table-column
      v-slot="props"
      sortable
      searchable
      field="question"
      label="Question"
      >
        {{ props.row.question }}
      </b-table-column>
      <b-table-column
      v-slot="props"
      sortable
      searchable
      field="answer"
      label="Answer"
      >
        {{ props.row.answer }}
      </b-table-column>

      <!-- empty table display -->
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p v-if="isLoading">
              Checking for your Cisco Answers KB...
            </p>
            <p v-else>
              No Cisco Answers KB found for your user account.
            </p>
          </div>
        </section>
      </template>

      <!-- table footer -->
      <template slot="footer">
        <div class="has-text-right">
          <!-- download -->
          <b-button
          v-if="kbJson.length"
          style="margin-right: 1rem;"
          type="is-info"
          rounded
          tag="a"
          :href="csvHref"
          :download="`${userId}.csv`"
          >
            Download CSV
          </b-button>

          <!-- refersh -->
          <b-button
          style="margin-right: 1rem;"
          type="is-primary"
          rounded
          @click="clickRefresh"
          >
            Refresh
          </b-button>
          Total Questions: {{ kbJson.length }}
        </div>
      </template>
    </b-table>
  </panel>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {csvStringToArray} from '../utils'

export default {
  computed: {
    ...mapGetters([
      'kb',
      'loading',
      'working',
      'user'
    ]),
    userId () {
      try {
        return this.user.id
      } catch (e) {
        return ''
      }
    },
    isLoading () {
      return this.loading.user.answers
      // return true
    },
    isWorking () {
      return this.working.user.answers
    },
    kbJson () {
      if (!this.kb.data) {
        return []
      }
      try {
        const json = csvStringToArray(this.kb.data)
        return json.map(row => {
          return {
            question: row[0],
            answer: row[1]
          }
        })
      } catch (e) {
        return []
      }
    },
    csvHref () {
      try {
        return `data:text/csv;charset=utf-8,${encodeURIComponent(this.kb.data)}`
      } catch (e) {
        return null
      }
    }
  },

  mounted () {
    this.getKnowledgeBase()
  },

  methods: {
    ...mapActions([
      'getKnowledgeBase'
    ]),
    clickRefresh () {
      this.getKnowledgeBase()
    },
    clickDownload () {
      //
    }
  }
}
</script>
