<template>
  <section>
    <b-field class="file">
      <b-upload v-model="file" expanded>
        <a class="button is-primary is-fullwidth">
          <b-icon icon="upload" />
          <span>{{ file.name || "Click to upload" }}</span>
        </a>
      </b-upload>
    </b-field>
    <b-field>
      <b-upload v-model="dropFiles"
      multiple
      drag-drop
      expanded
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large" />
            </p>
            <p>Drop your files here or click to upload</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="tags">
      <span v-for="(f, index) in dropFiles" :key="index" class="tag is-primary">
        {{ f.name }}
        <button class="delete is-small" type="button" @click="deleteDropFile(index)" />
      </span>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      file: {},
      dropFiles: []
    }
  },
  methods: {
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    }
  }
}
</script>
