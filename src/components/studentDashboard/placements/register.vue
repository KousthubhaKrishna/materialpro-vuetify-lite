<template>
<div>
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
                v-model="$data[getField(field)]"
                :label="field"

                ></v-text-field>
              </v-col>
              <v-col cols="12" v-for="(field,index) in snapData.extra_fields" :key="index">
                <v-text-field
                :ref = "getField(field)"
                :label="field"
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
      menu: false,
      // studentData:"",
      snapData:"",


      first_name: "",
      last_name: "",
      full_name: "",
      roll_number: "",
      section: "",
      placement_batch: "",
      primary_email: "",
      secondary_email: "",
      mobile:"",
      secondary_mobile:"",
      cgpa:"",
      backlogs:"",
      inter_or_diploma_college:"",
      inter_or_diploma_percentage:"",
      school:"",
      school_percentage:"",
      eamcet_rank:"",
      jee_rank:"",
      parent_name:"",
      address:"",
      city:"",
      state:"",
      zipcode:"",
      date_of_birth:"",
      photo_url: "",
      resume_url: "",


      extra_fields:[],

      error:"",
      rules:{
          required: value => !!value || " ",
          number: v => /^\d+$/.test(v)||'This field only accept numbers',
      },
    }),

   created(){        

        axios.get('/api/students/myProfile')
        .then( response =>{
            // this.student = response.data;
            // console.log("student", this.student);

            this.first_name = response.data.basic_info.first_name;
            this.last_name = response.data.basic_info.last_name;
            this.full_name = response.data.basic_info.full_name;
            this.roll_number = response.data.basic_info.roll_number;
            this.branch = response.data.basic_info.branch;
            this.section = response.data.basic_info.section;
            this.placement_batch = response.data.basic_info.placement_batch;
            this.primary_email = response.data.contact_info.primary_email;
            this.secondary_email = response.data.contact_info.secondary_email;
            this.mobile = response.data.contact_info.mobile;
            this.secondary_mobile = response.data.contact_info.secondary_mobile;
            this.cgpa = response.data.education.cgpa;
            this.backlogs = response.data.education.backlogs;
            this.inter_or_diploma_college = response.data.education.inter_or_diploma_college;
            this.inter_or_diploma_percentage = response.data.education.inter_or_diploma_percentage;
            this.school = response.data.education.school;
            this.school_percentage = response.data.education.school_percentage;
            this.eamcet_rank = response.data.education.eamcet_rank;
            this.jee_rank = response.data.education.jee_rank;
            this.parent_name = response.data.personal_info.parent_name;
            this.address = response.data.personal_info.address;
            this.city = response.data.personal_info.city;
            this.state = response.data.personal_info.state;
            this.zipcode = response.data.personal_info.zipcode;
            this.gender = response.data.personal_info.gender;
            this.date_of_birth = response.data.personal_info.date_of_birth;
            this.photo_url = response.data.photo_url;
            this.resume_url = response.data.resume_url;

        })
        .catch(error =>{
            console.log(error)
        })

        this.getSnapData();

   },
    methods:{

        save (date) {
        this.$refs.menu.save(date)
        console.log(this.snapData.last_date);
      },

        closeDialog(){
          this.dialog = false; 
          this.error="";
          this.$refs.form.reset();
          
        console.log(this.extra_fields);
        },

        getField(data){
          data = data.replace(/ /g,'_').toLowerCase();
          return data;
        },

        getSnapData(){

          axios.get('/api/placements/register/'+this.$route.params.id)
            .then(response =>{
              this.snapData = response.data;
              this.extra_fields = response.data.extra_fields;
              console.log("snap",response.data)
                })
              .catch(error =>{
                  console.log(error)

              })
        },


        register(){

          axios.get('api/students/student_data')

            // const student = {};

            // this.extra_fields.forEach(element => {
            //   this.extra_fields[element] = this.$refsgetField(this.extra_fields[element]);
            // });

            // this.snapData.fields.forEach(element => {

              
            // });

            // console.log(this.extra_fields)

            // let isValid = this.$refs.form.validate(true);
            // console.log(isValid);
            // if(isValid){
            //     this.dialog = false;
            //     // this.snapData.last_date = this.$refs.last_date.toISOString();
            //     axios.patch('/api/snaps/add_data/'+this.$route.params.id, this.snapData)
            //     .then(response =>{
            //     console.log("registered successfully",response.data);
            //     })
            //     .catch(error =>{
            //         console.log(error)
            //     })
  
            // }
            // else{
            //   this.error = "Fill all the required Fields";
            // } 
        }
    }
     // const access_token = window.$cookies.get("jwt");
      // let tokens = JSON.parse(atob(access_token.split(".")[1]));
      // this.user = tokens;
  }
</script>

     