<template>
  <v-container fluid class="down-top-padding">
      <v-card>
          <v-card-title>
              {{company.company_name}}
          </v-card-title>
          <v-card-text>
              {{company.description}}
          </v-card-text>
      </v-card>

      <v-row><v-col>
      <AddPlacementDetails></AddPlacementDetails>
      </v-col>
      </v-row>
     
      <v-row>
          <v-col v-for="placement in placements" :key="placement._id">
              <v-card elevation="3" outlined @click="openPlacement(placement._id)">
                  <v-card-text>
                  {{ placement.job_type }}
                  {{ placement.package }}
                  {{ placement.job_description }}
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>

      
    
  </v-container>
</template>

<script>
import axios from 'axios'


export default {
  name: "ListOfPlacements",

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

      axios.get('/api/company/'+this.$route.params.id)
      .then(response=>{
          this.company = response.data;
          console.log(this.company);
      })
      .catch(error =>{
          console.log(error);
      })

      axios.get('/api/placements/placements/'+this.$route.params.id)
      .then(response=>{
          this.placements = response.data;
          console.log(this.placements);
      })
      .catch(error =>{
          console.log(error);
      })
  },
  components:{
      AddPlacementDetails: () => import('@/components/studentDashboard/placements/addPlacementDetails'),
      //AddDatasnapshot: () => import('@/components/studentDashboard/placements/addDatasnapshot'),
  }
};
</script>

