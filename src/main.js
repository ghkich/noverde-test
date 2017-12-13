import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'

// Instância vue para gerenciar eventos entre componentes
export const eventHub = new Vue();

// Resource é um cliente HTTP para fazer requests
Vue.use(VueResource);

new Vue({
  el: '#app',
  render: h => h(App)
});

