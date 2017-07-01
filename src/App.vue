<template>
  <div>
    <header>
      <div class="inner">
        <img src="../static/logo.svg" />
        <h1>Gmalt</h1>
        <h2>Get My ALTitude</h2>
        <a href="https://github.com/gmalt" class="button">
          <small>View project on</small> GitHub
        </a>
      </div>
    </header>

    <main>
      <div class="inner clearfix">
        <section id="main-content">
          <p class="intro">
            Either, Click on the map or look up by address or search by latitude and longitude or use
            your geolocation.
          </p>
          <gmalt-map :lat="lat" :lng="lng" @lookup="updatePos"></gmalt-map>
          <div class="tools">
            <div class="tools-form">
              <gmalt-geoloc @geoloc="updatePos"></gmalt-geoloc>
              <div class="hr-sect">OR</div>
              <gmalt-search :lat="lat" :lng="lng" @search="updatePos"></gmalt-search>
            </div>
            <gmalt-result :lat="lat" :lng="lng" :alt="alt" :loading="loading"></gmalt-result>
          </div>

          <h2>Description</h2>
          <p>
            Gmalt is a Python project providing a standard REST JSON API to query elevation data from a geographic
            position as a tuple latitude and longitude (using WSG84 coordinates).<br />
            <br />
            The project consists of 2 different softwares :
            <ul>
              <li>
                <a href="https://github.com/gmalt/cli">gmalt CLI</a> : it provides a few command lines tools to
                download, extract or load in a database the SRTM dataset containing elevation values.
              </li>
              <li>
                <a href="https://github.com/gmalt/api">gmalt API</a> : it provides a simple web server with a
                standard REST JSON API to query the dataset and return the elevation of a geographic location.
              </li>
            </ul>
            The documentation is in the <em>README.md</em> file of each project on Github.<br />
            <br />
            If you find any issue or you have a change request, don't hesitate to fill a report on Github.
          </p>

          <h2>License</h2>
          <p>
            This project is under the MIT License. However, the SRTM dataset has its own license. Please refer to the
            <a href="https://www2.jpl.nasa.gov/srtm/">NASA website</a> to check if what you want to do is covered
            by their license.
          </p>

          <em>
            Please host your own API if you want to use it in production. The server used for this demo is not
            restricted but there is no guarantee that it will be always up. Moreover it won't handle heavy load.
          </em>
        </section>

        <aside id="sidebar">
          <a href="https://github.com/gmalt/cli" class="button">
            <small>Project</small>
            Gmalt CLI
          </a>
          <a href="https://github.com/gmalt/api" class="button">
            <small>Project</small>
            Gmalt API
          </a>
          <p class="repo-owner">
            Theme <a href="https://github.com/pages-themes/architect">architect</a> from
            <a href="https://github.com/pages-themes">pages-themes</a>.
          </p>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import './assets/css/style.css'

import GmaltGeoloc from './components/GmaltGeoloc'
import GmaltMap from './components/GmaltMap'
import GmaltSearch from './components/GmaltSearch'
import GmaltResult from './components/GmaltResult'

import AltService from './services/AltService'

export default {
  name: 'app',
  components: {
    GmaltGeoloc,
    GmaltMap,
    GmaltSearch,
    GmaltResult
  },
  methods: {
    updatePos (lat, lng) {
      this.lat = lat
      this.lng = lng
      this.loading = true
      const requestedPosition = this.position
      return AltService
        .get(lat, lng)
        .then((json) => {
          if (JSON.stringify(requestedPosition) === JSON.stringify(this.position)) {
            this.loading = false
            this.alt = json.alt
          }
        })
        .catch((err) => {
          this.alt = err + ''
        })
    }
  },
  computed: {
    position () {
      return {lat: this.lat, lng: this.lng}
    }
  },
  data () {
    return {
      lat: null,
      lng: null,
      alt: null,
      loading: false
    }
  }
}
</script>

<style scoped>
  .tools {
    margin-top: 20px;
    display: flex;
  }

  .tools > * {
    width: 50%;
  }

  .tools-form {
    margin-right: 10px;
    text-align: center;
  }


  .hr-sect {
    display: flex;
    flex-basis: 100%;
    align-items: center;
    color: rgba(0, 0, 0, 0.35);
    margin: 10px 0px;
  }

  .hr-sect::before,
  .hr-sect::after {
    content: "";
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.35);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 8px;
  }

  @media only screen and (max-width: 767px) {
    .tools {
      flex-direction: column;
    }

    .tools > * {
      width: 100%;
    }
  }
</style>
