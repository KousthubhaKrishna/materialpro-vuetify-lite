<template>
    <div class = "mx-6">
        <v-container class ="px-10" >
          <title>
            Companies List
          </title>

         <v-row justify='end'>
           <v-col cols="5">
             <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="  Search companies"
              hide-details
              single-line
            ></v-text-field>
           </v-col>
         </v-row> 
        </v-container>
        <v-divider></v-divider>
        <v-container class=" pa-6">
         <v-row align='center'>
          <v-col cols="12" v-for="(company,index) in filteredCompanies" :key="index" sm="4 ">
            <v-hover
              v-slot="{ hover }"
              open-delay="200"
            >
            <v-card
            :elevation="hover ? 5 : 1"
            :class="{ 'on-hover': hover }"
            outlined 
            @click="openPlacements(company._id)">
            <v-card-text class="font-weight-bold text-center" v-text="company.company_name"></v-card-text>
            <v-spacer></v-spacer>
            <v-card-actions v-if="$PERMISSIONS.MED.has(user.role)">
              <div>
            <EditCompany :company = "company"></EditCompany>

            <v-icon
              small
              class="mr-2"
              @click="deleteCompany(company._id)"
            >
              mdi-delete
            </v-icon>
              </div>
           
            </v-card-actions>

          </v-card>
          </v-hover>
          </v-col>
      </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '@/event-bus.js'

export default {
    name: "DisplayCompanies",

    data: () => ({
      companies:[],
      user:"",
      search:'',
  }),
  computed:{
    filteredCompanies: function(){
      return this.companies.filter((company) => {
        return company.company_name.match(this.search);
      })
    }
  },
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
