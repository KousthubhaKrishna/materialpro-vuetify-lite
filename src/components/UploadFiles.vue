<template>
  <div>
    <div v-if="$PERMISSIONS.MED.has(user.role)">
    <div v-if="currentFile">
      <div>
        <v-progress-linear
          v-model="progress"
          color="light-blue"
          height="25"
          reactive
        >
          <strong>{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <v-row no-gutters justify="center" align="center">
      <v-col cols="4">
        <v-file-input
          show-size
          label="File input"
          @change="selectFile"
        ></v-file-input>
      </v-col>

      <v-col cols="4" class="pl-2">
        <v-select 
            :items="company_names" 
            label="Company"  
            :disabled="disabled"
            :rules="generalRules"
            v-model="selected_company"
            >
        </v-select>
      </v-col>

      <v-col cols="4" class="pl-2">
        <v-btn color="success" dark small @click="upload">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="message" border="left" color="blue-grey" dark>
      {{ message }}
    </v-alert>
    </div>
    <v-container fluid class="down-top-padding" v-if="fileInfos.length > 0" >  
            <v-row>
    <DisplayFolder v-for="(file, index) in fileInfos" :key="index" :company="file"/>
            </v-row>
    </v-container>
  </div>
</template>

<script>
import UploadService from "@/components/services/UploadFilesService";
import DisplayFolder from "@/components/DisplayFolder";
export default {
  name: "upload-files",
  data() {
    return {
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
      company_names: [],
      selected_company: "General",
      user : "",
      generalRules: [
        v => !!v || 'This field is required',
      ],
    };
  },
  components: {
      DisplayFolder,
  },
  methods: {
    selectFile(file) {
      this.progress = 0;
      this.currentFile = file;
    },
    upload() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }
      this.message = "";
      UploadService.upload(this.selected_company, this.currentFile, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then((response) => {
          this.message = response.data.message;
          return UploadService.getFiles();
        })
        .then((files) => {
          this.fileInfos = files.data;
          this.selected_company = "General";
          this.currentFile = null;
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
          this.currentFile = undefined;
        });
    },
  },
  mounted() {
    const access_token = window.$cookies.get("jwt");
    let tokens = JSON.parse(atob(access_token.split(".")[1]));
    this.user = tokens;
    UploadService.getFiles().then((response) => {
      this.fileInfos = response.data;
    });
    this.$axios.get('/api/company')
      .then(response=> {
          this.companies = response.data;
          this.company_names = ["General"]
          this.companies.forEach((item) => { this.company_names.push(item.company_name)});
      })
      .catch(error =>{
          console.log(error);
      })
  },
};
</script>