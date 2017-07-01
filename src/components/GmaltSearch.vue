<template>
  <form v-on:submit.prevent="search()">
      <div class="form-field">
        <label for="form-latitude">Latitude</label>
        <input type="number" step="any" min="-90" max="90" id="form-latitude" placeholder="Latitude" :value="lat" v-on:input="fieldLat = parseFloat($event.target.value)" required />
      </div>

      <div class="form-field">
        <label for="form-longitude">Longitude</label>
        <input type="number" step="any" min="-180" max="180" id="form-longitude" placeholder="Longitude" :value="lng" v-on:input="fieldLng = parseFloat($event.target.value)" required />
      </div>

      <div>
        <button type="submit" class="btn">
          <i class="fa fa-search" aria-hidden="true"></i> Search
        </button>
      </div>
    </form>
</template>

<script>
  export default {
    name: 'gmalt-search',
    props: ['lat', 'lng'],
    methods: {
      search () {
        this.$emit('search', this.fieldLat || this.lat, this.fieldLng || this.lng)
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
  .form-field {
    margin-bottom: 10px;
  }
</style>
