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
          Add DataSnapshot
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">DataSnapshot</span>
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
                  label="Snap Name*"
                  v-model="snapData.snap_name"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="Type of Data*"
                  v-model="snapData.type_of_data"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Placement batch*"
                  v-model="snapData.placement_batch"
                  :rules="[rules.required,rules.number]"
                ></v-text-field>
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
                      v-model="snapData.last_date"
                      label="Last Date*"
                      ref="last_date"
                      readonly
                      :rules="[rules.required]" 
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="snapData.last_date"
                    @change="save"
                  ></v-date-picker>
                </v-menu>
              </v-col>

               <v-col
                cols="12"
              >
                <v-autocomplete
                  :items="items"
                  label="Fields*"
                  v-model="fields"
                  multiple
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>

              
              <v-col cols="12">
                <p>
                  {{enteredFields}}
                </p>

                <v-text-field
                  label="Extra Fields"
                  v-model="extra_field"
                  @keypress.enter="enter"
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
            @click="addDatasnapshot"
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
import { EventBus } from '@/event-bus.js'

  export default {
    name: "addSnapshot",
    props:['first'],
   
   data: () => ({
      dialog: false,
      menu: false,
      items: ["First Name","Last Name","Full Name","Roll Number","Branch","Section","Placement Batch",
              "Primary Email","Secondary Email","Mobile","Secondary Mobile","CGPA","Backlogs","College",
              "Inter Percent","School","School percent","Eamcet Rank","Jee Mains Rank",
              "Parent Name","Address","City","State","Zipcode","Gender","Date of Birth","Photo Url","Resume Url"],
      snapData:{
          snap_name : "",
          type_of_data:"",
          fields:[],
          placement_batch:"",
          extra_fields:[],
          last_date:"",
          isFirst:"",
      },
      set:{},
      fields:[],
      extra_fields:[],
      extra_field: null,
      entered:[],
      error:"",
      rules:{
          required: value => !!value || " ",
          number: v => /^\d+$/.test(v)||'This field only accept numbers',
      },
    }),

    computed:{
      enteredFields(){
        return this.entered.concat(this.extra_field||[]);
      }
    },

    created(){
      this.initialize();
    },

    methods:{

      initialize(){
        this.items.forEach(element => {
          this.set[element] = this.getField(element);
        });
      },

      getField(data){
          data = data.replace(/ /g,'_').toLowerCase();
          return data;
      },


      enter(){
        this.extra_fields.push(this.getField(this.extra_field));
        this.entered.push(this.extra_field);
        this.extra_field = '';
        console.log(this.extra_fields)
      },

        save (date) {
        this.$refs.menu.save(date)
        console.log(this.snapData.last_date);
      },

        closeDialog(){
          this.dialog = false; 
          this.error="";
          this.$refs.form.reset();
        },


        addDatasnapshot(){
            let isValid = this.$refs.form.validate(true);
            console.log(isValid);
            if(isValid){
                this.dialog = false;
                // this.snapData.last_date = this.$refs.last_date.toISOString();
                this.snapData.isFirst = this.first;
                this.fields.forEach(element => {
                  this.snapData.fields.push(this.set[element]);
                });
                console.log(this.snapData.fields);
                this.snapData.extra_fields = this.extra_fields;
                axios.post('/api/snaps/'+this.$route.params.id, this.snapData)
                .then(response =>{
                console.log("form submission",response.data);
                EventBus.$emit('snaps', response.data);
                
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