<template>
<v-row justify="end" class="mr-10 mt-8 mb-5">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Add Placement
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="headline">Placement Details</span>
        </v-card-title>
        <v-form ref="form">
        <v-card-text>
          <v-container>

            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="Job Role"
                  v-model="placementData.job_job_role"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="Job Type*"
                  v-model="placementData.job_type"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="Package"
                  v-model="placementData.package"
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="drive_details*"
                  v-model="placementData.drive_details"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                  <v-textarea
                    name="input-7-1"
                    label="Job Description"
                    v-model="placementData.job_description"
                    auto-grow
                    value=""
                    >
                    </v-textarea>
                </v-col>


              <v-col cols="12" sm="6">
                <v-text-field
                  label="Placement batch*"
                  v-model="placementData.placement_batch"
                  :rules="[rules.required, rules.number]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="cgpa Criteria*"
                  v-model="placementData.cgpa"
                  :rules="[rules.required, rules.number]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="Backlogs*"
                  v-model="placementData.backlogs"
                  :rules="[rules.required, rules.number]"
                ></v-text-field>
              </v-col>
               
              <v-col
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  :items="['Civil', 'CSE', 'ECE', 'IT', 'EEE', 'Mech', 'Bio-tech', 'Chem', 'M-Tech','all']"
                  label="Branches"
                  v-model="placementData.branches"
                  :rules="[rules.required]"
                  multiple
                ></v-autocomplete>
              </v-col>
              
            </v-row>
          </v-container>
          <small>*indicates required field</small>
          <v-alert v-if="error.length > 0" dense outlined text type="error">
            {{ error }}
             </v-alert>
        </v-card-text>
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
            @click="addPlacement"
          >
            Save
          </v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios';

  export default {
    name: "AddPlacementDetails",
   data: () => ({
      dialog: false,
      placementData:{
          job_role:"",
          job_type:"",
          job_description:"",
          package:"",
          drive_details:"",
          placement_batch:"",
          cgpa:"",
          backlogs:"",
          posted_date:"",
          branches:[],
          message:"A new placement is created"
      },
      error:"",
      rules:{
          required: value => !!value || " ",
          number: v => /^\d*(\.\d{1,2})?$/.test(v)||'This field only accept numbers',
      },
    }),
    created(){

    },
    methods:{

        closeDialog(){
          this.dialog = false; 
          this.error="";
          this.$refs.form.reset();
        },

        addPlacement(){
            let isValid = this.$refs.form.validate(true);
            console.log(isValid);
            if(isValid){
                this.dialog = false;
                this.placementData.posted_date = new Date().toISOString();
                axios.post('/api/placements/'+this.$route.params.id ,this.placementData)
                .then(response =>{
                console.log("form submission",response.data);
                this.$router.push({name: 'Placement',params: { id: response.data._id }});
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