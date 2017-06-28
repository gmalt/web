<template>
  <div id="app">
    <img src="./assets/logo.png">
    <gmalt-map></gmalt-map>
    <gmalt-search :lat="position.lat" :lng="position.lng" @search="updatePos"></gmalt-search>
    <p>Parent : {{ position.lat }}, {{ position.lng }}</p>
    <p>Alt : {{ alt }}</p>
  </div>
</template>

<script>
import GmaltMap from './components/GmaltMap'
import GmaltSearch from './components/GmaltSearch'

import AltService from './services/AltService'

export default {
  name: 'app',
  components: {
    GmaltMap,
    GmaltSearch
  },
  methods: {
    updatePos (position) {
      this.position = position
      const requestedPosition = position
      return AltService
        .get(this.position)
        .then((json) => {
          if (requestedPosition === this.position) {
            this.loading = false
            this.alt = json.alt
          }
        })
        .catch((err) => {
          this.alt = err + ''
        })
    }
  },
  data () {
    return {
      position: {lat: null, lng: null},
      alt: null
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
