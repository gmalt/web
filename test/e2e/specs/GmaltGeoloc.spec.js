let helper = require('../helper')

module.exports = {
  'click on geoloc button updates result on success': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .execute(helper.loadSinon(`
        let stubedGeoloc = sinon.stub(navigator.geolocation, 'getCurrentPosition', function(success, error) {
           success({coords: {latitude: 48.857868, longitude: 2.250452}})
        });
        
        let stubedFetch = sinon.stub(window, 'fetch', function() {
           return Promise.resolve({status: 200, json: function() { return {alt: 789} }})
        });

        let sinonLoaded = document.createElement('div')
        sinonLoaded.style.visibility = 'hidden'
        sinonLoaded.id = 'sinonLoaded'
        document.head.appendChild(sinonLoaded)
      `))
      .waitForElementPresent('#sinonLoaded', 3000)

    browser
      .click('#geoloc-button')

    browser
      .waitForElementPresent('.card .card-item:nth-child(1) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(2) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(3) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(4) strong', 3000)

    browser
      .assert.value('#form-latitude', '48.857868')
      .assert.value('#form-longitude', '2.250452')
      .assert.containsText('.card .card-item:nth-child(1) strong', '48.857868')
      .assert.containsText('.card .card-item:nth-child(2) strong', '2.250452')
      .assert.containsText('.card .card-item:nth-child(3) strong', 'Avenue de l\'Hippodrome, 75016 Paris, France')
      .assert.containsText('.card .card-item:nth-child(4) strong', '789 m')
      .end()
  },

  'click on geoloc disable button on error': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .execute(helper.loadSinon(`
        let stubedGeoloc = sinon.stub(navigator.geolocation, 'getCurrentPosition', function(success, error) {
           error()
        });

        let sinonLoaded = document.createElement('div')
        sinonLoaded.style.visibility = 'hidden'
        sinonLoaded.id = 'sinonLoaded'
        document.head.appendChild(sinonLoaded)
      `))
      .waitForElementPresent('#sinonLoaded', 3000)

    browser
      .click('#geoloc-button')

    browser
      .assert.attributeEquals('#geoloc-button', 'disabled', 'true')
      .assert.value('#form-latitude', '')
      .assert.value('#form-longitude', '')
      .assert.containsText('.card .card-item:nth-child(1) .card-item-value span', 'No value')
      .assert.containsText('.card .card-item:nth-child(2) .card-item-value span', 'No value')
      .assert.containsText('.card .card-item:nth-child(3) .card-item-value span', 'No value')
      .assert.containsText('.card .card-item:nth-child(4) .card-item-value span', 'No value')
      .end()
  }
}
