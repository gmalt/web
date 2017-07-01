<template>
  <div>
    <header>
      <div class="inner">
        <img src="./assets/img/logo.svg" />
        <h1>Gmalt</h1>
        <h2>Get My ALTitude</h2>
        <a href="https://github.com/gmalt" class="button">
          <small>View project on</small> GitHub
        </a>
      </div>
    </header>

    <main id="app">
      <div class="inner clearfix">
        <section id="main-content">
          <p class="intro">Either, Click on the map or look up by address or search by latitude and longitude or use your geolocation.</p>
          <gmalt-map :lat="lat" :lng="lng" @lookup="updatePos"></gmalt-map>
          <gmalt-search :lat="lat" :lng="lng" @search="updatePos"></gmalt-search>
          <p>Current position : {{ lat }}, {{ lng }}</p>
          <p>Alt : {{ alt }}</p>
          <gmalt-geoloc @geoloc="updatePos"></gmalt-geoloc>
        </section>
        <aside id="sidebar">
          <a href="https://github.com/gmalt/cli" class="button">
            <small>Project</small>
            Gmalt CLI
          </a>
          <a href="https://github.com/gmalt/api" class="button">
            <small>Project</small>
            Gmalt API
          </a>
          <p class="repo-owner">Theme <a href="https://github.com/pages-themes/architect">architect</a> from <a href="https://github.com/pages-themes">pages-themes</a>.</p>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import './assets/css/style.css'
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
</style>
