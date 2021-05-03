<template>
  <v-app-bar app clipped-left clipped-right color="primary" dark>
    <v-img
      alt="CBIT Logo"
      class="shrink mx-4"
      contain
      src="@/assets/images/cbit_logo.png"
      height="40"
      width="40"
    />
    <v-toolbar-title>CDC - CBIT</v-toolbar-title>
    <v-app-bar-nav-icon
      class="d-block d-mdi-none"
      @click="$vuetify.breakpoint.smAndDown ? setSidebarDrawer(!Sidebar_drawer) : $emit('input', !value)"
    />
    <v-spacer />
    <!---right part -->
    <v-btn dark color="success" href="https://www.wrappixel.com/templates/materialpro-vuetify-admin/">Upgrade to Pro</v-btn>
    <v-menu bottom left transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, i) in userprofile" :key="i" @click="item.method">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
// Utilities
import { mapState, mapMutations } from "vuex";
import router from "../../router";
import axios from "axios";
export default {
  name: "Header",

  components: {},

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    router : router,
    userprofile: [
      { title: "My Profile" },
      { title: "My Balance" },
      { title: "Inbox" },
      { title: "Account Setting" },
      { title: "Logout" ,method : () => {
        axios
        .delete("/api/logout")
        .then(res => {
          if (res.status == 200) {
            router.push({ name: "Home" });
          }
        })
        .catch(err => {
          if (err.response.data.message) console.log(err.response.data.message);
        });
      }}
    ],
    href() {
      return undefined;
    }
  }),

  computed: {
    ...mapState(["Sidebar_drawer"])
  },

  methods: {
    ...mapMutations({
      setSidebarDrawer: "SET_SIDEBAR_DRAWER"
    })
  }
};
</script>