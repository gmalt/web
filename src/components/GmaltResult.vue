<template>
  <div class="card">
    <div class="card-item">
      <span class="card-item-title">Latitude :</span>
      <span class="card-item-value">
        <strong v-if="lat">{{ lat }}</strong>
        <span v-if="!lat">No value</span>
      </span>
    </div>
    <div class="card-item">
      <span class="card-item-title">Longitude :</span>
      <span class="card-item-value">
        <strong v-if="lng">{{ lng }}</strong>
        <span v-if="!lng">No value</span>
      </span>
    </div>
    <div class="card-item">
      <span class="card-item-title">Address :</span>
      <span class="card-item-value card-item-value-address">
        <strong v-if="address">{{ address }}</strong>
        <span v-if="!address">No value</span>
      </span>
    </div>
    <div class="card-item card-item--result">
      <span class="card-item-title">Altitude :</span>
      <span class="card-item-value card-item-value-altitude">
        <strong v-if="alt">{{ alt }} m</strong>
        <span v-if="!alt">No value</span>
      </span>
    </div>
  </div>
</template>

<script>
  import GeocodeService from '../services/GeocodeService'
  import AltService from '../services/AltService'

  export default {
    name: 'gmalt-result',
    props: ['lat', 'lng'],
    watch: {
      position () {
        this.address = ''
        this.alt = ''
        if (this.lng && this.lat) {
          const requestedPosition = this.position
          GeocodeService
            .get(this.lat, this.lng)
            .then((result) => {
              this.setAddress(result[0], result[1])
            })
          AltService
            .get(this.lat, this.lng)
            .then((json) => {
              this.setAlt(requestedPosition, json.alt)
            })
            .catch((err) => {
              this.alt = err + ''
            })
        }
      }
    },
    methods: {
      setAddress (requestedPosition, address) {
        if (JSON.stringify(requestedPosition) === JSON.stringify(this.position)) {
          this.address = address
        }
      },
      setAlt (requestedPosition, altitude) {
        if (JSON.stringify(requestedPosition) === JSON.stringify(this.position)) {
          this.alt = altitude
        }
      }
    },
    computed: {
      position () {
        return {lat: this.lat, lng: this.lng}
      }
    },
    data () {
      return {
        address: '',
        alt: ''
      }
    }
  }
</script>

<style scoped>
  .card {
    margin-left: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
    padding: 16px;
    align-self:flex-start;
    box-sizing : border-box;
  }

  .card-item-title {
    display: inline-block;
  }

  .card-item-value {
    float: right;
  }

  .card-item-value-address {
    width: calc(100% - 70px);
    text-align: right;
  }

  .card-item--result {
    margin-top: 20px;
  }

  .card-item--result strong {
    font-size: 20px;
  }

  @media only screen and (max-width: 767px) {
    .card {
      margin-left: 0px;
      margin-top: 20px;
    }

    .card-item {
      text-align: left;
    }
  }
</style>
