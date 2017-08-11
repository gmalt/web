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
  }
}
