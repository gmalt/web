let helper = require('../helper')

module.exports = {
  'search is not run on empty input': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .resizeWindow(1280, 800)  // Fix size to be sure that clicks occurs always at the same place
      .url(devServer)
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .execute(helper.loadSinon(`
        let stubedFetch = sinon.stub(window, 'fetch', function() {
           return Promise.resolve({status: 200, json: function() { return {alt: 987} }})
        });

        let sinonLoaded = document.createElement('div')
        sinonLoaded.style.visibility = 'hidden'
        sinonLoaded.id = 'sinonLoaded'
        document.head.appendChild(sinonLoaded)
      `))
      .waitForElementPresent('#sinonLoaded', 3000)
      .click('#search-submit')

    browser
      .assert.isValidInput('#form-latitude', 'valid', false)
      .assert.isValidInput('#form-latitude', 'valueMissing', true)
      .assert.isValidInput('#form-longitude', 'valid', false)
      .assert.isValidInput('#form-longitude', 'valueMissing', true)
      .assert.containsText('.card .card-item:nth-child(1) .card-item-value span', 'No value')
      .assert.containsText('.card .card-item:nth-child(2) .card-item-value span', 'No value')
      .assert.containsText('.card .card-item:nth-child(3) .card-item-value span', 'No value')
      .assert.containsText('.card .card-item:nth-child(4) .card-item-value span', 'No value')
      .end()
  }
}
