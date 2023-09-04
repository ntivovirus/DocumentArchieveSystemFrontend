import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'; // Adding this inorder to use the sweetalerts

import axios from 'axios'
import VueAxios from 'vue-axios'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false
Vue.use(VueAxios, axios) // ADDED MANUALLY FOR USE
Vue.use(VueSweetalert2);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
