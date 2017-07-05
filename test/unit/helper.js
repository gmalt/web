import Vue from 'vue'

export function getVm (Component, propsData) {
  const Constructor = Vue.extend(Component)
  return new Constructor({ propsData: propsData }).$mount()
}

// helper function that mounts and returns the rendered element
export function getRenderedEl (Component, propsData) {
  return getVm(Component, propsData).$el
}
