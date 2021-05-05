<template>
  <v-container fluid class="down-top-padding">
    <v-card class="mb-5">
    <v-card-title>
      <h3>E-Resources</h3>
    </v-card-title>
    <v-card-text>
      <p> View all the placement related files at one place </p>
      <upload-files></upload-files>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
import UploadFiles from "@/components/UploadFiles";
export default {
  name: "App",
  components: {
    UploadFiles,
  },
};
</script>