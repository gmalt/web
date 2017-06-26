<template>
  <div>
    <p>Click on the map where you want to find the elevation or look up by address with the search field.</p>

    <gmap-autocomplete
      @place_changed="updatePos">
    </gmap-autocomplete>

    <gmap-map
      :center="position"
      :zoom="7"
      style="width: 100%; height: 30vh;"
      @click="updatePos"
    >
      <gmap-marker
        v-if="showMarker"
        :position="position"
        :draggable="true"
        @dragend="updatePos"
      ></gmap-marker>
    </gmap-map>

    <div>
      <ul>
        <li>Latitude : {{ position.lat }}</li>
        <li>Longitude : {{ position.lng }}</li>
        <li>Altitude : {{ alt }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as VueGoogleMaps from 'vue2-google-maps'
  import Vue from 'vue'
  import AltService from '../services/AltService'

  Vue.use(VueGoogleMaps, {
    load: {
      key: process.env.GMAP_API_KEY,
      libraries: 'places'
    }
  })

  const defaultPos = {lat: 48.856614, lng: 2.3522219}
  const defaultLatLng = {lat: () => defaultPos.lat, lng: () => defaultPos.lng}

  export default {
    name: 'gmalt-map',
    methods: {
      updatePos (newPos) {
        this.showMarker = true
        newPos = newPos.latLng || newPos.geometry.location || defaultLatLng
        this.position = {
          lat: newPos.lat(),
          lng: newPos.lng()
        }
        this.fetchAltitude()
      },
      fetchAltitude () {
        this.loading = true
        const requestedPosition = this.position
        AltService
          .get(this.position)
          .then((json) => {
            if (requestedPosition === this.position) {
              this.loading = false
              this.alt = json.alt
            }
          })
      }
    },
    data () {
      return {
        showMarker: false,
        position: defaultPos,
        alt: null,
        loading: false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input[type="text"] {
    width: 100%;
    box-sizing: border-box;
    -webkit-box-sizing:border-box;
    -moz-box-sizing: border-box;
  }
</style>
