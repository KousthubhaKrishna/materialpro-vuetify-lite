<template>
<v-col >
   <v-card class="ma-2">
    <v-card-title>
      {{ snap.snap_name }}
    </v-card-title>

    <v-card-text>
      {{ snap.type_of_data }}<br/>
      {{ snap.placement_batch }}<br/>
      {{ snap.last_date }}<br/>
    </v-card-text>
  </v-card>

  <div>
    <v-data-table
      :headers="dataHeaders"
      :items="data"
      class="elevation-1"

    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ snap.type_of_data }} </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
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
              <v-card-title>Are you sure you want to delete this item?</v-card-title>
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
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="reset"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>

</v-col>
</template>

<script>
import axios from 'axios'

  export default {
    name: "Displaysnap",

    props:['snapId'],

    data: () => ({
      snap:{},
      error:"",
      dialog: false,
      dialogDelete: false,
      dialogReset:false,
      dataHeaders:[],
      data:[],
      fields:[],

      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      rules:{
          required: value => !!value || " ",
          number: v => /^\d+$/.test(v)||'This field only accept numbers',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
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
      this.dataHeaders.push({ text: 'Actions', value: 'actions', sortable: false })
      this.defaultItem = this.editedItem;
    },

    reset(){
      this.dialogReset = true;
    },

    confirm(){
      this.initialize();
    },

    getSnapData(val){
       axios.get('/api/snaps/'+val)
      .then(response=>{
          this.snap = response.data;
          this.data = this.snap.data;
          this.initialize();
          console.log("snap",this.snap);
          console.log("snap data",this.data);
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
      this.data.splice(this.editedIndex, 1)
     
      axios.patch('/api/snaps/remove_data/'+this.snap._id, this.data[this.editedIndex])
      .then(response =>{
      console.log("deleted successfully",response.data);
      })
      .catch(error =>{
          console.log(error)
      })
     
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
  },

  }
</script>

