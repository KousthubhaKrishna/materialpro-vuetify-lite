<template>
  <v-container fluid class="down-top-padding">
    <v-row>
      <v-col>
        <h2>Add Student Accounts</h2>
        <p> Check the details and criticial fields thoroughly and accordingly please approve student profiles. </p>
    <ApprovalTable/>
      </v-col>
    </v-row>
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
