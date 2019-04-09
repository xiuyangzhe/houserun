<template>
  <div id="app">
    <Test />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Test from './components/Three.vue';

@Component({
  components: {
      Test,
  },
})
export default class App extends Vue {}
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
