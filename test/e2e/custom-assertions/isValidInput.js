// A custom Nightwatch assertion.
// the name of the method is the filename.
// can be used in tests like this:
//
//   browser.assert.elementCount(selector, count)
//
// for how to write custom assertions see
// http://nightwatchjs.org/guide#writing-custom-assertions
exports.assertion = function (selector, stateAttr, stateValue) {
  this.message = 'Testing if element <' + selector + '> has ValidityState ' + stateAttr + ': ' + stateValue
  this.expected = stateValue

  this.pass = function (val) {
    return val === this.expected
  }

  this.value = function (res) {
    return res.value[stateAttr]
  }

  this.command = function (cb) {
    var self = this
    return this.api.execute(
      function (selector) {
        return document.querySelector(selector).validity
      },
      [selector],
      function (res) {
        cb.call(self, res)
      }
    )
  }
}
