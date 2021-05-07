<template>
  <v-container fluid class="down-top-padding">
    <h2> Interview Experiences </h2>
    <p> View, Add Interview Experiences. </p>
    
    <v-card class="mb-5">
     <v-card-actions>
        <v-row>
          <v-col align-self="center">
            <h3 class=" font-weight-medium">
              <v-icon
                class="mx-2"
                color="primary">
                mdi-filter
              </v-icon>
              Filters 
            </h3>
          </v-col>
          <v-col>
            <v-text-field
              label="Company"
              v-model="filter.company_name"
              ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Year of passing"
              v-model="filter.placement_batch"
              ></v-text-field>
          </v-col>
          <v-col align-self="center">
          <v-btn color="primary" @click="filterData" > <v-icon> mdi-magnify </v-icon> </v-btn>
          </v-col>
          <v-col align-self="center">
            <v-btn :color="this.editor.toggleColor" @click="toggleEditor" >
              <v-icon
                small
                class="mr-2"
                >
                {{ this.editor.toggleIcon || "mdi-note-plus" }}
              </v-icon>
              {{ this.editor.toggleText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <v-card v-if="editor.show" class="mb-5">
      <v-alert prominent dismissable text color="success">
        <h3 class="black--text"> Mardown Editor </h3>
        <a href="https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf"> Guide for markdown </a>
        <v-row>
            <v-col>
            <v-text-field
            label="Title"
            outlined
            v-model="expData.title"
          ></v-text-field>
            </v-col>
            <v-col>
            <v-text-field
            label="Company"
            outlined
            v-model="expData.company_name"
          ></v-text-field>
            </v-col>
        </v-row>
        <Editor
          mode="preview"
          ref="editor"
          hint="Hint"
          :outline="true"
          :render-config="renderConfig"
          v-model="expData.content"
          />
        <v-card-actions>
          <v-btn color="secondary" @click="resetEditor"> Reset </v-btn>
          <v-btn color="success" @click="submitData"> Add </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-alert>
    </v-card>


    <v-card v-for="item in displayData" :key="item.company_name" class="mb-2" tile outlined>
        <v-card-title>
        <v-row>
            <v-col @click="displayExpDialog(item)">
                {{ item.title }}
            </v-col>
            <v-col align="right">
                <v-btn v-if="(item.created_by && item.created_by._id == user._id)" color="primary" @click="editItem(item)"> <v-icon small> mdi-pencil </v-icon> </v-btn>
                <v-btn v-if="(item.created_by && $PERMISSIONS.MED.has(user.role)) || (item.created_by && item.created_by._id == user._id)" @click="openDeleteDialog(item)" color="error" > <v-icon small> mdi-delete </v-icon> </v-btn>
            </v-col>
        </v-row>
        </v-card-title>
        <v-card-subtitle>
            <h4 class="green--text"> {{ item.company_name }} </h4>
            <p> {{ new Date(item.date).toString().slice(4,25) }} </p>
        </v-card-subtitle>
        <v-card-text @click="displayExpDialog(item)">
            <p> {{ item.content.slice(0,500) }} </p>
        </v-card-text>
    </v-card>
    <v-dialog v-model="displayDialog" max-width="700px">
      <v-card v-if="displayExp">
        <v-card-title class="headline"> {{ displayExp.title || "" }} </v-card-title>
        <v-card-text>
          <h4> {{ displayExp.company_name || "" }} </h4>
          <p> {{ new Date(displayExp.date).toString().slice(4,25) || "" }} </p>
          <p> {{ displayExp.created_by }} </p>
          <Editor
            mode="viewer"
            :outline="true"
            :render-config="renderConfig"
            :value="displayExp.content || ''"
            />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="displayDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card v-if="displayExp">
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete <b> {{ displayExp.title }} </b> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteExperience()">OK</v-btn>
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
  </v-container>
</template>

<script>
import { Editor } from "vuetify-markdown-editor";
export default {
  name: "InterviewExperience",
  components: {
    Editor
  },
  mounted() {
      this.initialize();
  },
  data () {
      return {
        displayData: null,
        fetchedData: null,
        displayDialog : false,
        displayExp: null,
        dialogDelete: false,
        editor: {
            show : false,
            toggleColor: "success",
            toggleText: "Add Experience",
            toogleIcon: "mdi-note-plus"
        },
        editMode: false,
        expData: {
            title: "",
            content: "**Write your experience here** ",
            company_name: "",
        },
        renderConfig: {
            // Mermaid config
            mermaid: {
            theme: "dark"
            }
        },
        snackbar: {
          show : false,
          text : "",
          type : "",
        },
        filter: {
          company_name:"",
          placement_batch:""
        },
      }
  },
  methods: {
      initialize() {
        const access_token = window.$cookies.get("jwt");
        let tokens = JSON.parse(atob(access_token.split(".")[1]));
        this.user = tokens;
        this.$axios.get('/api/interviewExperiences/')
            .then(res => {
                this.fetchedData = res.data;
                this.displayData = this.fetchedData;
            })
            .catch(err => {
                console.log(err);
            })
      },
      toggleEditor() {
          this.editor.toggleColor = !this.editor.show ? "error" : "success";
          this.editor.toggleText = !this.editor.show ? "Close" : "Add Experience";
          this.editor.toggleIcon = this.editor.show ? "mdi-note-plus" : "mdi-close";
          this.editor.show = !this.editor.show;
          this.editMode = false;
          this.resetEditor();
      },
      resetEditor() {
          this.expData.content = "**Write your experience here**";
          this.expData.title = "";
          this.expData.company_name = "";
      },
      editItem(item) {
        this.toggleEditor();
        this.expData = { ...item };
        this.editMode = true;
      },
      submitData() {
        if(this.editMode) {
          this.editExperience()
        } else {
          this.addExperience();
        }
      },
      addExperience() {
          this.$axios.post('/api/interviewExperiences/', this.expData)
          .then(res => {
              if(res.status == 201) {
                  this.snackbar = {
                      show: true,
                      text: "Added Successfully",
                      type: "success"
                  }
                  this.toggleEditor();
                  this.initialize();
              } else {
                  this.snackbar = {
                      show: true,
                      text: "Error",
                      type: "error"
                  }
              }
          })
          .catch(err => {
            this.snackbar = {
                show: true,
                text: err.message,
                type: "error"
            }
          });
      },
      editExperience() {
        this.$axios.patch('/api/interviewExperiences/'+this.expData._id, this.expData)
          .then(res => {
              if(res.status == 200) {
                  this.snackbar = {
                      show: true,
                      text: "Edited Sucessfully",
                      type: "success"
                  }
                  this.toggleEditor();
                  this.initialize();
              } else {
                  this.snackbar = {
                      show: true,
                      text: "Error",
                      type: "error"
                  }
              }
          })
          .catch(err => {
            this.snackbar = {
                show: true,
                text: err.message,
                type: "error"
            }
          });
      },
      displayExpDialog(item) {
        this.displayExp = item;
        this.displayDialog = true;
      },
      openDeleteDialog(item) {
        this.displayExp = item;
        this.dialogDelete = true;
      },
      deleteExperience() {
        var item = this.displayExp;
        console.log(this.user);
        var url = '/api/interviewExperiences/';
        if(item.created_by) {
          url = item.created_by._id != this.user._id ? url : '/api/interviewExperiences/deleteMyExp/';
        }
          this.$axios.delete(url+item._id)
          .then(res => {
              if(res.status == 200) {
                  this.initialize();
                  this.snackbar = {
                      show: true,
                      text: "Deleted",
                      type: "secondary"
                  }
              } else {
                  this.snackbar = {
                      show: true,
                      text: "Error",
                      type: "error"
                  }
              }
              this.dialogDelete = false;
              this.initialize();
          })
          .catch(err => {
            this.snackbar = {
                show: true,
                text: err.message,
                type: "error"
            }
          });
      },
      filterData() {
          var data = this.fetchedData;
          data = this.companyFilter(data);
          data = this.yearFilter(data);
          this.displayData = data;
      },
      companyFilter(data) {
        if (!this.filter.company_name) {
          return data;
        }
        return data.filter((x) => x.company_name && x.company_name.toLowerCase().includes(this.filter.company_name.toLowerCase()));
      },
      yearFilter(data) {
        if (!this.filter.placement_batch) {
          return data;
        }
        return data.filter((x) => x.date && new Date(x.date).getFullYear().toString().toLowerCase().includes(this.filter.placement_batch.toLowerCase()));
      },
  },
};
</script>

