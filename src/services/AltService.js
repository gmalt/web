import * as resolveUrl from 'resolve-url'

const apiUrl = resolveUrl(process.env.API_URL, '/altitude')

export default {
  get (position) {
    return fetch(apiUrl + '?lat=' + position.lat + '&lng=' + position.lng)
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          return response
        } else {
          let error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(function (response) {
        return response.json()
      })
  }
}
