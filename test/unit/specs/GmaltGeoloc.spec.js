import Vue from 'vue'
import GmaltGeoloc from '@/components/GmaltGeoloc.vue'
import * as helper from '../helper'

let _backupNavigatorGeoloc

describe('GmaltGeoloc', () => {
  beforeEach(() => {
    _backupNavigatorGeoloc = navigator.geolocation
  })

  afterEach(() => {
    navigator.geolocation = _backupNavigatorGeoloc
  })

  // Inspect the raw component options
  it('has a name', () => {
    expect(GmaltGeoloc.name).to.equal('gmalt-geoloc')
  })

  it('has a data function', () => {
    expect(typeof GmaltGeoloc.data).to.equal('function')
    const defaultData = {allowedGeolocation: true}
    expect(GmaltGeoloc.data()).to.deep.equal(defaultData)
  })

  it('has a geolocalize methods', () => {
    expect(typeof GmaltGeoloc.methods.geolocalize).to.equal('function')
  })

  it('has a disabled computed property', () => {
    expect(typeof GmaltGeoloc.computed.disabled).to.equal('function')
  })

  it('has a disabled button if geoloc is not available', () => {
    navigator.geolocation = false
    const geolocVm = helper.getVm(GmaltGeoloc, {})
    expect(geolocVm.disabled).to.equal(true)
    expect(geolocVm.$el.disabled).to.equal(true)
  })

  it('has an active button if geoloc is available', () => {
    navigator.geolocation = {}
    const geolocVm = helper.getVm(GmaltGeoloc, {})
    expect(geolocVm.disabled).to.equal(false)
    expect(geolocVm.$el.disabled).to.equal(false)
  })

  it('disables geoloc in case of geoloc error', () => {
    navigator.geolocation = {
      getCurrentPosition (onsucess, onerror) {
        onerror()
      }
    }
    const geolocVm = helper.getVm(GmaltGeoloc, {})
    expect(geolocVm.disabled).to.equal(false)
    geolocVm.geolocalize()
    expect(geolocVm.disabled).to.equal(true)
  })

  it('emits geoloc coordinates on geoloc success', done => {
    // Mock geolocation
    navigator.geolocation = {
      getCurrentPosition (onsucess, onerror) {
        onsucess({coords: {latitude: 58.1, longitude: 8.4}})
      }
    }

    // Create component
    const geolocVm = helper.getVm(GmaltGeoloc, {})

    // Listen to geoloc emit event
    geolocVm.$on('geoloc', (lat, lng) => {
      expect(lat).to.equal(58.1)
      expect(lng).to.equal(8.4)
      done()
    })

    // Trigger geolocation
    geolocVm.geolocalize()
  })

  it('emits coordinates on button click on geoloc success', done => {
    // Mock geolocation
    navigator.geolocation = {
      getCurrentPosition (onsucess, onerror) {
        onsucess({coords: {latitude: 58.1, longitude: 8.4}})
      }
    }

    // Create component
    const geolocVm = helper.getVm(GmaltGeoloc, {})

    // Listen to geoloc emit event
    geolocVm.$on('geoloc', (lat, lng) => {
      // Check if geoloc emitted
      expect(lat).to.equal(58.1)
      expect(lng).to.equal(8.4)
      done()
    })

    // Trigger geolocation
    geolocVm.$el.click()
  })

  it('disables button on click when geoloc errored', done => {
    // Mock geolocation
    navigator.geolocation = {
      getCurrentPosition (onsucess, onerror) {
        onerror()
      }
    }

    // Create component
    const geolocVm = helper.getVm(GmaltGeoloc, {})
    expect(geolocVm.disabled).to.equal(false)
    expect(geolocVm.$el.disabled).to.equal(false)

    // Listen to geoloc emit event
    let geolocHasEmitResult = false
    geolocVm.$on('geoloc', (lat, lng) => {
      geolocHasEmitResult = true
    })

    // Trigger geolocation
    geolocVm.$el.click()

    Vue.nextTick(() => {
      // Check if geoloc has not emitted
      expect(geolocHasEmitResult).to.equal(false)
      // Check button is disabled
      expect(geolocVm.disabled).to.equal(true)
      expect(geolocVm.$el.disabled).to.equal(true)
      done()
    })
  })
})
