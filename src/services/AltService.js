import * as resolveUrl from 'resolve-url'
import HttpService from './HttpService'

const apiUrl = resolveUrl(process.env.API_URL, '/altitude')

export default {
  get (lat, lng) {
    return HttpService
      .get(apiUrl + '?lat=' + lat + '&lng=' + lng)
      .then(function (response) {
        return response.json()
      })
  }
}
