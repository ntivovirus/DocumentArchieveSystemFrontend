import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios) // ADDED MANUALLY FOR USE

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
