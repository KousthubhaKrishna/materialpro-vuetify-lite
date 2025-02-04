<template>
<v-col col="12">
  
    <v-data-table
      v-model= "selected"
      @input="enterSelect()"
      :headers="dataHeaders"
      :items="data"
      item-key="roll_number"
      show-select
      class="elevation-1"

    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title class="font-weight-medium">{{ snap.snap_name }} </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-row align="left">
            <v-col cols="12" class="pt-1 pb-0">
              <v-toolbar-title style="font-size:1rem;" class="blue--text">{{ snap.type_of_data }}</v-toolbar-title>
            </v-col >
            <v-col cols="12" class="pt-1 pb-0">
              <v-toolbar-title style="font-size:.7rem;">{{ getDate(snap.last_date) }}</v-toolbar-title>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-form ref="form">
              <v-card-text>
                <v-container>
                  <v-row>

                    <v-col cols="12" v-for="(field,index) in fields" :key="index">
                      <v-text-field
                      v-if="field == 'backlogs'"
                        v-model="editedItem[field]"
                        :label="field"
                        type = "number"
                      ></v-text-field>
                      <v-text-field
                      v-else
                      v-model="editedItem[field]"
                      :label="field"
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
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title>Are you sure you want to delete the snap?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    
    </v-data-table>
    <div class="text-right ma-4 pt-5">
      <AddDatasnapshot :first="isFirst" class="d-inline pr-4"></AddDatasnapshot>
    <v-btn color="green" class="d-inline pr-4" v-if="!isPlacedSnap && !isPlaced"  @click="createPlacedData">create placed students snap</v-btn>
    </div>


</v-col>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/event-bus.js'

  export default {
    name: "Displaysnap",

    props:['snapId', 'isPlaced'],

    data: () => ({
      snap:{},
      newSnap:{},
      newSnapData:"",
      error:"",
      dialog: false,
      dialogDelete: false,
      dialogReset:false,
      dataHeaders:[],
      data:[],
      fields:[],
      selected:[],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      isPlacedSnap: false,
      first:false,
      placement:{},
      rules:{
          required: value => !!value || " ",
          number: v => /^\d+$/.test(v)||'This field only accept numbers',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },

      isPlacedSnap(){
        return this.snap.type_of_data == "Placed Students" ? true : false;
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

    created(){
      this.getSnapData(this.snapId);
      EventBus.$on('snaps', (value) => {
        console.log(value);
          this.addData(value);
        });
    },

    methods: {

    initialize () {
      this.dataHeaders = [];
      this.snap.fields.forEach(element => {
        this.dataHeaders.push({text: element,value: element,})
        this.editedItem[element]=""
        this.fields.push(element);
      });
      this.snap.extra_fields.forEach(element => {
        this.dataHeaders.push({text: element,value: element,})
        this.editedItem[element]=""
        this.fields.push(element);
      });
      this.editedItem['user_email']=""
      this.editedItem['student_Id']=""
      this.dataHeaders.push({ text: 'Actions', value: 'actions', sortable: false })
      this.defaultItem = this.editedItem;

    },

    reset(){
      this.dialogReset = true;
    },

    confirm(){
      this.initialize();
    },

    getDate(dateString) {
      return new Date(dateString).toString().slice(4, 15);
    },

    getSnapData(val){
       axios.get('/api/snaps/'+val)
      .then(response=>{
          this.snap = response.data;
          if(this.snap.type_of_data == "Placed Students")
          {
            this.isPlacedSnap = true;
          }
          this.newSnap = response.data;
          this.data = this.snap.data;
          this.initialize();
      })
      .catch(error =>{
          console.log(error);
      })

    },

    editItem (item) {
      this.editedIndex = this.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      console.log("delete");
     
      axios.patch('/api/snaps/remove_data/'+this.snap._id, this.data[this.editedIndex])
      .then(response =>{
      console.log("deleted successfully",response.data);
      })
      .catch(error =>{
          console.log(error)
      })
      this.data.splice(this.editedIndex, 1)
     
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem)
        let isValid = this.$refs.form.validate(true);
          if(isValid){
            // this.dialog=false;
              axios.patch('/api/snaps/update_data/'+this.snap._id, this.editedItem)
              .then(response =>{
              console.log("updated successfully",response.data);
              })
              .catch(error =>{
                  console.log(error)
              })
  
            }
            else{
              this.error = "Fill all the required Fields";
            } 

      } else {
        let isValid = this.$refs.form.validate(true);
          if(isValid){
            // this.dialog=false;
              this.editedItem['user_email'] = " "; 
              this.editedItem['student_Id'] = " ";
              axios.patch('/api/snaps/add_data/'+this.snap._id, this.editedItem)
              .then(response =>{
              console.log("registered successfully",response.data);
              this.data.push(this.editedItem)
              })
              .catch(error =>{
                  console.log(error)
              })
  
            }
            else{
              this.error = "Fill all the required Fields";
            } 
      }
      this.close()
    },

    addData(data){
          axios.patch('/api/snaps/add_snap/'+data._id, this.newSnapData)
          .then(response =>{

          })
          .catch(error =>{
          console.log(error)
          })
      },

    createPlacedData(){
      let newSnap = this.newSnap;
      newSnap.type_of_data = "Placed Students";
      newSnap.snap_name = "placed_Students_list";
      newSnap['isFirst'] = false;
            
      axios.post('/api/snaps/'+this.$route.params.id, newSnap)
      .then(response =>{

          this.placement['placed_students_snap'] = response.data._id

          EventBus.$emit('placed_snap', response.data);

          axios.patch('/api/snaps/add_snap/'+response.data._id, this.newSnapData)
          .then(res =>{

              this.isPlacedSnap = true;

              axios.patch('/api/placements/'+this.$route.params.id,  this.placement)
              .then(resp =>{
              })
              .catch(error =>{
              console.log(error)
              })
          })
          .catch(error =>{
          console.log(error)
          })
                
      })
      .catch(error =>{
          console.log(error)
      })
      console.log(this.selected);
    },

    enterSelect(){
      this.newSnapData = this.selected.map(e => e);
    }

  },
   components:{
      AddDatasnapshot: () => import('@/components/studentDashboard/placements/addDatasnapshot'),
    }

  }
</script>

