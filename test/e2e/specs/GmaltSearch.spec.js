let helper = require('../helper')

function validateSearchNotRun (browser) {
  browser
    .click('#search-submit')

  browser
    .assert.isValidInput('#form-latitude', 'valid', false)
    .assert.isValidInput('#form-longitude', 'valid', false)
    .assert.containsText('.card .card-item:nth-child(1) .card-item-value span', 'No value')
    .assert.containsText('.card .card-item:nth-child(2) .card-item-value span', 'No value')
    .assert.containsText('.card .card-item:nth-child(3) .card-item-value span', 'No value')
    .assert.containsText('.card .card-item:nth-child(4) .card-item-value span', 'No value')
}

function startApp (browser, altitude) {
  const devServer = browser.globals.devServerURL

  browser
    .url(devServer)
    .waitForElementVisible('.vue-map-container .gm-style', 8000)
    .execute(helper.loadSinon(`
        let stubedFetch = sinon.stub(window, 'fetch', function() {
           return Promise.resolve({status: 200, json: function() { return {alt: ${altitude}} }})
        });

        let sinonLoaded = document.createElement('div')
        sinonLoaded.style.visibility = 'hidden'
        sinonLoaded.id = 'sinonLoaded'
        document.head.appendChild(sinonLoaded)
      `))
    .waitForElementPresent('#sinonLoaded', 3000)
}

module.exports = {
  'search is not run on empty input': function (browser) {
    startApp(browser, 523)

    validateSearchNotRun(browser)

    browser
      .assert.isValidInput('#form-latitude', 'valueMissing', true)
      .assert.isValidInput('#form-longitude', 'valueMissing', true)

    browser
      .end()
  },

  'search is not run on non number input': function (browser) {
    startApp(browser, 499)

    browser
      .setValue('#form-latitude', 'latitude')
      .setValue('#form-longitude', 'longitude')

    validateSearchNotRun(browser)

    browser
      .assert.isValidInput('#form-latitude', 'badInput', true)
      .assert.isValidInput('#form-longitude', 'badInput', true)

    browser
      .end()
  },

  'search is not run on underflowed number input': function (browser) {
    startApp(browser, 267)

    browser
      .setValue('#form-latitude', -91)
      .setValue('#form-longitude', -181)

    validateSearchNotRun(browser)

    browser
      .assert.isValidInput('#form-latitude', 'rangeUnderflow', true)
      .assert.isValidInput('#form-longitude', 'rangeUnderflow', true)

    browser
      .end()
  },

  'search is not run on overflowed number input': function (browser) {
    startApp(browser, 936)

    browser
      .setValue('#form-latitude', 91)
      .setValue('#form-longitude', 181)

    validateSearchNotRun(browser)

    browser
      .assert.isValidInput('#form-latitude', 'rangeOverflow', true)
      .assert.isValidInput('#form-longitude', 'rangeOverflow', true)

    browser
      .end()
  },

  'search on valid input input': function (browser) {
    startApp(browser, 72)

    browser
      .setValue('#form-latitude', 48.857868)
      .setValue('#form-longitude', 2.250452)
      .click('#search-submit')

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
      .assert.containsText('.card .card-item:nth-child(4) strong', '72 m')
      .end()
  }
}
