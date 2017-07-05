// import Vue from 'vue'
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
})
