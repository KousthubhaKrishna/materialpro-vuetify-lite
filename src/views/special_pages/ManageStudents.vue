<template>
  <v-container fluid class="down-top-padding">
    <v-card class="mb-5">
      <v-card-title>
        <h3>Add/Edit Student Accounts</h3>
      </v-card-title>
      <v-card-text>
        <p> Add accounts, edit details and delete accounts. </p>
        <StudentAccountTable/>
      </v-card-text>
      </v-card>
  </v-container>
</template>

<script>
import StudentAccountTable from "@/components/accounts/StudentAccountTable.vue";

export default {
  name: "ManageStudents",
  components: {
    StudentAccountTable
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
