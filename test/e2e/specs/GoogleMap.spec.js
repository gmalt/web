let helper = require('../helper')

module.exports = {
  'click on map updates result': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .resizeWindow(1280, 800)  // Fix size to be sure that clicks occurs always at the same place
      .url(devServer)
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .execute(helper.loadSinon(`
        let stubedFetch = sinon.stub(window, 'fetch', function() {           
           return Promise.resolve({status: 200, json: function() { return {alt: 234} }})
        });

        let sinonLoaded = document.createElement('div')
        sinonLoaded.style.visibility = 'hidden'
        sinonLoaded.id = 'sinonLoaded'
        document.head.appendChild(sinonLoaded)
      `))
      .execute(() => {
        // https://stackoverflow.com/questions/43280070/how-can-i-click-on-a-pin-in-a-google-map-embedded-from-javascript
        // Get middle of the map and store it in a div to be used later
        let rect = document.querySelector('.vue-map').getBoundingClientRect()
        let centerY = rect.bottom - rect.top
        let centerX = rect.right - rect.left

        let divX = document.createElement('div')
        divX.style.visibility = 'hidden'
        divX.id = 'offsetX'
        divX.innerHTML = centerX.toString()
        let divY = document.createElement('div')
        divY.style.visibility = 'hidden'
        divY.innerHTML = centerY.toString()
        divY.id = 'offsetY'
        document.head.appendChild(divX)
        document.head.appendChild(divY)
      })

    browser
      .waitForElementPresent('#offsetX', 3000)
      .waitForElementPresent('#offsetY', 3000)
      .waitForElementPresent('#sinonLoaded', 3000)

    let relX = browser.getValue('#offsetX')
    let relY = browser.getValue('#offsetY')

    browser
      .moveToElement('.vue-map', relX, relY)
      .mouseButtonClick()

    browser
      .waitForElementPresent('.card .card-item:nth-child(1) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(2) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(3) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(4) strong', 3000)

    browser
      .assert.value('#form-latitude', '48.86031047029195')
      .assert.value('#form-longitude', '2.3455810546875')
      .assert.containsText('.card .card-item:nth-child(1) strong', '48.86031047029195')
      .assert.containsText('.card .card-item:nth-child(2) strong', '2.3455810546875')
      .assert.containsText('.card .card-item:nth-child(3) strong', '36 Rue des Bourdonnais, 75001 Paris, France')
      .assert.containsText('.card .card-item:nth-child(4) strong', '234 m')
      .end()
  },

  'search by address updates result': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .setValue('#map-content input[type="text"]', '31 rue de rome Paris')
      .waitForElementVisible('.pac-container .pac-item:first-child', 3000)
      .execute(helper.loadSinon(`
        let stubedFetch = sinon.stub(window, 'fetch', function() {           
           return Promise.resolve({status: 200, json: function() { return {alt: 345} }})
        });

        let sinonLoaded = document.createElement('div')
        sinonLoaded.style.visibility = 'hidden'
        sinonLoaded.id = 'sinonLoaded'
        document.head.appendChild(sinonLoaded)
      `))
      .waitForElementPresent('#sinonLoaded', 3000)
      .execute(`
        var inputSearch = document.querySelector('#map-content input[type="text"]');
        google.maps.event.trigger(inputSearch, 'keydown', {keyCode:40});
        google.maps.event.trigger(inputSearch, 'keydown', {keyCode:13});
      `)

    browser
      .waitForElementPresent('.card .card-item:nth-child(1) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(2) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(3) strong', 3000)
      .waitForElementPresent('.card .card-item:nth-child(4) strong', 3000)

    browser
      .assert.value('#form-latitude', '48.8769429')
      .assert.value('#form-longitude', '2.323093599999993')
      .assert.containsText('.card .card-item:nth-child(1) strong', '48.8769429')
      .assert.containsText('.card .card-item:nth-child(2) strong', '2.323093599999993')
      .assert.containsText('.card .card-item:nth-child(3) strong', '31 Rue de Rome, 75008 Paris, France')
      .assert.containsText('.card .card-item:nth-child(4) strong', '345 m')
      .end()
  }
}
