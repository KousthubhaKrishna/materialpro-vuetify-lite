<template>
  <v-row class="fill-height" align="center" justify="center">
    <v-card width="950" :loading="loading">
      <v-row>
        <v-col>
          <v-img class="pa-10" contain src="@/assets/images/back.png" width="500">
            <p class="primary--text">CBIT Placements</p>
            <h2 class="green--text darken-4">
              Go to place for placements for students
            </h2>
          </v-img>
        </v-col>
        <v-col class="pa-10" align="left">
          <h1 class="primary--text">Login</h1>
          <v-alert v-if="error.length > 0" dense outlined text type="error">
            {{ error }}
          </v-alert>
          <form class="mb-10" ref="form">
            <v-text-field
              ref="user_email"
              label="Email"
              v-model="loginProps.user_email"
              :rules="[rules.required, rules.email]"
              ></v-text-field>
            <v-text-field
              ref="password"
              v-model="loginProps.password"
              :rules="[rules.required, rules.min]"
              counter
              minLength="8"
              :append-icon="passShow ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passShow ? 'text' : 'password'"
              label="Password"
              @click:append="passShow = !passShow"
              ></v-text-field>
            <v-btn text small justify="left" @click.stop="openDialog" color="primary"> Forgot Password ? </v-btn>
            <v-btn light color="primary" large @click="validateFields">
              Login
            </v-btn>
          </form>
          <p class="caption">
            *Please contact your class or branch placement co-ordinater for
            login credentials.
          </p>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="500"
      >
      <v-card>
        <v-card-title class="headline">
          Forgot Password ?
        </v-card-title>
        <v-card-text>
         <v-alert v-if="dialogAlert.show" dense outlined text :type="dialogAlert.type">
            {{ dialogAlert.message }}
          </v-alert>
          <div v-if="!isAlertSuccess()">
        You will receive an email to reset your password.
          <v-text-field
            ref="newResetEmail"
            label="Email"
            v-model="newResetEmail"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="forgotPassword"
            >
            {{ this.dialogAlert.buttonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isPasswordReset"
      max-width="500"
      >
      <v-card>
        <v-card-title class="headline">
          Reset Password
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="newPassword"
            v-model="url_params.newPassword"
            :rules="[rules.required, rules.min]"
            counter
            minLength="8"
            :append-icon="passShow ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passShow ? 'text' : 'password'"
            label="Password"
            @click:append="passShow = !passShow"
          ></v-text-field>
          <v-text-field
            :rules="[rules.required, rules.min, rules.confirmPass]"
            counter
            minLength="8"
            :append-icon="passShow ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passShow ? 'text' : 'password'"
            label="Password"
            @click:append="passShow = !passShow"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="resetPassword"
            >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="green"
    >
      Password Reset Successful
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from "axios";
import router from '../router';

export default {
  props: ['email','token'],
  data: function() {
    return {
      passShow: false,
      loginProps: {
        user_email: "",
        password: ""
      },
      error: "",
      dialogAlert : {
        show: false,
        type: "",
        message: "",
        buttonText: "Send",
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        confirmPass: value => { return this.url_params.newPassword == value || "Passwords Not Same"; },
      },
      loading: false,
      dialog: false,
      url_params: null,
      newResetEmail: "",
      snackbar: false,
    };
  },
  created: function() {
    this.error = "";
    if (this.$route.params.email != undefined && this.$route.params.token != undefined){
        this.url_params =  {
          email: this.$route.params.email,
          token: this.$route.params.token,
          newPassword: "",
        }
        this.isPasswordReset = true;
    } else {
        this.url_params =  {
          email: "",
          token: "",
          newPassword: "",
        }
      this.isPasswordReset = false;
    }
  },
  methods: {
    validateFields() {
      let isFormValid =
        this.$refs["user_email"].validate(true) &&
        this.$refs["password"].validate(true);
      if (isFormValid) {
        this.loading = true;
        axios
          .post("/api/login/", this.loginProps)
          .then(res => {
            console.log(res);
            this.loading = false;
            this.$router.push({ name: "Dashboard" });
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
            this.error = err.response.data.message;
          });
      }
    },
    forgotPassword() {
      if(!this.isAlertSuccess()) {

        if(!this.$refs["newResetEmail"].validate(true)) {
          return;
        }
        axios
          .get("/api/forgot_password/" + this.newResetEmail)
          .then(res => {
            this.showAlertinDialogue(true);
          })
          .catch(err => {
            console.log(err);
            this.showAlertinDialogue(false);
          });
        this.showAlertinDialogue(true);
        
      } else {
        this.closeDialog();
      }
    },
    openDialog() {
      this.resetDialog();
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    resetDialog() {
      this.dialogAlert.show = false;
      this.dialogAlert.type = "";
      this.dialogAlert.message = "";
      this.dialogAlert.buttonText = "Send";
    },
    showAlertinDialogue(type) {
      if(type) {
        this.dialogAlert.type = "success";
        this.dialogAlert.message = "Email Sent";
        this.dialogAlert.buttonText = "Close";
      } else {
        this.dialogAlert.type = "error";
        this.dialogAlert.message = "Invalid Email";
        this.dialogAlert.buttonText = "Send";
      }
      this.dialogAlert.show = true;
    },
    isAlertSuccess() {
      return this.dialogAlert.type=='success';
    },
    resetPassword() {
      if(!this.$refs["newPassword"].validate(true)){
        return;
      }
      axios
        .post("/api/forgot_password_reset/", this.url_params)
        .then(res => {
          this.isPasswordReset = false;
          this.snackbar = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

