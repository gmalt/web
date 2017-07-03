import * as resolveUrl from 'resolve-url'
import HttpService from './HttpService'

const resolveUrlTool = resolveUrl.default || resolveUrl
const apiUrl = resolveUrlTool(process.env.API_URL, '/altitude')

export default {
  get (lat, lng) {
    return HttpService
      .get(apiUrl + '?lat=' + lat + '&lng=' + lng)
      .then(function (response) {
        return response.json()
      })
  }
}
