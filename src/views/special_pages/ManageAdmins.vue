<template>
  <v-container fluid class="down-top-padding">
    <v-card class="mb-5">
      <v-card-title>
        <h3>Add/Edit Admin Accounts</h3>
      </v-card-title>
      <v-card-text>
        <p> Add accounts, edit details and delete accounts. </p>
        <AdminAccountTable/>
      </v-card-text>
      </v-card>
  </v-container>
</template>

<script>
import AdminAccountTable from "@/components/accounts/AdminAccountTable.vue";

export default {
  name: "ManageAdmins",
  components: {
    AdminAccountTable
  },
  data: () => ({
  }),
  created() {
  },
  methods : {
  }
};
</script>
