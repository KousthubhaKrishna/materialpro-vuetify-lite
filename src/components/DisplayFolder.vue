<template>

            <v-col cols="3">
  <v-card max-width="250" outlined elevation="1">
    <v-card-actions>
      <v-icon class="mr-3" color="#3b5998"> mdi-folder </v-icon> 
      <a>{{ company.name }}</a>
      <v-spacer></v-spacer>
      <v-btn icon @click="show = !show" >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
            <v-list-item-group>
                <v-list-item v-for="(file, index) in fileInfos" :key="index">
                    <a :href="file.url" > {{ file.name }}</a>
                    <v-spacer></v-spacer>
                    <v-icon v-if="$PERMISSIONS.MED.has(user.role)" medium color="error" @click="openDelete(company.name, file.name)"> mdi-delete </v-icon>
                </v-list-item>
            </v-list-item-group>
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.type"
      >
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
      <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete <b> {{ deleteFile.name }} </b> account ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteFileOperation">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
              </v-col>
</template>

<script>
import UploadService from "@/components/services/UploadFilesService";
export default {
  name: "DisplayFolder",
  props: ['company'],
  data() {
    return {
      show: false,
      fileInfos: [],
      dialogDelete: false,
      deleteFile: {
          company: "",
          name: "",
      },
      snackbar: {
          show : false,
          text : "",
          type : "",
        },
    };
  },
  methods: {
    initialize() {
        UploadService.getFilesByCompany(this.company.name).then((response) => {
        this.fileInfos = response.data;
        });
    },
    openDelete(company, name) {
        this.deleteFile = {
            company : company,
            name: name
        }
        this.dialogDelete = true;
    },
    closeDelete () {
        this.dialogDelete = false;
    },
    deleteFileOperation() {
        console.log(this.deleteFile);
        UploadService.deleteFilesByCompany(this.deleteFile.company,this.deleteFile.name).then((response) => {
            this.initialize();
            this.snackbar = {
                show: true,
                text: "Deleted the file",
                type: "error"
            }
            this.closeDelete();
        });
    }
  },
  watch: {
    show: function (val) {
        this.initialize()
    },
  },
  mounted() {
    const access_token = window.$cookies.get("jwt");
    let tokens = JSON.parse(atob(access_token.split(".")[1]));
    this.user = tokens;
      this.initialize();
  },
};
</script>