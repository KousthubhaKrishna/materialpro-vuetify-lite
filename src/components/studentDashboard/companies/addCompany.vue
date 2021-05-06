<template>
  <v-row justify="end" class="mr-10">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="success"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Add New Company
        </v-btn>
      </template>
      <v-card>  
        <v-card-title>
          <span class="headline">Company Profile</span>
        </v-card-title>
        <v-form ref="form">
        <v-card-text>
          <v-container>

            <v-alert v-if="error.length > 0" dense outlined text type="error">
            {{ error }}
             </v-alert>

            <v-row>
              <v-col
                cols="12"
                sm="5"
                class="pa-1"
              >
                <v-text-field
                  ref="company_id"
                  label="Company ID*"
                  v-model="companyData.companyId"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="7"
                class="pa-1"
              >
                <v-text-field
                  ref="company_name"
                  label="Company Name*"
                  v-model="companyData.company_name"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

                <v-col cols="12" sm="8" class="pa-0">
                    <v-text-field
                    ref="company_logo"
                    label="Company Logo"
                    v-model="companyData.photo_url"
                    ></v-text-field>
                </v-col>                

              <v-col cols="12" class="pa-0">
                  <v-textarea
                    ref="description"
                    name="input-7-1"
                    label="Job Description"
                    v-model="companyData.description"
                    auto-grow
                    >
                    </v-textarea>
                </v-col>
                
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submitCompany"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
     
    </v-dialog>

    </v-row>
</template>

<script>
import axios from 'axios';
import { EventBus } from '@/event-bus.js'

export default {
    data: () => ({
      dialog: false,
      companyData:{
          companyId:"",
          company_name:"",
          photo_url:"",
          description:""
      },
      error:"",
      rules:{
          required: value => !!value || " ",
      },
    }),
    methods:{

        closeDialog(){
          this.dialog = false; 
          this.error="";
          this.$refs.form.reset();
        },

        submitCompany(){
            let isValid = this.$refs.form.validate(true);
            console.log(isValid);
            if(isValid){
                this.dialog = false;
                axios.post('/api/company',this.companyData)
                .then(response =>{
                console.log("form submission",response.data)
                EventBus.$emit('companies', response.data);
                })
                .catch(error =>{
                    console.log(error)
                })
            }
            else{
              this.error = "Fill all the required Fields";
            } 
        }
    }
  }
</script>

