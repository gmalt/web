import Vue from 'vue'
import GmaltSearch from '@/components/GmaltSearch.vue'

function getVm (Component, propsData) {
  const Constructor = Vue.extend(Component)
  return new Constructor({ propsData: propsData }).$mount()
}

// helper function that mounts and returns the rendered element
function getRenderedEl (Component, propsData) {
  return getVm(Component, propsData).$el
}

describe('GmaltSearch', () => {
  // Inspect the raw component options
  it('has a name', () => {
    expect(GmaltSearch.name).to.equal('gmalt-search')
  })

  it('has 2 props lat and lng', () => {
    expect(GmaltSearch.props).to.have.lengthOf(2)
    expect(GmaltSearch.props).to.include('lat')
    expect(GmaltSearch.props).to.include('lng')
  })

  it('has a data function', () => {
    expect(typeof GmaltSearch.data).to.equal('function')
    const defaultData = {fieldLat: undefined, fieldLng: undefined}
    expect(GmaltSearch.data()).to.deep.equal(defaultData)
  })

  it('has a search methods', () => {
    expect(typeof GmaltSearch.methods.search).to.equal('function')
  })

  it('renders correctly with different props', () => {
    let searchEl = getRenderedEl(GmaltSearch, {lat: 48.1, lng: 9.5})
    expect(searchEl.querySelector('#form-latitude').value).to.equal('48.1')
    expect(searchEl.querySelector('#form-longitude').value).to.equal('9.5')

    searchEl = getRenderedEl(GmaltSearch, {lat: -56.4, lng: -120.4})
    expect(searchEl.querySelector('#form-latitude').value).to.equal('-56.4')
    expect(searchEl.querySelector('#form-longitude').value).to.equal('-120.4')

    searchEl = getRenderedEl(GmaltSearch, {lat: 'invalid', lng: 'invalid'})
    expect(searchEl.querySelector('#form-latitude').value).to.equal('')
    expect(searchEl.querySelector('#form-longitude').value).to.equal('')
  })

  it('test', () => {
    const searchVm = getVm(GmaltSearch, {lat: 48.1, lng: 9.5})
    searchVm.$on('search', (lat, lng) => {
      expect(lat).to.equal(48.1)
      expect(lng).to.equal(9.5)
    })
    searchVm.$el.querySelector('button.btn').click()
  })
})
