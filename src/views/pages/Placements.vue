<template>
  <v-container fluid class="down-top-padding">  
      <v-sheet class="ma-2 pa-5" height="100%">
          <h2> Placements </h2>

    <v-card class="mb-5">
      <v-card-actions >
        <v-row align="center">
          <v-col align-self="center" cols="12" sm="4">
            <h3 class=" font-weight-medium">
              <v-icon
                class="mx-2"
                color="primary">
                mdi-filter
              </v-icon>
              Filters 
            </h3>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Company"
              append-icon="mdi-magnify"
              v-model="filter.company_name"
              ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Year of passing"
              append-icon="mdi-magnify"
              v-model="filter.placement_batch"
              ></v-text-field>
          </v-col>
          <!-- <v-col align-self="center">
          <v-btn color="primary" @click="filterData" > <v-icon> mdi-magnify </v-icon> </v-btn>
          </v-col>
          <v-col align-self="center">
            <v-btn :color="this.editor.toggleColor" @click="toggleEditor" >
              <v-icon
                small
                class="mr-2"
                >
                {{ this.editor.toggleIcon || "mdi-note-plus" }}
              </v-icon>
              {{ this.editor.toggleText }}
            </v-btn>
          </v-col> -->
        </v-row>
      </v-card-actions>
    </v-card>

    <v-divider></v-divider>
    
    <v-row class = "blue--text">
        <v-col cols="12" sm="1">Job Role</v-col>
        <v-col cols="12" sm="1">Job Type</v-col>
        <v-col cols="12" sm="2">Company Name</v-col>
        <v-col cols="12" sm="1">Batch</v-col>
        <v-col cols="12" sm="3">Branch</v-col>
        <v-col cols="12" sm="2">Package</v-col>
        <v-col cols="12" sm="1">CGPA</v-col>
    </v-row>
    <v-divider></v-divider>
      <v-row v-for="placement in filteredPlacements" :key="placement._id">
          <v-hover
              v-slot="{ hover }"
              open-delay="200"
            >
              <v-sheet @click="openPlacement(placement._id)" style="width:100%"
                :elevation="hover ? 10 : 1"
                :color="hover ? '#ECF0F1' : 'white'"
                :class="{ 'on-hover': hover }">
                  <v-row class="pl-4">
                  <v-col cols="12" sm="1">{{ placement.job_role }}</v-col>
                  <v-col cols="12" sm="1">{{ placement.job_type }}</v-col>
                  <v-col cols="12" sm="2">
                      <p class="primary--text">
                        {{ placement.company_id.company_name }}
                      </p>
                  </v-col>
                  <v-col cols="12" sm="1">{{ placement.placement_batch }}</v-col>
                  <v-col cols="12" sm="3">
                    <v-chip v-for="branch in placement.eligibility.branches" :key="branch">
                      {{ branch }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" sm="2">{{ placement.package }}</v-col>
                  <v-col cols="12" sm="1">{{ placement.eligibility.cgpa  }}</v-col>
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
      filter:{
          company_name:"",
          placement_batch:"",
      }
  }),
   methods:{
      openPlacement(data){
          this.$router.push({
            name: 'Placement',
            params: { id: data }
        });
      },
  },

  computed:{
      filteredPlacements: function(){
          return this.placements.filter((placement) => {
              return ((placement.company_id.company_name).toLowerCase()).match((this.filter.company_name).toLowerCase()) && (placement.placement_batch).match(this.filter.placement_batch)
          })
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

