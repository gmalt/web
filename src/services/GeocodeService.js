export default {
  geocoderObject: null,

  geocoder () {
    if (!this.geocoderObject) {
      /* global google */
      this.geocoderObject = new google.maps.Geocoder()
    }

    return this.geocoderObject
  },

  get (lat, lng) {
    const requestedPosition = {lat: lat, lng: lng}
    return new Promise((resolve) => {
      this.geocoder().geocode({location: requestedPosition}, function (results, status) {
        let address = null
        if (status === 'OK') {
          if (results[0]) {
            address = results[0].formatted_address
          }
        }

        resolve([requestedPosition, address])
      })
    })
  }
}

