<template>
  <v-container fluid class="down-top-padding">
    <v-form 
      ref="form"
      v-model="valid"
      lazy-validation
      >
      <v-row>
        <v-col cols="12" lg="12">
          <v-card>
            <v-card-text class="text-center pa-7">
              <img
                :src="photo_url || 'https://randomuser.me/api/portraits/men/81.jpg'"
                alt="user"
                width="150px"
                class="img-fluid rounded-circle shadow-sm"
                />
              <h4 class="mt-2 title blue--text text--darken-2 font-weight-regular">
                {{ full_name }}                 
                <v-icon
                  v-if="this.is_verified"
                  medium
                  color = "green"
                  >
                  mdi-check-circle-outline
                </v-icon>
                <v-icon
                  v-else
                  medium
                  color = "red"
                  >
                  mdi-alert-circle-outline
                </v-icon>
              </h4>
            </v-card-text>
            <!-- <input type="button" @click="disabled = (disabled + 1) % 2" ></input> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :color = "disabled ? 'primary' : 'secondary'"
                @click="isDisabled"
                >
                <v-icon
                  v-if="disabled"
                  medium
                  class="mr-2"
                  >
                  mdi-pencil
                </v-icon>
                {{ disabled ? "Edit Profile" : "View Profile" }}
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-card-text v-if="!disabled">
              <h4>Instructions for editing your profile: </h4>
              <p>
              <ul>
                <li> If you filling your profile for the first time, please fill all of your info carefully.</li>
                <li> Once you submit your details, a request will be sent to your placement coordinator and you will become a verified student once they approve.</li>
                <li>If you are a verified student, do not change your basic information, contact information, CGPA and Backlogs.</li>
                <li> Changing the critical information</li>
              </ul>
              </p>
              <p class="red--text" > Please read the instructions carefully before editing your profile. </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-text>
              <h3 class="title blue-grey--text text--darken-2 font-weight-regular">Basic Info </h3>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="first_name"
                    :rules="generalRules"
                    label="First name"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="last_name"
                    :rules="generalRules"
                    label="Last name"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                v-model="full_name"
                label="Full Name"
                :rules="generalRules"
                :disabled="disabled"
                ></v-text-field>
              <v-text-field
                v-model="roll_number"
                label="Roll number"
                :rules="generalRules"
                :counter="12"
                :disabled="disabled"
                ></v-text-field>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-select 
                    :items="branch" 
                    label="branch"  
                    :disabled="disabled" 
                    :rules="generalRules"
                    v-model="branch">
                  </v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="section"
                    label="Section"
                    :rules="generalRules"
                    :counter="1"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                v-model="placement_batch"
                label="Year of passing"
                :rules="generalRules"
                :disabled="disabled"
                ></v-text-field>
              <!-- <v-btn class="text-capitalize mt-5 element-0" color="success">Submit</v-btn> -->
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-text>
              <h3 class="title blue-grey--text text--darken-2 font-weight-regular">Contact Info</h3>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                type="email"
                v-model="primary_email"
                label="primary email"
                :rules="emailRules"
                :disabled="disabled"
                ></v-text-field>
              <v-text-field
                type="email"
                v-model="secondary_email"
                label="secondary email"
                :disabled="disabled"
                ></v-text-field>
              <v-text-field
                v-model="mobile"
                label="primary mobile"
                :counter="10"
                :rules="mobileRules"
                :disabled="disabled"
                ></v-text-field>
              <v-text-field
                v-model="secondary_mobile"
                label="secondary mobile"
                :rules="mobileRules "
                :counter="10"
                :disabled="disabled"
                ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-text>
              <h3 class="title blue-grey--text text--darken-2 font-weight-regular">Education Info</h3>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="cgpa"
                    label="CGPA"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="backlogs"
                    label="backlogs"
                    :rules="backlogRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="inter_or_diploma_college"
                    label="inter/diploma College"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="inter_or_diploma_percentage"
                    label="Inter/Diploma Percentage"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="school"
                    label="school"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="school_percentage"
                    label="School Percentage"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="eamcet_rank"
                    label="Eamcet Rank"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="jee_rank"
                    label="jee Mains Rank"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card>
            <v-card-text>
              <h3 class="title blue-grey--text text--darken-2 font-weight-regular">Personal Info</h3>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="parent_name"
                    :rules="generalRules"
                    label="Parent Name"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-select 
                    :items="gender" 
                    label="Gender"  
                    :disabled="disabled" 
                    :rules="generalRules"
                    v-model="gender">
                  </v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <!-- <v-text-field
                    v-model="date_of_birth"
                    label="Date of Birth"
                    ></v-text-field> -->
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date_of_birth"
                        label="Birthday date"
                        readonly
                        :disabled="disabled" 
                        v-bind="attrs"
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="date_of_birth"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                      @change="save"
                      ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="address"
                    label="Address"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="city"
                    label="City"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  >
                  <v-text-field
                    v-model="state"
                    label="State"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  >
                  <v-text-field
                    v-model="zipcode"
                    label="Zipcode"
                    :rules="generalRules"
                    :disabled="disabled"
                    ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-text-field
            v-model="photo_url"
            label="Photo URL"
            :rules="generalRules"
            :disabled="disabled"
          ></v-text-field>
          <v-text-field
            v-model="resume_url"
            label="Resume URL"
            :rules="generalRules"
            :disabled="disabled"
          ></v-text-field>
        </v-col>
        <v-col align="right" v-if=!disabled>
          <v-btn class="text-capitalize mt-5 element-0" color="success" @click="submitForm">Submit</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.type"
      >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>

export default {
  name: "Profile",

  data: () => ({
    studentData: null,
    posts: [],
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
    valid: true,
    menu: false,
    disabled: true,
    snackbar: {
      show : false,
      text : "",
      type : "",
    },
    generalRules: [
        v => !!v || 'This field is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Enter your primary mail Id given by college',
      ],
      mobileRules: [
        v => !!v || 'This field is required',
        // v => ( v.length == 10 ) || "This field must have 10 characters",
        v => /^\d+$/.test(v)||'This field only accept numbers'
      ],
      backlogRules:[
        // v => !!v || 'This field is required',
          v => (v>=0) || 'This field is required'
      ],

    gender:["Female","Male","Other"],
    branch: ["CSE", "ECE", "IT","Civil"]

  }),
  components: {},
  watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
  methods: {
    save (date) {
        this.$refs.menu.save(date)
        console.log(this.date_of_birth);
      },
    isDisabled(){
        this.disabled = !(this.disabled)
    },
    reset () {
        this.$refs.form.reset()
      },
      updateCurrentStudentInfo() {
        this.studentData.is_verified = this.is_verified;
        this.studentData.basic_info.first_name = this.first_name;
        this.studentData.basic_info.last_name = this.last_name;
        this.studentData.basic_info.full_name = this.full_name;
        this.studentData.basic_info.roll_number = this.roll_number;
        this.studentData.basic_info.branch = this.branch;
        this.studentData.basic_info.section = this.section;
        this.studentData.basic_info.placement_batch = this.placement_batch;
        this.studentData.contact_info.primary_email = this.primary_email;
        this.studentData.contact_info.secondary_email = this.secondary_email;
        this.studentData.contact_info.mobile = this.mobile;
        this.studentData.contact_info.secondary_mobile = this.secondary_mobile;
        this.studentData.education.cgpa = this.cgpa;
        this.studentData.education.backlogs = this.backlogs;
        this.studentData.education.inter_or_diploma_college = this.inter_or_diploma_college;
        this.studentData.education.inter_or_diploma_percentage = this.inter_or_diploma_percentage;
        this.studentData.education.school = this.school;
        this.studentData.education.school_percentage = this.school_percentage;
        this.studentData.education.eamcet_rank = this.eamcet_rank;
        this.studentData.education.jee_rank = this.jee_rank;
        this.studentData.personal_info.parent_name = this.parent_name;
        this.studentData.personal_info.address = this.address;
        this.studentData.personal_info.city = this.city;
        this.studentData.personal_info.state = this.state;
        this.studentData.personal_info.zipcode = this.zipcode;
        this.studentData.personal_info.gender = this.gender;
        this.studentData.personal_info.date_of_birth = this.date_of_birth;
        this.studentData.photo_url = this.photo_url;
        this.studentData.resume_url = this.resume_url;
    },
    submitForm(){
      console.log("SUBMIT FORM");
      if(this.posts == null && this.$refs.form.validate()){
        console.log("POSTING");
        this.$axios.post('/api/students',{
            first_name : this.first_name,
            last_name : this.last_name,
            full_name : this.full_name,
            roll_number : this.roll_number,
            branch : this.branch,
            section : this.section,
            placement_batch : this.placement_batch,
            primary_email : this.primary_email,
            secondary_email : this.secondary_email,
            mobile : this.mobile,
            secondary_mobile : this.secondary_mobile,
            cgpa : this.cgpa,
            backlogs : this.backlogs,
            inter_or_diploma_college : this.inter_or_diploma_college,
            inter_or_diploma_percentage : this.inter_or_diploma_percentage,
            school : this.school,
            school_percentage : this.school_percentage,
            eamcet_rank : this.eamcet_rank,
            jee_rank : this.jee_rank,
            parent_name : this.parent_name,
            address : this.address,
            city : this.city,
            state : this.state,
            zipcode : this.zipcode,
            gender : this.gender,
            date_of_birth : this.date_of_birth,
            photo_url : this.photo_url,
            resume_url : this.resume_url
        })
          .then( response =>{
              console.log("form submission",response.data)
              this.snackbar.type = "green";
              this.snackbar.text = "Updated your profile";
              this.snackbar.show = true;
              this.updateCurrentStudentInfo();
          })
          .catch(error =>{
              console.log(error)
          })
      }
      else{
        console.log("PATCHING");
        this.$axios.patch('/api/students',{
            first_name : this.first_name,
            last_name : this.last_name,
            full_name : this.full_name,
            roll_number : this.roll_number,
            branch : this.branch,
            section : this.section,
            placement_batch : this.placement_batch,
            primary_email : this.primary_email,
            secondary_email : this.secondary_email,
            mobile : this.mobile,
            secondary_mobile : this.secondary_mobile,
            cgpa : this.cgpa,
            backlogs : this.backlogs,
            inter_or_diploma_college : this.inter_or_diploma_college,
            inter_or_diploma_percentage : this.inter_or_diploma_percentage,
            school : this.school,
            school_percentage : this.school_percentage,
            eamcet_rank : this.eamcet_rank,
            jee_rank : this.jee_rank,
            parent_name : this.parent_name,
            address : this.address,
            city : this.city,
            state : this.state,
            zipcode : this.zipcode,
            gender : this.gender,
            date_of_birth : this.date_of_birth,
            photo_url : this.photo_url,
            resume_url : this.resume_url
        })
          .then( response =>{
              console.log("form update",response.data);
              if (! this.checkVerification()) {
                this.snackbar.text = "Changes detected in critical inforamtion. Submitted for approval";
                this.snackbar.type = "alert";
              } else {
                this.snackbar.type = "green";
                this.snackbar.text = "Updated your profile";
              }
              this.snackbar.show = true;
              this.updateCurrentStudentInfo();
          })
          .catch(error =>{
              console.log(error);
              this.snackbar.text = error;
              this.snackbar.type = "error";
              this.snackbar.show = true;
          });
      }
    },
    checkVerification() {
      console.log("CHECK VERFICATION");
      var fetched_basic_info  = {
        ...this.studentData.basic_info,
        cgpa : this.studentData.education.cgpa,
        backlogs: this.studentData.education.backlogs,
      }
      var current_basic_info = {
        _id: this.studentData.basic_info._id,
        first_name: this.first_name,
        last_name: this.last_name,
        full_name: this.full_name,
        roll_number: this.roll_number,
        branch: this.branch,
        section: this.section,
        placement_batch: this.placement_batch,
        cgpa: this.cgpa,
        backlogs: this.backlogs
      }
      return JSON.stringify(fetched_basic_info) === JSON.stringify(current_basic_info);
    }
  },
  created() {
    const access_token = window.$cookies.get("jwt");
    let tokens = JSON.parse(atob(access_token.split(".")[1]));
    this.role = tokens.role;
        this.$axios.get('/api/students/myProfile')
        .then( response => {
            this.posts = response.data;
            if(this.posts==null){
              this.disabled = false
            }
            else {
            this.studentData = response.data;
            console.log(this.studentData);
            this.is_verified = response.data.is_verified;
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

            console.log(response.data);
            }
        })
        .catch(error =>{
            console.log(error)
        })
    },
};
</script>


