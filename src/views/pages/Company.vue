<template>
  <v-container fluid class="down-top-padding">

      
      <AddCompany></AddCompany>
      <DisplayCompany></DisplayCompany>

    
  </v-container>
</template>

<script>
import axios from 'axios'

// create a datasnapshot as soon as the creating a new placement
// while displaying placements when clicked on register, had to update the datasnapshot

export default {
  name: "Company",

  data: () => ({
      placements:[],
  }),
  created(){
      
  },
  components:{
      AddCompany: () => import('@/components/studentDashboard/companies/addCompany'),
      DisplayCompany: () => import('@/components/studentDashboard/companies/displayCompany'),
  }
};
</script>

