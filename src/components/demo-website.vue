<template>
  <panel title="Demo Website" aria-id="demo-website">
    <b-loading :active="isLoading || isWorking" :is-full-page="false" />
    <p>
      Choose the vertical you want to use, then click Go to Demo Website to
      show the customer side of the demo.
    </p>
    <b-field>
      <b-select 
      v-model="vertical" 
      :disabled="working.app.user"
      @change.native="verticalChanged" 
      >
        <option :value="null" disabled selected>
          Choose Your Demo Vertical
        </option>
        <option
        v-for="(brand, index) in systemBrands" 
        :key="'system' + index"
        :value="brand.id"
        >
          {{ `${brand.name} (${brand.id})` }}
        </option>
        <option disabled>
          -----------------------------------------
        </option>
        <option
        v-for="(brand, index) in otherBrands"
        :key="'other' + index"
        :value="brand.id"
        >
          {{ `${brand.name} (${brand.id})` }}
        </option>
      </b-select>
    </b-field>
    
    <b-field>
      <b-checkbox
      v-model="showMore"
      >
        Show More
      </b-checkbox>
    </b-field>

    <b-field v-show="showMore">
      <div class="field">
        <div class="field">
          <b-radio
          v-if="isAdmin"
          v-model="brandFilter"
          native-value="all"
          >
            Show all verticals
          </b-radio>
        </div>
        <div class="field">
          <b-radio
          v-model="brandFilter"
          native-value="mine"
          >
            Show my verticals
          </b-radio>
        </div>
        <div class="field">
          <b-radio
          v-model="brandFilter"
          native-value="other"
          >
            <span style="float: left;">Show this user's verticals:</span>
          </b-radio>

          <b-autocomplete
          v-model="ownerFilter"
          :data="autocompleteOwners"
          style="width: 20em;"
          >
            <template slot="empty">
              No results found
            </template>
          </b-autocomplete>
        </div>
      </div>
    </b-field>

    <p>
      Note: You can create and configure your own vertical on the
      <a href="/branding" target="brand-toolbox">
        <strong>Demo Branding Toolbox</strong>
      </a>.
    </p>

    <b-field v-if="!isLocked">
      <b-button
      :disabled="working.app.user"
      type="is-success"
      rounded
      expanded
      @click="clickGo"
      >
        Go to Demo Website
      </b-button>
    </b-field>
  </panel>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      ownerFilter: '',
      brandFilter: 'mine',
      vertical: '',
      multichannel: 'ece',
      showMore: false
    }
  },

  computed: {
    ...mapGetters([
      'verticals',
      'working',
      'brandDemoLink',
      'cumulusDemoLink',
      'userDemoConfig',
      'isAdmin',
      'loading',
      'jwtUser',
      'isLocked'
    ]),
    isWorking () {
      return this.working.user.demoConfig
    },
    isLoading () {
      return this.loading.dcloud.verticals
    },
    autocompleteOwners () {
      // all owners of all verticals
      const allOwners = this.verticals.map(v => v.owner)
      // unique owners list
      const uniqueOwners = Array.from(new Set(allOwners))
      // remove
      return uniqueOwners.filter((option) => {
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.ownerFilter.toLowerCase()) >= 0
      })
    },
    sortedBrands () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.verticals))
        // case-insensitive sort by name
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        console.log(`couldn't get sorted brands`, e)
        return []
      }
    },
    systemBrands () {
      return this.sortedBrands.filter(v => !v.owner || v.owner === 'system' || v.owner === null)
    },
    otherBrands () {
      switch (this.brandFilter) {
        case 'all': return this.userBrands
        case 'mine': return this.myBrands
        case 'other': return this.filteredSortedBrands
        default: return []
      }
    },
    userBrands () {
      return this.sortedBrands.filter(v => v.owner && v.owner !== 'system' && v.owner !== null)
    },
    myBrands () {
      return this.sortedBrands.filter(v => v.owner === this.jwtUser.username)
    },
    filteredSortedBrands () {
      // filter to only show the brands owned by specified user
      return this.sortedBrands.filter(v => v.owner === this.ownerFilter)
    }
  },

  watch: {
    verticals (val, oldVal) {
      this.updateSelection()
    },
    vertical (val, oldVal) {
      // console.log('vertical watcher: vertical changed:', val)
      // console.log('this.sortedbrands.length = ', this.sortedBrands.length)
      this.updateSelection()
    },
    userDemoConfig (val) {
      console.log('demo user config changed:', val)
      this.updateCache()
    },
    ownerFilter () {
      this.brandFilter = 'other'
    }
  },

  mounted () {
    this.updateCache()
  },

  methods: {
    ...mapActions([
      'saveUserDemoConfig'
    ]),
    updateCache () {
      try {
        // copy vertical selection to the one in demo config
        this.vertical = this.userDemoConfig.vertical
        // copy multichannel selection option from demo config value
        this.multichannel = this.userDemoConfig.multichannel
      } catch (e) {
        // continue - this.userDemoConfig is probably not ready yet
      }
    },
    updateSelection () {
      const selectedVertical = this.verticals.find(v => v.id === this.vertical)
      console.log('selectedVertical = ', selectedVertical)
      // is this selected vertical owned by someone else?
      if (selectedVertical && selectedVertical.owner !== 'system' &&
      selectedVertical.owner !== this.jwtUser.username) {
        // selected vertical owned by a user that is not this user
        this.brandFilter = 'other'
        this.ownerFilter = selectedVertical.owner
      }
    },
    multichannelChanged (e) {
      console.log('multichannel changed', e.target.value)
      // construct data body to send to API REST request
      const data = {
        multichannel: e.target.value
      }
      // save demo config for user
      this.saveUserDemoConfig(data)
    },
    verticalChanged (e) {
      console.log('vertical selected:', e.target.value)
      // construct data body to send to API
      const data = {
        vertical: e.target.value
      }
      // save vertical
      this.saveUserDemoConfig(data)
    },
    clickGo (e) {
      console.log('user clicked button to go to demo website. going to', this.brandDemoLink)
      window.open(this.brandDemoLink, 'brand')
    }
  }
}
</script>
