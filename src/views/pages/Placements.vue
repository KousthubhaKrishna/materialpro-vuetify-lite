<template>
  <v-container fluid class="down-top-padding">  
      <v-sheet class="ma-2 pa-5" height="100%">
          <h2> Placements </h2>
    <v-row>
        <v-col>

        </v-col>
    </v-row>
    
    <v-row class = "blue--text">
        <v-col cols="12" sm="2">Job Role</v-col>
        <v-col cols="12" sm="2">Job Type</v-col>
        <v-col cols="12" sm="2">Company Name</v-col>
        <v-col cols="12" sm="2">Batch</v-col>
        <v-col cols="12" sm="2">Branch</v-col>
        <v-col cols="12" sm="2">Package</v-col>
    </v-row>
    <v-divider></v-divider>
      <v-row v-for="placement in placements" :key="placement._id">
          <v-hover
              v-slot="{ hover }"
              open-delay="200"
            >
              <v-sheet @click="openPlacement(placement._id)" style="width:100%"
                :elevation="hover ? 10 : 1"
                :color="hover ? '#ECF0F1' : 'white'"
                :class="{ 'on-hover': hover }">
                  <v-row class="pl-4">
                  <v-col cols="12" sm="2">{{ placement.job_role }}</v-col>
                  <v-col cols="12" sm="2">{{ placement.job_type }}</v-col>
                  <v-col cols="12" sm="2">{{ placement.company_id.company_name }}</v-col>
                  <v-col cols="12" sm="2">{{ placement.placement_batch }}</v-col>
                  <v-col cols="12" sm="2">{{ placement.eligibility.branches }}</v-col>
                  <v-col cols="12" sm="2">{{ placement.package }}</v-col>

                  </v-row>
              </v-sheet>
          </v-hover>
      </v-row>
      </v-sheet>
  </v-container>
</template>

<script>
import axios from 'axios'


export default {
  name: "Placements",

  data: () => ({
      placements:[],
      company:[],
  }),
   methods:{
      openPlacement(data){
          this.$router.push({
            name: 'Placement',
            params: { id: data }
        });
      }
  },
  created(){

      axios.get('/api/placements/')
      .then(response=>{
          this.placements = response.data;
      })
      .catch(error =>{
          console.log(error);
      })
  },
};
</script>

