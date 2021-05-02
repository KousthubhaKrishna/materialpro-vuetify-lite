<template>
<v-container>
           <v-card>
             <v-card-title>
               {{ placement.company_id.company_name }}
             </v-card-title>
               
            <v-card-text>
              {{ placement.job_type }}<br/>
              {{ placement.package }}<br/>
              {{ placement.drive_details }}<br/>
              {{ placement.placement_batch }}<br/>
              {{ placement.posted_date }}<br/>

              <br/>
              <br/>

              <h3> Eligibility Criteria</h3><br/>
              {{ placement.eligibility.cgpa }}<br/>
              {{ placement.eligibility.backlogs }}<br/>
              {{ placement.eligibility.branches }}<br/>
              {{ placement.job_description }}<br/>
            </v-card-text>

            <v-card-actions>
            <!-- <v-btn color="primary" v-if="snaps.length>0" @click="register">register</v-btn> -->
            <Register :snap="firstSnap"></Register>
            </v-card-actions>
            </v-card>

            <v-row>
              <v-col col="12" sm="8">
                <v-card outlined elevation="1">
                  <v-card-title>Announcements</v-card-title>
                  <v-card-text>
                    <p v-for="(ann,index) in announcements" :key="index">
                      {{ann.message}}
                      {{ ann.type }}
                      {{ann.date}}
                      <v-btn><v-icon @click="deleteMessage(ann._id)">mdi-delete</v-icon></v-btn>
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    

                     <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="500px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon 
                            v-bind="attrs"
                            v-on="on"
                            >
                            mdi-plus
                            </v-icon>
                        </template>
                        <v-card>  
                          <v-card-title>
                            <span class="headline">Announcements</span>
                          </v-card-title>
                          <v-form ref="form">
                          <v-card-text>
                            <v-container>

                              <v-alert v-if="error.length > 0" dense outlined text type="error">
                              {{ error }}
                              </v-alert>

                              <v-row>
                                
                                <v-col cols="12" class="pa-0">
                                    <v-textarea
                                      ref="description"
                                      name="input-7-1"
                                      label="Message*"
                                      v-model="announcement.message"
                                      auto-grow
                                      :rules="[value => !!value || '']"
                                      >
                                      </v-textarea>
                                  </v-col>

                                  <v-col cols="12" class="pa-0">
                                    <v-select 
                                    :items="type" 
                                    label="Type of Announcement"  
                                    :rules="[value => !!value || '']"
                                    v-model="announcement.type">
                                    </v-select>
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
                              @click="submitMessage"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      
                      </v-dialog>
                  </v-card-actions>
                </v-card>
              </v-col>


              <v-col col="12" sm="4">
                <AddDatasnapshot :first="isFirst"></AddDatasnapshot>

                <v-row v-for="(snap,index) in snaps" :key="index">
                  <v-card elevation="1" outlined @click="openSnap(snap._id)">
                  <v-card-title>{{snap.snap_name}}</v-card-title>
                  <v-card-text>{{ snap.type_of_data}}</v-card-text>
                  </v-card>
                </v-row>

              </v-col>
            </v-row>

          <DisplayDatasnapshot v-if="disable" :id="snapId"></DisplayDatasnapshot>

</v-container>
</template>

<script>
import axios from 'axios'

  export default {
    name: "DisplayPlacement",

    data: () => ({
      placement:[],
      snaps:[],
      snapId:"",
      firstSnap:"",
      announcement:{
        message:"",  
        type: "",     
      },
      type : ["Message","Pre-placement Talk","Test"],
      announcements:"",
      dialog:false,
      error:"",
      disable:false,
      isFirst: false,
    }),
    created(){
      
      axios.get('/api/placements/'+this.$route.params.id)
      .then(response=>{
          this.placement = response.data;
          this.firstSnap = this.placement.register_snap;
      })
      .catch(error =>{
          console.log(error);
      })

      this.getAnnouncements();
      
      axios.get('/api/snaps/placement_snaps/'+this.$route.params.id)
      .then(response=>{
          this.snaps = response.data;
          if(this.snaps.length==0)
          {
            this.isFirst = true;
          }

      })
      .catch(error =>{
          console.log(error);
      })

    },
     methods:{

       getAnnouncements(){
          axios.get('/api/announcements/'+this.$route.params.id)
          .then(response=>{
              this.announcements = response.data;
          })
          .catch(error =>{
              console.log(error);
          })
       },

        closeDialog(){
          this.dialog = false; 
          this.error="";
          this.$refs.form.reset();
        },

        openSnap(data){
          this.snapId = data;
          this.disable = true;
        },

        register(){
          // use select command in db

          axios.get(''+this.$route.params.id)
            .then(response =>{
              console.log(" message submittted",response.data)
                })
              .catch(error =>{
                  console.log(error)
              })

        },

        deleteMessage(data){
          axios.delete('/api/announcements/'+data)
            .then(response =>{
              console.log(" deleted succesfully",response.data)
              this.getAnnouncements();
                })
              .catch(error =>{
                  console.log(error)
              })
        },

        submitMessage(){

            let isValid = this.$refs.form.validate(true);
            if(isValid){
                this.dialog = false;
                axios.post('/api/announcements/'+this.$route.params.id, this.announcement)
                .then(response =>{
                console.log(" message submitted",response.data)
                this.$refs.form.reset();
                this.getAnnouncements();
                })
                .catch(error =>{
                    console.log(error)
                })
            }
            else{
              this.error = "Fill all the required Fields";
            } 
        }
    },
    components:{
      AddDatasnapshot: () => import('@/components/studentDashboard/placements/addDatasnapshot'),
      DisplayDatasnapshot: () => import('@/components/studentDashboard/placements/displayDatasnapshots'),
      Register: () => import('@/components/studentDashboard/placements/register'),
    }
  }
</script>

