// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'app loads correctly': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#gmalt-app', 5000)
      .assert.elementPresent('header')
      .assert.containsText('h1', 'Gmalt')
      .assert.containsText('h2', 'Get My ALTitude')
      .assert.elementPresent('main')
      .end()
  },

  'click on map updates page': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .resizeWindow(1280, 800)
      .url(devServer)
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .execute(() => {
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
    browser.pause(3000)
    browser.waitForElementPresent('#offsetX', 3000)
    let relX = browser.getValue('#offsetX')
    let relY = browser.getValue('#offsetY')
    browser.moveToElement('.vue-map', relX, relY).mouseButtonClick()
    browser.pause(3000)
    browser
      .assert.containsText('.card .card-item:nth-child(1) strong', '48.86031047029195')
      .assert.containsText('.card .card-item:nth-child(2) strong', '2.3455810546875')
      .assert.containsText('.card .card-item:nth-child(3) strong', '36 Rue des Bourdonnais, 75001 Paris, France')
      .assert.elementPresent('main')
      .end()
  }
}
