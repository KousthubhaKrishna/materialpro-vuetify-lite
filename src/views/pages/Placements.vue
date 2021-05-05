<template>
  <v-container fluid class="down-top-padding">  
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
          console.log(this.placements);
      })
      .catch(error =>{
          console.log(error);
      })
  },
};
</script>

