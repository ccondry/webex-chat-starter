<template>
  <section>
    <b-loading :active="isWorking" :is-full-page="false" />
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
  </section>
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
      'working'
    ]),
    isWorking () {
      return this.working.user.file
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
          // let user know it could be a while
          this.$buefy.dialog.alert({
            title: 'Upload Complete',
            message: `Your Cisco Answers knowledge base file has been uploaded.
            Please allow 24-48 hours for your file to be added to the demo
            platform.`,
            type: 'is-success',
            rounded: true,
            confirmText: 'OK'
          })
        })
      }
      // make user confirm they want to upload the file
      this.$buefy.dialog.confirm({
        title: 'Confirm Upload',
        message: `Are you sure you want to upload <b>${this.file.name}</b> as a Cisco Answers knowledge base?`,
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
