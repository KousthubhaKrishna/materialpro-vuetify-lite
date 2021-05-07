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
         <v-row align='center' class="mx-10">
          <v-col cols="12" v-for="(company,index) in filteredCompanies" :key="index" sm="6">
            <v-hover
              v-slot="{ hover }"
              open-delay="200"
            >
            <v-sheet
            :elevation="hover ? 5 : 1"
            :class="{ 'on-hover': hover }"
            outlined 
            >
            <v-row >
              <v-col cols="12" sm="8">
            <p class="font-weight-medium text-center pa-2 mb-0" @click="openPlacements(company._id)"> {{ company.company_name }} </p>
              </v-col>

              <v-col col="12" sm="4" class="text-right">
                
                <div v-if="$PERMISSIONS.MED.has(user.role)">
                  <v-spacer></v-spacer>
                  <EditCompany :company = "company" class="d-inline"></EditCompany>
                  <v-btn
                    class="d-inline mr-2"
                    icon
                    color="gray"
                    elevation="0"
                    @click="deleteCompany(company._id)"
                  >
                  <v-icon>mdi-delete</v-icon>

                  </v-btn> 
                </div>
              </v-col>
            </v-row>
          </v-sheet>
          </v-hover>
          </v-col>
      </v-row>
      <v-dialog v-model="dialogDelete" max-width="500px" class="pa-3">
              <v-card>
                <v-card-title class="font-weight-regular text--center" style="font-size:1rem;">Are you sure you want to delete this Company?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteCompanyConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
          </v-dialog>
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
