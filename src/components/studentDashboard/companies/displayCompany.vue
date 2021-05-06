<template>
  <div class = "mx-6" >
         <v-row justify='end' style="width:100%">
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
        
        <v-divider></v-divider>

        <div style="width:100%;height:100%" >
          <v-row justify="center" align="center" class="mt-10">
             <p v-if="filteredCompanies.length == 0"> No Results Found </p>
            </v-row>
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
            <v-card-actions v-if="$PERMISSIONS.MED.has(user.role)">
              <v-spacer></v-spacer>
              <EditCompany :company = "company"></EditCompany>
              <v-spacer></v-spacer>
              <v-btn
                class="ma-1"
                color="gray"
                elevation="0"
                @click="deleteCompany(company._id)"
              >
              <v-icon small>mdi-delete</v-icon>
                Delete
              </v-btn>
              <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title>Are you sure you want to delete this Comapny?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteCompanyConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
          </v-dialog>
              <v-spacer></v-spacer>

            </v-card-actions>

          </v-card>
          </v-hover>
          </v-col>
      </v-row>
        </div>
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
      dialogDelete: false,
      company_id:"",
  }),
  computed:{
    filteredCompanies: function(){
      return this.companies.filter((company) => {
        return ((company.company_name).toLowerCase()).match((this.search).toLowerCase());
      })
    }
  },
  watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      },
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

      deleteCompanyConfirm(){
        axios.delete('/api/company/'+this.company_id)
        .then(response=>{
            console.log(response.data);
            this.getCompanies();
        })
        .catch(error =>{
            console.log(error);
        })
        this.closeDelete();
      },

      deleteCompany(data){
        this.dialogDelete = true,
        this.company_id = data;
        console.log("enetre")
      },

      closeDelete(){
        this.dialogDelete = false ;
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
