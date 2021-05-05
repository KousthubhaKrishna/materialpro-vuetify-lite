<template>
  <v-container fluid class="down-top-padding">
    <v-card class="mb-5">
      <v-card-title>
        <h3>Add Student Accounts</h3>
      </v-card-title>
      <v-card-text>
        <p> Check the details and criticial fields thoroughly and accordingly please approve student profiles. </p>
        <ApprovalTable/>
      </v-card-text>
      </v-card>
  </v-container>
</template>

<script>
import ApprovalTable from "@/components/accounts/ApprovalTable.vue";

export default {
  name: "VerifyStudents",
  components: {
    ApprovalTable
  ,
  },
  data: () => ({
  }),
  created() {
  },
  methods : {
  }
};
</script>
