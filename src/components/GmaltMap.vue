<template>
  <div id="map-content">
    <gmap-autocomplete
      @place_changed="updatePos"
      :placeholder="'Write an address'">
    </gmap-autocomplete>

    <gmap-map
      :center="(position.lat && position.lng) ? position : center"
      :zoom="(position.lat && position.lng) ? 16 : 7"
      style="width: 100%; height: 30vh;"
      @click="updatePos"
    >
      <gmap-marker
        v-if="this.position.lat && this.position.lng"
        :position="position"
        :draggable="true"
        @dragend="updatePos"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
  import * as VueGoogleMaps from 'vue2-google-maps'
  import Vue from 'vue'

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
    props: ['lat', 'lng'],
    methods: {
      updatePos (newPos) {
        newPos = (newPos && (newPos.latLng || (newPos.geometry && newPos.geometry.location))) || defaultLatLng
        this.$emit('lookup', newPos.lat(), newPos.lng())
      }
    },
    computed: {
      position () {
        return { lat: this.lat, lng: this.lng }
      }
    },
    data () {
      return {
        center: defaultPos
      }
    }
  }
</script>

<style scoped>
  input[type="text"] {
    width: 100%;
    box-sizing: border-box;
    -webkit-box-sizing:border-box;
    -moz-box-sizing: border-box;
    margin-bottom: 10px;
  }
</style>
