<template>
  <v-container fluid >
      <v-img
    lazy-src="https://picsum.photos/id/11/10/6"
    :aspect-ratio="16/10"
    max-height="280"
    width = "100%"
    :src="company.photo_url"

    ></v-img>
      <v-card >
          <v-card-title style="font-size-large" >
              {{company.company_name}}
          </v-card-title>
          <v-card-text>
              {{company.description}}
          </v-card-text>
      </v-card>

      <v-divider></v-divider>

      <v-row justify="end">
        <v-col>
            <AddPlacementDetails v-if="$PERMISSIONS.MED.has(user.role)"></AddPlacementDetails>
        </v-col>
      </v-row>
     
      <v-row>
          <v-col v-for="placement in placements" :key="placement._id">
              <v-hover
              v-slot="{ hover }"
              open-delay="200"
            >
              <v-card  
              outlined 
              @click="openPlacement(placement._id)"
              :elevation="hover ? 5 : 1"
              :class="{ 'on-hover': hover }">
                  <v-card-text>
                  {{ placement.job_type }}
                  {{ placement.package }}
                  {{ placement.job_description }}
                  </v-card-text>
              </v-card>
              </v-hover>
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

      const access_token = window.$cookies.get("jwt");
      let tokens = JSON.parse(atob(access_token.split(".")[1]));
      this.user = tokens;

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

