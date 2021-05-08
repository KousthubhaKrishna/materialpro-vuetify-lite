<template>
  <v-container fluid >
    <v-card >
        <v-img
        lazy-src="https://us.123rf.com/450wm/deniaz/deniaz2002/deniaz200200068/139842414-photography-grey-card-for-white-balance-isolated-on-a-white-background-with-copy-space-.jpg?ver=6"
        :aspect-ratio="16/10"
        max-height="280"
        width = "100%"
        :src="company.photo_url"

        ></v-img>

          <v-card-title style="font-size:3rem;font:roboto;font-weight:300" class="ma-5 pt-10" >
              {{company.company_name}}
          </v-card-title>
          <v-card-text class="ma-5 pa-4 font-weight-medium "  style="font-size:0.9rem;white-space: pre-line;">
              {{company.description}}
          </v-card-text>
      </v-card>

      <v-divider></v-divider>

      <v-sheet class="pl-7 py-6 pr-5 ">

      <v-row>
        <v-col><p style="font-size:1.5rem;">Placements</p></v-col>
        <v-col>
            <AddPlacementDetails v-if="$PERMISSIONS.MED.has(user.role)"></AddPlacementDetails>
        </v-col>
      </v-row>
        <v-divider></v-divider>
      <v-row v-if="placements.length==0" justify="center" class="pa-6">
          <p>No Placements yet</p>
      </v-row>
     
     <v-sheet style="width:100%" class="mt-8 mx-6">
      <v-row>
          <v-col cols="12" v-for="placement in placements" :key="placement._id" sm="4">
              <v-hover
              v-slot="{ hover }"
              open-delay="200"
              >
            
              <v-card  
              outlined 
              @click="openPlacement(placement._id)"
              :elevation="hover ? 3 : 1"
              color="#ECF0F1"
              :class="{ 'on-hover': hover }">
                  <v-card-text class="font-weight-large text--primary">
                  {{ placement.job_type }}
                  <span text-align="right">{{ placement.placement_batch }}</span>
                  </v-card-text>
              </v-card>
              </v-hover>
          </v-col>
      </v-row>
     </v-sheet>

    </v-sheet>
      
    
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
      console.log(this.user);

      axios.get('/api/company/'+this.$route.params.id)
      .then(response=>{
          this.company = response.data;
      })
      .catch(error =>{
          console.log(error);
      })

      axios.get('/api/placements/placements/'+this.$route.params.id)
      .then(response=>{
          this.placements = response.data;
      })
      .catch(error =>{
          console.log(error);
      })
  },
  components:{
      AddPlacementDetails: () => import('@/components/studentDashboard/placements/addPlacementDetails'),
  }
};
</script>

