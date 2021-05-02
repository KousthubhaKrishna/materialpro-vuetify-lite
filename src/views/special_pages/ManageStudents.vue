<template>
  <v-container fluid class="down-top-padding">
    <v-row>
      <v-col>
        <h2>Add/Edit Student Accounts</h2>
        <p> Add accounts, edit details and delete accounts. </p>
    <StudentAccountTable/>
      </v-col>
    </v-row>
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
