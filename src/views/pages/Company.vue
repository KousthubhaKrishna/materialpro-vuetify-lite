<template>
  <div>

       <h2 class="pa-4">
           Visiting Companies List
        </h2>
      
      <DisplayCompany></DisplayCompany>


    
  </div>
</template>

<script>

export default {
  name: "Company",

  data: () => ({
      placements:[],
  }),
  
  components:{
      DisplayCompany: () => import('@/components/studentDashboard/companies/displayCompany'),
  }
};
</script>

