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
            <v-col>
              <v-btn color="success" @click="openAddAccountDialog(null)">
                <v-icon
                  small
                  class="mr-2"
                  >
                  mdi-account-plus
                </v-icon>
                Add Account
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn @click="openAddAccountDialog(item)" color='primary' dark small>
          <v-icon
            small
            class="mr-2"
            >
            mdi-pencil
          </v-icon>
          Edit
        </v-btn>
        <v-btn @click="openDeleteAccount(item)" color='error' small>
          <v-icon
            small
            class="mr-2"
            >
            mdi-delete
          </v-icon>
          Delete 
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete <b> {{ deleteAccount.user_email }} </b> account ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteAccountOperation">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addAccountDialog"
      max-width="500"
      >
      <v-card>
        <v-card-title class="headline">
          {{ !editAccountDialog ?  "Add account" : "Edit Account" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="newAccount.user_email"
            label="Email"
            v-model="newAccount.user_email"
            :rules="[rules.required,rules.email]"
            :disabled="editAccountDialog"
          ></v-text-field>
          <v-text-field
                v-model="newAccount.roll_number"
                label="Roll number"
                :rules="[rules.required]"
                :counter="12"
                ></v-text-field>
                  <v-select 
                    :items="validBranches" 
                    label="branch"  
                    :rules="[rules.required]"
                    v-model="newAccount.branch">
                  </v-select>
                  <v-text-field
                    v-model="newAccount.section"
                    label="Section"
                    :rules="[rules.required]"
                    :counter="1"
                    ></v-text-field>
              <v-text-field
                v-model="newAccount.placement_batch"
                label="Year of passing"
                :rules="[rules.required]"
                ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addAccountDialog = false">Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addAccount"
            >
            Done
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
        newAccount: {
          user_email:"",
          branch:"",
          roll_number:"",
          placement_batch:""
        },
        addAccountDialog: false,
        editAccountDialog: false,
        dialogDelete: false,
        deleteAccount: {
          user_email: "",
        },
        fields: [
          {
            text: 'Roll Number',
            align: 'start',
            value: 'roll_number'
          },
          { text: 'Email', value: 'user_email'},
          { text: 'Branch', value: 'branch'},
          { text: 'Section', value: 'section'},
          { text: 'Placement Batch', value: 'placement_batch'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        accountsData: [],
        snackbar: {
          show : false,
          text : "",
          type : "",
        },
        filter: {
          roll_number:"",
          branch:"",
          section:"",
          placement_batch:""
        },
        validBranches:["cse", "ece", "it","civil"],
        branch: ["all","cse", "ece", "it","civil"],
        rules: {
          required: value => !!value || "Required.",
          min: v => v.length >= 8 || "Min 8 characters",
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
          },
        }
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
        var data = this.accountsData;
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
        this.filter = {
          branch: tokens.branch || "",
          section: tokens.section || "",
          placement_batch : tokens.placement_batch || "",
        }
        this.$axios.get('/api/accounts/student')
          .then( response => {
            this.accountsData = response.data;
            this.displayData = this.accountsData;
            console.log(this.displayData);
          })
          .catch(error =>{
            console.log(error)
          });
      },
      openAddAccountDialog(account) {
        this.editAccountDialog = false;
        if(account) {
          this.newAccount = account;
          this.editAccountDialog = true;
          this.addAccountDialog = true;
          return;
        }
        this.newAccount = {
          user_email:"",
          branch:"",
          roll_number:"",
          placement_batch:""
        };
        this.addAccountDialog = true;
      },
      addAccount() {
        //validate them
        if(this.editAccountDialog) {
          this.$axios.patch('/api/updateStudent', this.newAccount)
          .then( response => {
            if(response.status == 201) {
              this.snackbar.text = "Updated "+ this.newAccount.user_email + " account";
              this.snackbar.type = "success";
              this.snackbar.show = true;
              this.editAccountDialog = false;
              this.addAccountDialog = false;
              this.initialize();
            }
          })
          .catch(error => {
            this.snackbar.text = error;
            this.snackbar.type = "error";
            this.snackbar.show = true;
            console.log(error);
          });
        } else {
          this.$axios.post('/api/addStudent', this.newAccount)
          .then( response => {
            if(response.status == 201) {
              this.snackbar.text = "Added "+ this.newAccount.user_email;
              this.snackbar.type = "success";
              this.snackbar.show = true;
              this.addAccountDialog = false;
              this.initialize();
            }
          })
          .catch(error => {
            this.snackbar.text = error;
            this.snackbar.type = "error";
            this.snackbar.show = true;
            console.log(error)
          });
        }
      },
      openDeleteAccount(account) {
        this.dialogDelete = true;
        this.deleteAccount = account;
      },
      closeDelete () {
        this.dialogDelete = false;
      },
      deleteAccountOperation() {
      this.$axios.delete('/api/students/'+this.deleteAccount._id)
        .then( response => {
          if(response.status == 200) {
            this.snackbar.text = "Deleted "+this.deleteAccount.user_email;
            this.snackbar.type = "success";
            this.snackbar.show = true;
            this.dialogDelete = false;
            this.initialize();
          }
        })
        .catch(error => {
          this.snackbar.text = error;
          this.snackbar.type = "error";
          this.snackbar.show = true;
          console.log(error)
        });
      },
      rollFilter(data) {
        if (!this.filter.roll_number) {
          return data;
        }
        return data.filter((x) => x.roll_number && x.roll_number.toLowerCase().includes(this.filter.roll_number.toLowerCase()));
      },
      branchFilter(data) {
        if (!this.filter.branch || this.filter.branch == "all") {
          return data;
        }
        return data.filter((x) => x.branch && x.branch == this.filter.branch);
      },
      sectionFilter(data) {
        if (!this.filter.section) {
          return data;
        }
        return data.filter((x) => x.section && x.section == this.filter.section);
      },
      yearFilter(data) {
        if (!this.filter.placement_batch) {
          return data
        }
        return data.filter((x) => x.placement_batch && x.placement_batch == this.filter.placement_batch);
      },
    },
  }
</script>