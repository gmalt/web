module.exports = {
  loadSinon: function (onLoad) {
    return `
        var importScript = (function (oHead) {

        function loadError (oError) {
          throw new URIError("The script " + oError.target.src + " is not accessible.");
        }
    
        return function (sSrc, fOnload) {
          var oScript = document.createElement("script");
          oScript.type = "text/javascript";
          oScript.onerror = loadError;
          if (fOnload) { oScript.onload = fOnload; }
          oHead.appendChild(oScript);
          oScript.src = sSrc;
        }
    
      })(document.head || document.getElementsByTagName("head")[0]);
        
      function sinonOnLoad() {
        ${onLoad}
      }

      importScript('https://cdnjs.cloudflare.com/ajax/libs/sinon.js/1.15.4/sinon.js', sinonOnLoad);
    `
  },

  clickOnMapCenter: function (browser, altitude) {
    browser
      .waitForElementVisible('.vue-map-container .gm-style', 8000)
      .execute(this.loadSinon(`
        let stubedFetch = sinon.stub(window, 'fetch', function() {
           return Promise.resolve({status: 200, json: function() { return {alt: ${altitude}} }})
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

    return { relX, relY }
  }
}
