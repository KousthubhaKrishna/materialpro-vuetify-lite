<template>
  <v-container fluid class="down-top-padding">

      
      <AddCompany v-if="permission"></AddCompany>
      <DisplayCompany></DisplayCompany>

    
  </v-container>
</template>

<script>

// create a datasnapshot as soon as the creating a new placement
// while displaying placements when clicked on register, had to update the datasnapshot

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

      console.log(this.user);


    if(this.$PERMISSIONS.MED){
      console.log("coordinator");
      this.permission = true;
    }
  },
  components:{
      AddCompany: () => import('@/components/studentDashboard/companies/addCompany'),
      DisplayCompany: () => import('@/components/studentDashboard/companies/displayCompany'),
  }
};
</script>

