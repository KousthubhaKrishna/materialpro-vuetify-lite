<template>
    <v-container fluid class="pa-10">

         <v-row>
          <v-col cols="12" v-for="company in companies" :key="company._id" sm="3">

               <v-card outlined @click="openPlacements(company._id)">
            <v-img
              :src="company.photo_url"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="150px"
              alt="company.company_name"
            >
            </v-img>
            <v-card-title v-text="company.company_name"></v-card-title>
          </v-card>
                
          </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    name: "DisplayCompanies",

    data: () => ({
      companies:[],
  }),
  methods:{
      openPlacements(data){
          this.$router.push({
            name: 'CompanyDetails',
            params: { id: data }
        });
      }
  },
  created(){
      axios.get('/api/company')
      .then(response=>{
          this.companies = response.data;
          console.log(this.companies);
      })
      .catch(error =>{
          console.log(error);
      })
  },
  }
</script>
