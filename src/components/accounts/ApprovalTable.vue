<template>
  <div>
    <v-data-table
      :headers="fields"
      :items="displayData"
      class="elevation-1"
      >
      <template v-slot:top>
        <v-toolbar
          flat
          >
          <v-row>
            <v-col align-self="center">
              <h5>
                <v-icon
                  class="mr-2"
                  color="primary">
                  mdi-filter
                </v-icon>
                Filters Contents 
              </h5>
            </v-col>
            <v-col>
              <v-text-field
                v-model="filter.full_name"
                label="Full Name"
                ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="filter.roll_number"
                label="Roll number"
                ></v-text-field>
            </v-col>
            <v-col>
              <v-select 
                :items="branch" 
                label="Branch"
                v-model="filter.branch">
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="filter.section"
                label="Section"
                :counter="1"
                ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="filter.placement_batch"
                label="Year of passing"
                ></v-text-field>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn @click="viewProfile(item)" color='primary' small>
          <v-icon
            small
            class="mr-2"
            >
            mdi-eye
          </v-icon>
          View 
        </v-btn>
        <v-btn @click="approveStudent(item)" color='success' small>
          <v-icon
            small
            class="mr-2"
            >
            mdi-thumb-up
          </v-icon>
          Approve 
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="viewDialog"
      max-width="400"
      >
      <v-card v-if="studentProfile">
        <v-card-title class="headline">
        {{ studentProfile.basic_info.full_name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
            <img
                :src="studentProfile.photo_url || 'https://randomuser.me/api/portraits/men/81.jpg'"
                alt="user"
                width="75px"
                class="img-fluid rounded-circle shadow-sm"
                />
            </v-col> 
            <v-col cols="7">
            <p v-for="(value, key) in studentProfile.basic_info" :key="key"> {{ key }} : {{ value }} </p>
            </v-col>

          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="viewDialog = false"
            >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.type"
      >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        viewDialog: false,
        studentProfile: null,
        fields: [
          {
            text: 'Full Name',
            align: 'start',
            value: 'basic_info.full_name'
          },
          { text: 'Roll Number', value: 'basic_info.roll_number'},
          { text: 'CGPA', value: 'education.cgpa' },
          { text: 'Primary Email', value: 'contact_info.primary_email'},
          { text: 'Mobile Number', value: 'contact_info.mobile'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        studentsData: [],
        snackbar: {
          show : false,
          text : "",
          type : "",
        },
        filter: {
          full_name:"",
          roll_number:"",
          branch:""
        },
        branch: ["all","cse", "ece", "it","civil"]
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    computed: {
      displayData: function() {
        var data = this.studentsData;
        data = this.nameFilter(data);
        data = this.rollFilter(data);
        data = this.branchFilter(data);
        data = this.sectionFilter(data);
        data = this.yearFilter(data);
        return data;
      }
    },

    methods: {
      initialize () {
        const access_token = window.$cookies.get("jwt");
        let tokens = JSON.parse(atob(access_token.split(".")[1]));
        this.role = tokens.role;
        this.$axios.get('/api/students/')
          .then( response => {
            this.studentsData = response.data.filter((x) => x.is_verified == false);
            this.displayData = this.studentsData;
          })
          .catch(error =>{
            console.log(error)
          });
      },
      approveStudent(student) {
      this.$axios.patch('/api/students/verifyStudents/'+student._id)
        .then( response => {
          if(response.status == 200) {
            this.snackbar.text = "Approved "+student.basic_info.full_name;
            this.snackbar.type = "success";
            this.snackbar.show = true;
            this.initialize();
          }
        })
        .catch(error =>{
          this.snackbar.text = error;
          this.snackbar.type = "error";
          this.snackbar.show = true;
          console.log(error)
        });
      },
      viewProfile(student) {
        this.studentProfile = student;
        console.log(student)
        this.viewDialog = true;
      },
      nameFilter(data) {
        if (!this.filter.full_name) {
          return data;
        }
        return data.filter((x) => x.basic_info.full_name.toLowerCase().includes(this.filter.full_name.toLowerCase()));
      },
      rollFilter(data) {
        if (!this.filter.roll_number) {
          return data;
        }
        return data.filter((x) => x.basic_info.roll_number.toLowerCase().includes(this.filter.roll_number.toLowerCase()));
      },
      branchFilter(data) {
        if (!this.filter.branch || this.filter.branch == "all") {
          return data;
        }
        console.log(this.filter.branch);
        console.log(data.filter((x) => x.basic_info.branch == this.filter.branch));
        return data.filter((x) => x.basic_info.branch == this.filter.branch);
      },
      sectionFilter(data) {
        if (!this.filter.section) {
          return data;
        }
        return data.filter((x) => x.basic_info.section == this.filter.section);
      },
      yearFilter(data) {
        if (!this.filter.placement_batch) {
          return data
        }
        return data.filter((x) => x.basic_info.placement_batch == this.filter.placement_batch);
      },
    },
  }
</script>