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
  }
}
