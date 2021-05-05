<template>
    <v-container fluid class="pa-10">

         <v-row>
          <v-col cols="12" v-for="(company,index) in companies" :key="index" sm="3">

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


            <v-card-actions v-if="$PERMISSIONS.MED.has(user.role)">

            <EditCompany :company = "company"></EditCompany>
            
            <v-btn
              color="error"
              depressed
              dark
              @click="deleteCompany(company._id)"
            >
              <v-icon left>
                mdi-delete
              </v-icon>
              Delete
            </v-btn>
            </v-card-actions>

          </v-card>
                
          </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { EventBus } from '@/event-bus.js'

export default {
    name: "DisplayCompanies",

    data: () => ({
      companies:[],
      user:"",
  }),
  methods:{
      openPlacements(data){
          this.$router.push({
            name: 'CompanyDetails',
            params: { id: data }
        });
      },

      getCompanies(){
        axios.get('/api/company')
      .then(response=>{
          this.companies = response.data;
          console.log(this.companies);
      })
      .catch(error =>{
          console.log(error);
      })
      },

      deleteCompany(data){
        axios.delete('/api/company/'+data)
        .then(response=>{
            console.log(response.data);
            this.getCompanies();
        })
        .catch(error =>{
            console.log(error);
        })
      },

     

  },
  created(){

      const access_token = window.$cookies.get("jwt");
      let tokens = JSON.parse(atob(access_token.split(".")[1]));
      this.user = tokens;

      this.getCompanies();

      EventBus.$on('companies', (value) => {
          this.companies.push(value)
        });

  },

  components:{
      EditCompany: () => import('@/components/studentDashboard/companies/editCompany'),
  }
  }
</script>
