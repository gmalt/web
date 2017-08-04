'use strict'

exports.command = function (callback) {
  var item
  this.execute(
    () => {
      let map = document.getElementsByClassName('vue-map')
      item = window
      let rect = map.getBoundingClientRect()
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

      return true
    },
    [],
    (resp) => {
      console.log(item)
      if (typeof callback === 'function') {
        callback.call(this, resp)
      }
    }
  )

  return this
}
