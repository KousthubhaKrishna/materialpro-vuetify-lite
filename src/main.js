import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import './plugins/base'
import axios from "axios";

axios.defaults.withCredentials = true;
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$ROLES = {
    ADMIN: "admin",
    PC: "coordinator",
    STUDENT: "student"
};
Vue.prototype.$PERMISSIONS = {
    LOW: new Set([Vue.prototype.$ROLES.STUDENT, Vue.prototype.$ROLES.PC, Vue.prototype.$ROLES.ADMIN]),
    MED: new Set([Vue.prototype.$ROLES.PC, Vue.prototype.$ROLES.ADMIN]),
    HIGH: new Set([Vue.prototype.$ROLES.ADMIN])
};
new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')
Vue.use(router)
