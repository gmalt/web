import Vue from 'vue'
import GmaltResult from '@/components/GmaltResult.vue'
import * as helper from '../helper'

const GmaltResultInjector = require('!!vue-loader?inject!@/components/GmaltResult.vue')

const GmaltResulMockGeocode = GmaltResultInjector({
  '../services/GeocodeService': {
    get (lat, lng) {
      return Promise.resolve([{lat: lat, lng: lng}, '32 rue de rome, 75015 Paris'])
    }
  }
})

describe('GmaltResult', () => {
  // Inspect the raw component options
  it('has a name', () => {
    expect(GmaltResult.name).to.equal('gmalt-result')
  })

  it('has a data function', () => {
    expect(typeof GmaltResult.data).to.equal('function')
    const defaultData = {address: ''}
    expect(GmaltResult.data()).to.deep.equal(defaultData)
  })

  it('has a setAddress methods', () => {
    expect(typeof GmaltResult.methods.setAddress).to.equal('function')
  })

  it('has a position computed property', () => {
    expect(typeof GmaltResult.computed.position).to.equal('function')
  })

  it('watches the position computed property', () => {
    expect(typeof GmaltResult.watch.position).to.equal('function')
  })

  it('renders correctly without props', () => {
    let searchEl = helper.getRenderedEl(GmaltResult, {})
    let cardItem = searchEl.querySelectorAll('.card-item')

    expect(cardItem.item(0).querySelector('.card-item-value strong')).to.equal(null)
    expect(cardItem.item(0).querySelector('.card-item-value span').textContent).to.equal('No value')

    expect(cardItem.item(1).querySelector('.card-item-value strong')).to.equal(null)
    expect(cardItem.item(1).querySelector('.card-item-value span').textContent).to.equal('No value')

    expect(cardItem.item(2).querySelector('.card-item-value strong')).to.equal(null)
    expect(cardItem.item(2).querySelector('.card-item-value span').textContent).to.equal('No value')

    expect(cardItem.item(3).querySelector('.card-item-value strong')).to.equal(null)
    expect(cardItem.item(3).querySelector('.card-item-value span').textContent).to.equal('No value')
  })

  it('renders correctly with different props and without geocode service', () => {
    let searchEl = helper.getRenderedEl(GmaltResult, {lat: 48.1, lng: 9.5, alt: 5.1})
    let cardItem = searchEl.querySelectorAll('.card-item')

    expect(cardItem.item(0).querySelector('.card-item-value strong').textContent).to.equal('48.1')
    expect(cardItem.item(0).querySelector('.card-item-value span')).to.equal(null)

    expect(cardItem.item(1).querySelector('.card-item-value strong').textContent).to.equal('9.5')
    expect(cardItem.item(1).querySelector('.card-item-value span')).to.equal(null)

    expect(cardItem.item(2).querySelector('.card-item-value strong')).to.equal(null)
    expect(cardItem.item(2).querySelector('.card-item-value span').textContent).to.equal('No value')

    expect(cardItem.item(3).querySelector('.card-item-value strong').textContent).to.equal('5.1 m')
    expect(cardItem.item(3).querySelector('.card-item-value span')).to.equal(null)
  })

  it('renders correctly with different props and with geocode service', done => {
    let searchEl = helper.getMockedVm('gmalt-result', GmaltResulMockGeocode, {lat: 48.1, lng: 9.5, alt: 5.1})
    searchEl.lat = 5.4

    const addressTag = searchEl.$children[0].$el.querySelector('.card-item-value-address')

    // Geocode service which is mocked resolve a promise which takes longer than Vue.nextTick
    Promise.resolve().then(() => {
      // First tick, check the attribute value
      Vue.nextTick(() => {
        expect(addressTag.querySelector('strong')).to.equal(null)
        expect(addressTag.querySelector('span').textContent).to.equal('No value')
        expect(searchEl.$children[0].address).to.equal('32 rue de rome, 75015 Paris')
        // Second tick, check DOM update
        Vue.nextTick(() => {
          expect(addressTag.querySelector('strong').textContent).to.equal('32 rue de rome, 75015 Paris')
          expect(addressTag.querySelector('span')).to.equal(null)
          done()
        })
      })
    })
  })
})
