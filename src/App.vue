<template>
  <div id="app">
    <img src="./assets/logo.png">
    <gmalt-map></gmalt-map>
  </div>
</template>

<script>
import GmaltMap from './components/GmaltMap'

export default {
  name: 'app',
  components: {
    GmaltMap
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
