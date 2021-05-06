<template>
<v-container>
           <v-card>
             <v-card-title>
               {{ placement.company_id.company_name }}
             </v-card-title>

             <EditPlacement :placement = "placement" v-if="$PERMISSIONS.MED.has(user.role)"></EditPlacement>
             <v-btn
              color="red"
              depressed
              @click="deleteItem(0,'placement')"
              v-if="$PERMISSIONS.MED.has(user.role)"
            >
              <v-icon left>
                mdi-delete
              </v-icon>
              Delete
            </v-btn>
            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title>Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
               
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
              <p v-if="isRegistered"> Already Registered for this Placement </p>
              <div  v-if="($ROLES.STUDENT == user.role || user.role == $ROLES.PC) && !isRegistered">
              <Register></Register>
              <Counter :lastDate="lastDate" @timerOut="timerOut"></Counter>
              </div>
            </v-card-actions>
            </v-card>

            <v-row>
              <v-col col="12">
                <v-card outlined elevation="1">
                  <v-card-title>Announcements</v-card-title>
                  <v-card-text>
                    <p v-for="(ann,index) in announcements" :key="index">
                    {{ann.title}}
                      {{ann.message}}
                      {{ann.type}}
                      {{ann.date}}
                      <v-btn v-if="$PERMISSIONS.MED.has(user.role)"><v-icon @click="deleteItem(ann._id,'announcement')">mdi-delete</v-icon></v-btn>
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    

                     <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="500px" 
                        v-if="$PERMISSIONS.MED.has(user.role)"
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
                                <v-col
                                cols="12"
                                sm="5"
                                class="pa-1"
                              >
                                <v-text-field

                                  label="Title*"
                                  v-model="announcement.title"
                                  :rules="[value => !!value || '']"
                                ></v-text-field>
                              </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-textarea
                                      ref="description"
                                      name="input-7-1"
                                      label="Message"
                                      v-model="announcement.message"
                                      auto-grow
                                      :rules="[value => !!value || '']"
                                      >
                                      </v-textarea>
                                  </v-col>

                                  <v-col cols="12" class="pa-0">
                                    <v-select 
                                    :items="type" 
                                    label="Type of Announcement*"  
                                    :rules="[value => !!value || '']"
                                    v-model="announcement.type">
                                    </v-select>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
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
                                          v-model="announcement.date"
                                          label="Date of event"
                                          readonly
                                          v-bind="attrs"
                                          v-on="on"
                                        ></v-text-field>
                                      </template>
                                      <v-date-picker
                                        ref="picker"
                                        v-model="announcement.date"
                                        @change="save"
                                      ></v-date-picker>
                                    </v-menu>
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


              <v-col col="12"  v-if="$PERMISSIONS.MED.has(user.role)">
                <AddDatasnapshot :first="isFirst"></AddDatasnapshot>

                <v-row v-for="snap in snaps" :key="snap._id">
                  <v-card elevation="1" outlined @click="openSnap(snap._id)">
                    <v-card-title>{{snap.snap_name}}</v-card-title>
                    <v-card-text>{{ snap.type_of_data}}</v-card-text>
                    <v-btn >
                      <v-icon @click="deleteItem(snap._id,'snap')">mdi-delete</v-icon>
                    </v-btn> 
                  </v-card>
                </v-row>

                <v-row v-for="snap in snaps" :key="snap._id">
                  <DisplayDatasnapshot v-if="disable == snap._id" :snapId="snapId" ></DisplayDatasnapshot>
                </v-row>

              </v-col>
            </v-row>      

</v-container>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/event-bus.js'

  export default {
    name: "DisplayPlacement",

    data: () => ({
       placement:{
          job_type:"",
          job_description:"",
          package:"",
          drive_details:"",
          placement_batch:"",
          posted_date:"",
          eligibility:{
          cgpa:"",
          backlogs:"",
          branches:[],
          },
      },
      company_id:"",
      snaps:{},
      snapId:"",
      announcement:{
        title:"",
        message:"",
        date:"",  
        type: "",
      },
      type : ["Message","Meeting","Pre-placement Talk","Test"],
      announcements:"",
      dialog:false,
      dialogDelete: false,
      annData: "",
      menu: false,
      error:"",
      disable:false,
      isFirst: false,
      user: "",
      snap:{},
      model:"",
      lastDate:Date,
      isRegistered: false,
    }),

      watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created(){

      const access_token = window.$cookies.get("jwt");
      let tokens = JSON.parse(atob(access_token.split(".")[1]));
      this.user = tokens;
        
      this.getplacementData();
      this.getAnnouncements();
      this.getSnapData();

      if(this.$PERMISSIONS.MED.has(this.user.role)){
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
      }

    },
    mounted(){
      EventBus.$on('placement', (value) => {
          this.placement = value 
        });
      EventBus.$on('snaps', (value) => {
        console.log(value);
          this.snaps.push(value);
        });
    },
     methods:{
       
       timerOut(){
         this.isRegistered = true;
       },

      isAlreadyRegistered(){
          // console.log(this.snapData.data['user_email'].has(this.user.user_email))
        for (let index = 0; index < this.snap.data.length; index++) {
          if(this.snap.data[index]['user_email'] == this.user.user_email){
            this.isRegistered = true;
            break;
          }
        }
      },

       getSnapData(){
          axios.get('/api/snaps/snap_data/'+this.$route.params.id)
          .then(response=>{
              this.snap = response.data;
              this.lastDate = this.snap.last_date; 
              this.isAlreadyRegistered();              
          })
          .catch(error =>{
              console.log(error);
          })
       },

      save (date) {
        this.$refs.menu.save(date)
      },

      getplacementData(){
        axios.get('/api/placements/'+this.$route.params.id)
        .then(response=>{
            this.placement = response.data;
            this.company_id = response.data.company_id;
            this.firstSnap = this.placement.register_snap;
            console.log("placement",this.placement);
            this.firstSnap = this.placement.register_snap;

        })
        .catch(error =>{
            console.log(error);
        })
      },

      closeDelete () {
      this.dialogDelete = false     
    },

       getAnnouncements(){
          axios.get('/api/announcements/'+this.$route.params.id)
          .then(response=>{
              this.announcements = response.data;
              console.log(this.announcements)
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
          this.disable = data;
        },

        deleteItem(data, val){
          this.dialogDelete = true;
          this.annData = data;
          this.model = val;
        },

        deleteItemConfirm(){
          if(this.model == 'placement'){
          console.log(this.company_id)
          axios.delete('/api/placements/'+this.$route.params.id)
            .then(response =>{
              console.log(" deleted succesfully",response.data)
              console.log(this.company_id._id)
              this.$router.push({
                name: 'CompanyDetails',
                params: { id: this.company_id._id }
            });
                })
              .catch(error =>{
                  console.log(error)
              })
          }
          else if(this.model == 'announcement'){
            this.deleteMessage(this.annData);
          }
          else if(this.model == 'snap'){
            this.deleteSnap(this.annData);
          }
          this.closeDelete();
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

        deleteSnap(data){
          axios.delete('/api/snaps/'+data)
            .then(response =>{
              console.log(" deleted succesfully",response.data);
              this.$delete(this.snaps,);
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
        },
    },
    components:{
      AddDatasnapshot: () => import('@/components/studentDashboard/placements/addDatasnapshot'),
      DisplayDatasnapshot: () => import('@/components/studentDashboard/placements/displayDatasnapshots'),
      Register: () => import('@/components/studentDashboard/placements/register'),
      Counter: () => import('@/components/studentDashboard/placements/counter'),
      EditPlacement: () => import('@/components/studentDashboard/placements/editPlacements'),
    }
  }
</script>

