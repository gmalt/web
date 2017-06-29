<template>
  <div id="app">
    <img src="./assets/logo.png">
    <gmalt-map></gmalt-map>
    <gmalt-search :lat="lat" :lng="lng" @search="updatePos"></gmalt-search>
    <p>Parent : {{ lat }}, {{ lng }}</p>
    <p>Alt : {{ alt }}</p>
    <gmalt-geoloc @geoloc="updatePos"></gmalt-geoloc>
  </div>
</template>

<script>
import GmaltGeoloc from './components/GmaltGeoloc'
import GmaltMap from './components/GmaltMap'
import GmaltSearch from './components/GmaltSearch'

import AltService from './services/AltService'

export default {
  name: 'app',
  components: {
    GmaltGeoloc,
    GmaltMap,
    GmaltSearch
  },
  methods: {
    updatePos (lat, lng) {
      this.lat = lat
      this.lng = lng
      this.loading = true
      const requestedPosition = this.position
      return AltService
        .get(lat, lng)
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
  computed: {
    position () {
      return {lat: this.lat, lng: this.lng}
    }
  },
  data () {
    return {
      lat: null,
      lng: null,
      alt: null,
      loading: false
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
