import Vue from 'vue';
import Vuetify from 'vuetify';
import store from './store';

Vue.use(Vuetify);

export default function (App) {
  const app = new Vue({
    store,
    render: h => h(App),
  });
  app.$mount('#app');
  return app;
}
