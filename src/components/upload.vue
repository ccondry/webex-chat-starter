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
export default {
  data () {
    return {
      file: null,
      isWorking: false
    }
  },

  watch: {
    file (val) {
      if (!val) {
        return
      }
      this.$buefy.dialog.confirm({
        title: 'Upload KB File?',
        message: `Are you sure you want to upload <b>${this.file.name}</b> as a Cisco Answers knowledge base?`,
        type: 'is-success',
        rounded: true,
        confirmText: 'Upload',
        onConfirm: () => {
          // TODO implement real upload here
          this.isWorking = true
          setTimeout(() => {
            this.isWorking = false
            this.$buefy.toast.open({
              type: 'is-success',
              message: 'Uploaded file!'
            })
            this.file = null
          }, 2000)
        },
        onCancel: () => {
          this.file = null
        }
      })
    }
  }
}
</script>
