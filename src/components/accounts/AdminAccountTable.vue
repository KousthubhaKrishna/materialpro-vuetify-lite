<template>
  <div>
    <v-data-table
      :headers="fields"
      :items="displayData"
      class="elevation-4"
      >
      <template v-slot:top>
        <v-toolbar
          flat
          >
          <v-row>
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
          Add account
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="newAccount.user_email"
            label="Email"
            v-model="newAccount.user_email"
            :rules="[rules.required,rules.email]"
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
        },
        addAccountDialog: false,
        passShow: false,
        dialogDelete: false,
        deleteAccount: {
          user_email: "",
        },
        fields: [
          { text: 'Email', value: 'user_email'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        accountsData: [],
        snackbar: {
          show : false,
          text : "",
          type : "",
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
        return data;
      }
    },

    methods: {
      initialize () {
        const access_token = window.$cookies.get("jwt");
        let tokens = JSON.parse(atob(access_token.split(".")[1]));
        this.role = tokens.role;
        this.$axios.get('/api/accounts/admin')
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
        this.newAccount = {
          user_email:"",
        };
        this.addAccountDialog = true;
      },
      addAccount() {
        //validate them
          this.$axios.post('/api/addAdmin', this.newAccount)
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
      },
      openDeleteAccount(account) {
        this.dialogDelete = true;
        this.deleteAccount = account;
      },
      closeDelete () {
        this.dialogDelete = false;
      },
      deleteAccountOperation() {
      this.$axios.delete('/api/deleteAdmin/'+this.deleteAccount._id)
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
    },
  }
</script>