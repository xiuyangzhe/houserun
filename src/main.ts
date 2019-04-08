import Vue from 'vue';
import App from './App.vue';
import Test from './test';

const TestConTest = new Test();
TestConTest.HelloWorld();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
