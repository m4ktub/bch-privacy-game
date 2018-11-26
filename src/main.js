import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { VTooltip, VPopover, VClosePopover } from "v-tooltip";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.config.productionTip = false; 
Vue.use(BootstrapVue);
Vue.use(VTooltip);
Vue.use(VPopover);

new Vue({
  render: h => h(App)
}).$mount("#app");
