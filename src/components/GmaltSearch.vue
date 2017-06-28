<template>
  <form v-on:submit.prevent="search()">
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
</template>

<script>
  export default {
    name: 'gmalt-search',
    props: ['lat', 'lng'],
    methods: {
      search () {
        this.$emit('search', this.position)
      }
    },
    data () {
      return {
        position: {lat: this.lat, lng: this.lng}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
