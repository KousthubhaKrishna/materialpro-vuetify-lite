<template>
  <div class = "mx-6" >

      <v-card class="mb-5 mx-5">
    
      <v-card-actions>
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
         
          <v-col cols="12" sm="5" class="text-right">
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="  Search companies"
              hide-details
              single-line
            ></v-text-field>
         
          </v-col >
           <v-col  v-if="$PERMISSIONS.MED.has(user.role)" cols="12" sm="3"> 
            <AddCompany></AddCompany>
          </v-col> 
        </v-row>
      <!-- </v-toolbar> -->
      </v-card-actions>
    </v-card>
     
        <v-divider></v-divider>

        <div style="width:100%;height:100%" >
          <v-row justify="center" align="center" class="mt-10" v-if="filteredCompanies.length == 0">
             <p > No Results Found </p>
            </v-row>
         <v-row align='center' class="mx-5 mt-5" v-else>
          <v-col cols="12" v-for="(company,index) in filteredCompanies" :key="index" sm="3">
            <v-hover
              v-slot="{ hover }"
              open-delay="200"
            >
            <v-card
                class="mx-auto"
                max-width="300"
                :elevation="hover ? 3 : 1"
                :class="{ 'on-hover': hover }"
              >
                <v-img
                  lazy-src="https://us.123rf.com/450wm/deniaz/deniaz2002/deniaz200200068/139842414-photography-grey-card-for-white-balance-isolated-on-a-white-background-with-copy-space-.jpg?ver=6"
                  height="180px"
                  :src="company.photo_url"
                  @click="openPlacements(company._id)"
                >
                  
                </v-img>

                <v-card-actions >
                  <v-card-title class="pr-0 font-weight-medium" style="font-size:1rem;">{{company.company_name}}</v-card-title>
                  <v-spacer></v-spacer>

                <div v-if="$PERMISSIONS.MED.has(user.role)" class="text-right">
                  <EditCompany :company = "company" class="d-inline"></EditCompany>
                    <v-btn
                        class="d-inline mr-1"
                        icon
                        color="black"
                        elevation="0"
                        @click="deleteCompany(company._id)"
                      >
                      <v-icon>mdi-delete</v-icon>

                    </v-btn> 
                </div>
                </v-card-actions>
              </v-card>

              <!-- <v-card
              :elevation="hover ? 5 : 1"
              :class="{ 'on-hover': hover }"
              class="pa-0"
              outlined
             >
              <v-card-actions class="pa-0">

               <v-row align="center"> 
                 <v-col class="pa-0" cols="12" sm="4">
                   <v-img
                      src="company."
                      height="100px"
                      width = "80px"
                    ></v-img>
                 </v-col>
               <v-col cols="12" class="pa-0" sm="4" @click="openPlacements(company._id)" align="center"> <p class="mb-0 pl-2 font-text-medium">{{company.company_name}}</p></v-col>
              
              <v-col cols="12" sm="4" v-if="$PERMISSIONS.MED.has(user.role)" class="text-right pr-4" align="center">
                <v-spacer></v-spacer>
                    <EditCompany :company = "company" class="d-inline"></EditCompany>
                      <v-btn
                        class="d-inline mr-1"
                        icon
                        color="gray"
                        elevation="0"
                        @click="deleteCompany(company._id)"
                      >
                      <v-icon>mdi-delete</v-icon>

                      </v-btn> 
              </v-col>
               </v-row>
              </v-card-actions>
            </v-card> -->
           
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
      AddCompany: () => import('@/components/studentDashboard/companies/addCompany'),
  }
  }
</script>
