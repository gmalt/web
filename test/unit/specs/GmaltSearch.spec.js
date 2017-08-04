import Vue from 'vue'
import GmaltSearch from '@/components/GmaltSearch.vue'
import * as helper from '../helper'

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
    let searchEl = helper.getRenderedEl(GmaltSearch, {lat: 48.1, lng: 9.5})
    expect(searchEl.querySelector('#form-latitude').value).to.equal('48.1')
    expect(searchEl.querySelector('#form-longitude').value).to.equal('9.5')

    searchEl = helper.getRenderedEl(GmaltSearch, {lat: -56.4, lng: -120.4})
    expect(searchEl.querySelector('#form-latitude').value).to.equal('-56.4')
    expect(searchEl.querySelector('#form-longitude').value).to.equal('-120.4')

    searchEl = helper.getRenderedEl(GmaltSearch, {lat: 'invalid', lng: 'invalid'})
    expect(searchEl.querySelector('#form-latitude').value).to.equal('')
    expect(searchEl.querySelector('#form-longitude').value).to.equal('')
  })

  it('should emit the props as position on form submit', () => {
    const searchVm = helper.getVm(GmaltSearch, {lat: 48.1, lng: 9.5})
    searchVm.$on('search', (lat, lng) => {
      expect(lat).to.equal(48.1)
      expect(lng).to.equal(9.5)
    })
    searchVm.$el.querySelector('button.btn').click()
  })

  it('should emit the input as position on form submit', done => {
    const searchVm = helper.getVm(GmaltSearch, {lat: 48.1, lng: 9.5})

    // Listen for seach event and check emitted values
    searchVm.$on('search', (lat, lng) => {
      expect(lat).to.equal(-56.7)
      expect(lng).to.equal(-176)
      done()
    })

    const latitudeForm = searchVm.$el.querySelector('#form-latitude')
    const longitudeForm = searchVm.$el.querySelector('#form-longitude')

    // Set valid values
    latitudeForm.value = -56.7
    longitudeForm.value = -176

    // Trigger input events
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    })
    latitudeForm.dispatchEvent(event)
    longitudeForm.dispatchEvent(event)

    // Submit the form
    searchVm.$el.querySelector('button.btn').click()
  })

  it('should require a valid latitude', () => {
    const searchVm = helper.getVm(GmaltSearch, {lat: 48.1, lng: 9.5})
    const latitudeForm = searchVm.$el.querySelector('#form-latitude')
    latitudeForm.value = -91
    expect(latitudeForm.checkValidity()).to.equal(false)
    latitudeForm.value = 91
    expect(latitudeForm.checkValidity()).to.equal(false)
    latitudeForm.value = 'abc'
    expect(latitudeForm.checkValidity()).to.equal(false)
    latitudeForm.value = 90
    expect(latitudeForm.checkValidity()).to.equal(true)
    latitudeForm.value = -90
    expect(latitudeForm.checkValidity()).to.equal(true)
  })

  it('should require a valid longitude', () => {
    const searchVm = helper.getVm(GmaltSearch, {lat: 48.1, lng: 9.5})
    const longitudeForm = searchVm.$el.querySelector('#form-longitude')
    longitudeForm.value = -181
    expect(longitudeForm.checkValidity()).to.equal(false)
    longitudeForm.value = 181
    expect(longitudeForm.checkValidity()).to.equal(false)
    longitudeForm.value = 'abc'
    expect(longitudeForm.checkValidity()).to.equal(false)
    longitudeForm.value = 180
    expect(longitudeForm.checkValidity()).to.equal(true)
    longitudeForm.value = -180
    expect(longitudeForm.checkValidity()).to.equal(true)
  })

  it('should not emit on invalid form submit', done => {
    const searchVm = helper.getVm(GmaltSearch, {lat: 48.1, lng: 9.5})

    // Listen for emit event
    let searchEmitResult = {emitted: false}
    searchVm.$on('search', (lat, lng) => {
      searchEmitResult.emitted = true
    })

    const latitudeForm = searchVm.$el.querySelector('#form-latitude')
    const longitudeForm = searchVm.$el.querySelector('#form-longitude')

    // Set invalid value
    latitudeForm.value = 'abcd'
    longitudeForm.value = 'abcd'

    // Dispatch input event
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    })
    latitudeForm.dispatchEvent(event)
    longitudeForm.dispatchEvent(event)

    // Submit form
    searchVm.$el.querySelector('button.btn').click()

    // Check search not triggered with invalid input
    Vue.nextTick(() => {
      expect(searchEmitResult.emitted).to.equal(false)
      done()
    })
  })
})
