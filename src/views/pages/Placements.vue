<template>
  <v-container fluid class="down-top-padding">  
      <v-sheet class="ma-2 pa-5" height="100%">
          <h2> Placements </h2>
    <v-row>
        <v-col>

        </v-col>
    </v-row>
    
    <v-row>
        <v-col cols="12" sm="4">Job Role</v-col>
        <v-col cols="12" sm="4">Job Type</v-col>
        <v-col cols="12" sm="4">Company Name</v-col>
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
                  <v-row>
                  <v-col cols="12" sm="4">{{ placement.job_role }}</v-col>
                  <v-col cols="12" sm="4">{{ placement.job_type }}</v-col>
                  <v-col cols="12" sm="4">{{ placement.company_id.company_name }}</v-col>
                  </v-row>
              </v-sheet>
          </v-hover>
      </v-row>
        <!-- <v-list flat>
        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
            <v-list-item
            v-for="(item, i) in placements"
            :key="i"
            >

            <v-list-item-content>
                <v-list-item-title v-text="item.job_role"></v-list-item-title>
                <v-list-item-title v-text="item.job_type"></v-list-item-title>
                <v-list-item-title v-text="item.company_id.company_name"></v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        </v-list> -->

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

