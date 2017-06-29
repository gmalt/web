<template>
  <form v-on:submit.prevent="search()">
      <div>
        <label for="form-latitude">Latitude</label>
        <input type="number" step="any" min="-90" max="90" id="form-latitude" :value="lat" v-on:input="fieldLat = parseFloat($event.target.value)" required />
      </div>

      <div>
        <label for="form-longitude">Longitude</label>
        <input type="number" step="any" min="-180" max="180" id="form-longitude" :value="lng" v-on:input="fieldLng = parseFloat($event.target.value)" required />
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
        this.$emit('search', this.fieldLat, this.fieldLng)
      }
    },
    data () {
      return {
        fieldLat: this.lat,
        fieldLng: this.lng
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
