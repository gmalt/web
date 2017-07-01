<template>
  <button type="button" class="btn" @click="geolocalize()" :disabled="disabled">
    <i class="fa fa-crosshairs" aria-hidden="true"></i> Use your position
  </button>
</template>

<script>
  export default {
    name: 'gmalt-geoloc',
    methods: {
      geolocalize () {
        navigator.geolocation.getCurrentPosition(
          pos => this.$emit('geoloc', pos.coords.latitude, pos.coords.longitude),
          () => {
            this.allowedGeolocation = false
          }
        )
      }
    },
    computed: {
      disabled: function () {
        return !navigator.geolocation || !this.allowedGeolocation
      }
    },
    data () {
      return {
        allowedGeolocation: true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
