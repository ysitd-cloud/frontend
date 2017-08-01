import Vue from 'vue';
import Vuetify from 'vuetify';
import App from '../../pages/account/login/Page.vue';

Vue.use(Vuetify);

new Vue({
  render: h => h(App),
}).$mount('#app');
