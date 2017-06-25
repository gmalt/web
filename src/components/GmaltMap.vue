<template>
  <div>
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
        :position="position"
        :draggable="true"
        @dragend="updatePos"
      ></gmap-marker>
    </gmap-map>

    <div>
      <ul>
        <li>Latitude : {{ position.lat }}</li>
        <li>Longitude : {{ position.lng }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as VueGoogleMaps from 'vue2-google-maps'
  import Vue from 'vue'

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyCeG8L5crkEuoj5H2upp1lVFW1xmlzCZo4',
      libraries: 'places'
    }
  })

  const defaultPos = {lat: 48.856614, lng: 2.3522219}
  const defaultLatLng = {lat: () => defaultPos.lat, lng: () => defaultPos.lng}

  export default {
    name: 'gmalt-map',
    methods: {
      updatePos (newPos) {
        newPos = newPos.latLng || newPos.geometry.location || defaultLatLng
        this.position = {
          lat: newPos.lat(),
          lng: newPos.lng()
        }
      }
    },
    data () {
      return {
        position: defaultPos
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

  .vue-map-container {
    margin: auto
  }
</style>
