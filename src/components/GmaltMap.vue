<template>
  <div>
    <p>Click on the map where you want to find the elevation, look up by address with the search field or search by latitude and longitude.</p>

    <gmap-autocomplete
      @place_changed="updatePos">
    </gmap-autocomplete>

    <gmap-map
      :center="center"
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

    <form v-on:submit.prevent="fetchAltitude">
      <div>
        <label for="form-latitude">Latitude</label>
        <input type="number" step="any" min="-90" max="90" id="form-latitude" v-model.number="position.lat" required />
      </div>

      <div>
        <label for="form-longitude">Longitude</label>
        <input type="number" step="any" min="-180" max="180" id="form-longitude" v-model.number="position.lng"  required />
      </div>

      <div>
        <input type="submit" value="Search" />
      </div>
    </form>
    <div>
      <p>Altitude : <strong>{{ alt ? alt : 'No value' }}</strong></p>
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
        const requestedPosition = this.position
        this.loading = true
        this.showMarker = true
        this.center = this.position
        return AltService
          .get(this.position)
          .then((json) => {
            if (requestedPosition === this.position) {
              this.loading = false
              this.alt = json.alt
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    data () {
      return {
        showMarker: false,
        position: { lat: null, lng: null },
        center: defaultPos,
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
