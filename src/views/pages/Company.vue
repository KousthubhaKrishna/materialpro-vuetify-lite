<template>
  <v-container fluid class="down-top-padding">

      
      <AddCompany v-if="$PERMISSIONS.MED.has(user.role)"></AddCompany>
      <DisplayCompany></DisplayCompany>

    
  </v-container>
</template>

<script>

export default {
  name: "Company",

  data: () => ({
      placements:[],
      permission:false,
      user:"",
  }),
  created(){
      const access_token = window.$cookies.get("jwt");
      let tokens = JSON.parse(atob(access_token.split(".")[1]));
      this.user = tokens;

    if(this.$PERMISSIONS.MED){
      this.permission = true;
    }
  },
  components:{
      AddCompany: () => import('@/components/studentDashboard/companies/addCompany'),
      DisplayCompany: () => import('@/components/studentDashboard/companies/displayCompany'),
  }
};
</script>

