<template>
  <v-navigation-drawer
    v-model="Sidebar_drawer"
    :dark="SidebarColor !== 'white'"
    :color="SidebarColor"
    mobile-breakpoint="960"
    clipped
    :right="$vuetify.rtl"
    mini-variant-width="70"
    :expand-on-hover="expandOnHover"
    app
    id="main-sidebar"
    >
    <v-list dense nav>
      <!---USer Area -->
      <v-list-item two-line class="secondary" dark>
        <v-list-item-avatar>
          <img :src="userData.photo_url || 'https://randomuser.me/api/portraits/men/81.jpg'" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> {{ userData.basic_info.full_name }} </v-list-item-title>
          <v-list-item-subtitle class="caption"> {{ userData.basic_info.branch }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <!---USer Area -->
      <!---Sidebar Items -->
      <div v-for="item in filteredItems" :key="item.title">
        <v-list-item
          v-if="!item.children"
          :to="item.to"
          :active-class="`success white--text`"
          link
          >
          <v-list-item-icon>
            <v-icon :color="item.color" >{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div v-else>
          <v-list-group
            :value="false"
            :prepend-icon="item.icon"
            >
            <template v-slot:activator>
              <v-list-item-title> {{ item.title }} </v-list-item-title>
            </template>
            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :to="child.to"
              :active-class="`success white--text`"
              link
              >
              <v-list-item-title v-text="child.title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="child.icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </div>
      </div>
      <!---Sidebar Items -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Sidebar",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.initialize();
  },
  data: function() {
    return {
        user: null,
        userData : {
          basic_info: {
            full_name : "",
            branch: ""
          },
          photo_url: "",
        },
        items: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "/dashboard/home"
        },

        {
          title: "Profile",
          icon: "mdi-account-circle",
          to: "/dashboard/profile"
        },
        {
          title: "Placements",
          icon: "mdi-account-tie",
          to: "/dashboard/placements"
        },
        {
          title: "Calendar",
          icon: "mdi-calendar",
          to: "/dashboard/calendar",
        },

        {
          title: "Interview experiences",
          icon: "mdi-tie",
          to: "/dashboard/interview-experience",
        },
        {
          title: "Company",
          icon: "mdi-office-building",
          to: "/dashboard/company"
        },
        {
          title: "E-resources",
          icon: "mdi-book",
          to: "/dashboard/icons"
        },
        {
          title: "Students",
          icon: "mdi-account-group",
          permissions: this.$PERMISSIONS.MED,
          children: [
            {
              title: "Add/Edit Students",
              icon: "mdi-account-edit",
              to: "/dashboard/manage_students/", 
            },
            {
              title: "Verify & Approve",
              icon: "mdi-check-decagram",
              to: "/dashboard/verify_students/", 
            }
          ]
        },
        {
          title: "Coordinators",
          icon: "mdi-account-star",
          permissions: this.$PERMISSIONS.HIGH,
          to: "/dashboard/manage_pcs/",
        },
        {
          title: "Admins",
          icon: "mdi-shield-account",
          permissions: this.$PERMISSIONS.HIGH,
          to: "/dashboard/manage_admins/",
        }
      ],
    }
  },
  computed: {
    ...mapState(["SidebarColor", "SidebarBg"]),
    Sidebar_drawer: {
      get() {
        return this.$store.state.Sidebar_drawer;
      },
      set(val) {
        this.$store.commit("SET_SIDEBAR_DRAWER", val);
      }
    },
    filteredItems : function() {
      var items = this.items;
      var filteredItems = [];
      for(var i = 0; i < items.length; i++) {
        if(items[i].permissions == undefined || items[i].permissions.has(this.user.role)){
          filteredItems.push(items[i]);
        }
      }
      return filteredItems;
    }
  },
  watch: {
    "$vuetify.breakpoint.smAndDown"(val) {
      this.$emit("update:expandOnHover", !val);
    }
  },
  methods: {
    initialize() {
      const access_token = window.$cookies.get("jwt");
      let tokens = JSON.parse(atob(access_token.split(".")[1]));
      this.user = tokens;
      this.$axios.get('/api/students/myProfile')
        .then( response => {
          if(response.data == null) {
            this.userData = {
              basic_info : {
                full_name : this.user.user_email,
                branch: this.user.branch,
              },
              photo_url : "",
            }
          } else {
            this.userData = response.data;
            console.log(this.userData);
          }
        })
        .catch(error =>{
          console.log(error)
        });
    }
  }
};
</script>
<style lang="scss">
#main-sidebar{
  box-shadow:1px 0 20px rgba(0,0,0,.08);
  -webkit-box-shadow:1px 0 20px rgba(0,0,0,.08);
  .v-navigation-drawer__border{
    display: none;
  }
  .v-list{
    padding: 8px 15px;
  }
  .v-list-item{
      &__icon--text,
      &__icon:first-child{
        justify-content: center;
        text-align: center;
        width: 20px;
        
      }
      
  }    
}
</style>