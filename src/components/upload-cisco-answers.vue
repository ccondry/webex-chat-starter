<template>
  <panel title="Upload Cisco Answers KB">
    <b-loading :active="isLoading || isWorking" :is-full-page="false" />
    <b-field>
      <b-upload v-model="file"
      drag-drop
      expanded
      accept=".csv"
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large" />
            </p>
            <p>Upload your Cisco Answers KB Base CSV file here</p>
          </div>
        </section>
      </b-upload>
    </b-field>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      file: null
    }
  },

  computed: {
    ...mapGetters([
      'loading',
      'working',
      'kb'
    ]),
    isLoading () {
      return this.loading.user.answers
      // return true
    },
    isWorking () {
      return this.working.user.answers
    }
  },

  watch: {
    file (val) {
      if (!val) {
        return
      }

      // set up file reader
      const reader = new window.FileReader()
      reader.onload = (e) => {
        const data = e.currentTarget.result
        this.uploadFile({
          name: this.file.name,
          data
        }).then(() => {
          // reset file upload
          this.file = null
        })
      }
      let message = `Are you sure you want to upload <b>${this.file.name}</b> `
      message += 'as a Cisco Answers knowledge base?'
      if (this.kb && this.kb.data) {
        message += ' This will <strong>overwrite</strong> your existing knowledge base.'
      }
      // make user confirm they want to upload the file
      this.$buefy.dialog.confirm({
        title: 'Confirm Upload',
        message,
        type: 'is-success',
        rounded: true,
        confirmText: 'Upload',
        onConfirm: () => {
          // read the file data and upload the file
          reader.readAsDataURL(this.file)
        },
        onCancel: () => {
          this.file = null
        }
      })
    }
  },

  methods: {
    ...mapActions([
      'uploadFile'
    ])
  }
}
</script>
