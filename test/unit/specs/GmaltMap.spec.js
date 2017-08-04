import Vue from 'vue'
import GmaltMap from '@/components/GmaltMap.vue'
import * as helper from '../helper'

describe('GmaltMap', () => {
  // Inspect the raw component options
  it('has a name', () => {
    expect(GmaltMap.name).to.equal('gmalt-map')
  })

  it('has 2 props lat and lng', () => {
    expect(GmaltMap.props).to.have.lengthOf(2)
    expect(GmaltMap.props).to.include('lat')
    expect(GmaltMap.props).to.include('lng')
  })

  it('has a data function', () => {
    expect(typeof GmaltMap.data).to.equal('function')
    const defaultData = {center: {lat: 48.856614, lng: 2.3522219}}
    expect(GmaltMap.data()).to.deep.equal(defaultData)
  })

  it('has a updatePos methods', () => {
    expect(typeof GmaltMap.methods.updatePos).to.equal('function')
  })

  it('has a position computer property', () => {
    const mapVm = helper.getVm(GmaltMap, {lat: 48.1, lng: 9.5})
    expect(mapVm.position).to.deep.equal({lat: 48.1, lng: 9.5})
  })

  it('should emits the default value when updatePos is called without pos', done => {
    const mapVm = helper.getVm(GmaltMap)

    // Listen for emit event
    let lookupEmitResult = {emitted: false, lat: null, lng: null}
    mapVm.$on('lookup', (lat, lng) => {
      lookupEmitResult.emitted = true
      lookupEmitResult.lat = lat
      lookupEmitResult.lng = lng
    })

    mapVm.updatePos()

    Vue.nextTick(() => {
      expect(lookupEmitResult.emitted).to.equal(true)
      expect(lookupEmitResult.lat).to.equal(48.856614)
      expect(lookupEmitResult.lng).to.equal(2.3522219)
      done()
    })
  })

  it('should emits the geometry when updatePos is called from google autocomplete field', done => {
    const mapVm = helper.getVm(GmaltMap)

    // Listen for emit event
    let lookupEmitResult = {emitted: false, lat: null, lng: null}
    mapVm.$on('lookup', (lat, lng) => {
      lookupEmitResult.emitted = true
      lookupEmitResult.lat = lat
      lookupEmitResult.lng = lng
    })

    mapVm.updatePos({
      geometry: {
        location: {lat: () => 47.9876, lng: () => 3.98765}
      }
    })

    Vue.nextTick(() => {
      expect(lookupEmitResult.emitted).to.equal(true)
      expect(lookupEmitResult.lat).to.equal(47.9876)
      expect(lookupEmitResult.lng).to.equal(3.98765)
      done()
    })
  })

  it('should emits latlng when updatePos is called from google map click', done => {
    const mapVm = helper.getVm(GmaltMap)

    // Listen for emit event
    let lookupEmitResult = {emitted: false, lat: null, lng: null}
    mapVm.$on('lookup', (lat, lng) => {
      lookupEmitResult.emitted = true
      lookupEmitResult.lat = lat
      lookupEmitResult.lng = lng
    })

    mapVm.updatePos({
      latLng: {lat: () => 46.9876, lng: () => 4.98765}
    })

    Vue.nextTick(() => {
      expect(lookupEmitResult.emitted).to.equal(true)
      expect(lookupEmitResult.lat).to.equal(46.9876)
      expect(lookupEmitResult.lng).to.equal(4.98765)
      done()
    })
  })
})
