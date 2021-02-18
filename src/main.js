import Vue from 'vue'
import app from './index.vue'
import store from './store'
// common panel component
import panel from './components/panel'
import copy from './components/copy'
import './style.scss'

// use 'buefy/src' when running from git,
import Buefy from 'buefy/src'
// or use 'buefy' when running from npm
// import Buefy from 'buefy'

// import specific buefy components used in this project
// import {
//   ConfigProgrammatic,
//   Table,
//   Input
// } from 'buefy'

// add Buefy to Vue
Vue.use(Buefy)

// add specific Buefy components to Vue
// Vue.use(Table)
// Vue.use(Input)
// ConfigProgrammatic.setOptions({
// defaultIconPack: 'fas',
// defaultContainerElement: '#content',
// })

// load panel component globally
Vue.component('Panel', panel)
// load clipboard copy button component globally
Vue.component('Copy', copy)

new Vue({
  render: h => h(app),
  store
}).$mount('#app')
