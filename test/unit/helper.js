import Vue from 'vue'

export function getVm (Component, propsData) {
  const Constructor = Vue.extend(Component)
  return new Constructor({ propsData: propsData }).$mount()
}

// helper function that mounts and returns the rendered element
export function getRenderedEl (Component, propsData) {
  return getVm(Component, propsData).$el
}

// helper to test component with mock services
export function getMockedVm (name, injector, propDatas = {}) {
  let propDataAttr = ''
  for (let key of Object.keys(propDatas)) {
    propDataAttr += ':' + key + '="' + key + '"'
  }

  return (new Vue({
    template: `<div><${name} ${propDataAttr}></${name}></div>`,
    components: {
      [name]: injector
    },
    data () {
      return propDatas
    }
  })).$mount()
}
