<template>
<div class="pl-6">
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
          Register
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Registration Form</span>
        </v-card-title>
        <v-form ref="form">
        <v-card-text>
          <v-container>
            <v-row >
              <v-col cols="12" v-for="(field,index) in snapData.fields" :key="index">
                <v-text-field
                v-if="field == 'backlogs'"
                  v-model="fields_set[field]"
                  :label="field"
                  type = "number"
                  disabled
                ></v-text-field>
                <v-text-field
                v-else
                v-model="fields_set[field]"
                :label="field"
                :rules="[rules.required]"
                disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-for="(k, index) in snapData.extra_fields" :key="index">
                <v-text-field
                :label="k"
                v-model = "extra_fields[k]"
                :rules="[rules.required]"
                ></v-text-field>
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
            @click="register"
          >
            Save
          </v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

  export default {
    name: "Register",
   
   data: () => ({
      dialog: false,
      isActive:true,
      menu: false,
      snapData:"",
      fields_set:{},
      fields:{},
      extra_fields:{},
      user:{},
      error:"",
      rules:{
          required: value => !!value || " ",
          number: v => /^\d+$/.test(v)||'This field only accept numbers',
      },
    }),

   created(){        
        const access_token = window.$cookies.get("jwt");
        let tokens = JSON.parse(atob(access_token.split(".")[1]));
        this.user = tokens;
      
        this.getSnapData();
        this.getStudentData();
        
        // this.isAlreadyRegistered();

   },
    methods:{

      initialiseFields(){
        this.snapData.fields.forEach(element => {
          this.fields[element]=this.fields_set[element];
        });
        console.log("fields",this.fields);
      },

      initialiseExtraFields(){
        this.snapData.extra_fields.forEach(element => {
          this.extra_fields[element]="";
          console.log(element);
        });
        console.log(this.extra_fields)
      },

        save (date) {
        this.$refs.menu.save(date)
        console.log(this.snapData.last_date);
      },

        closeDialog(){
          this.dialog = false; 
          this.error="";
        },

        getField(data){
          data = data.replace(/ /g,'_').toLowerCase();
          return data;
        },

        getSnapData(){

          axios.get('/api/placements/register/'+this.$route.params.id)
            .then(response =>{
              if(response.data == null){
                this.isActive = false;
              }
              this.snapData = response.data;
              console.log(this.snapData);
              this.initialiseExtraFields();
                })
              .catch(error =>{
                  console.log(error)

              })
        },

        getStudentData(){
          axios.get('/api/students/myProfile')
          .then( response =>{
            this.fields_set["first_name"] = response.data.basic_info.first_name;
            this.fields_set["last_name"] = response.data.basic_info.last_name;
            this.fields_set["full_name"] = response.data.basic_info.full_name;
            this.fields_set["roll_number"] = response.data.basic_info.roll_number;
            this.fields_set["branch"] = response.data.basic_info.branch;
            this.fields_set["section"] = response.data.basic_info.section;
            this.fields_set["placement_batch"] = response.data.basic_info.placement_batch;
            this.fields_set["primary_email"] = response.data.contact_info.primary_email;
            this.fields_set["secondary_email"] = response.data.contact_info.secondary_email;
            this.fields_set["mobile"] = response.data.contact_info.mobile;
            this.fields_set["secondary_mobile"] = response.data.contact_info.secondary_mobile;
            this.fields_set["cgpa"] = response.data.education.cgpa;
            this.fields_set["backlogs"] = response.data.education.backlogs;
            this.fields_set["college"] = response.data.education.inter_or_diploma_college;
            this.fields_set["inter_percentage"] = response.data.education.inter_or_diploma_percentage;
            this.fields_set["school"] = response.data.education.school;
            this.fields_set["school_percentage"] = response.data.education.school_percentage;
            this.fields_set["eamcet_rank"] = response.data.education.eamcet_rank;
            this.fields_set["jee_mains_rank"] = response.data.education.jee_rank;
            this.fields_set["parent_name"] = response.data.personal_info.parent_name;
            this.fields_set["address"] = response.data.personal_info.address;
            this.fields_set["city"] = response.data.personal_info.city;
            this.fields_set["state"] = response.data.personal_info.state;
            this.fields_set["zipcode"] = response.data.personal_info.zipcode;
            this.fields_set["gender"] = response.data.personal_info.gender;
            this.fields_set["date_of_birth"] = response.data.personal_info.date_of_birth;
            this.fields_set["photo_url"] = response.data.photo_url;
            this.fields_set["resume_url"] = response.data.resume_url;

            console.log("set",this.fields_set);
        })
        .catch(error =>{
            console.log(error)
        })
        },

        register(){

          console.log(this.extra_fields);
          this.initialiseFields();

          let isValid = this.$refs.form.validate(true);
          console.log(isValid);
          if(isValid){
              this.dialog = false;
              this.fields['user_email'] = this.user.user_email;
              this.fields['student_Id'] = this.user._id; 
              axios.patch('/api/snaps/add_data/'+this.snapData._id, {...this.fields,...this.extra_fields})
              .then(response =>{
              console.log("registered successfully",response.data);
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
