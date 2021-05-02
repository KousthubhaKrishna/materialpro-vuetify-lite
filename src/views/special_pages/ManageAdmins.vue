<template>
  <v-container fluid class="down-top-padding">
    <v-row>
      <v-col>
        <h2>Add/Edit Admin Accounts</h2>
        <p> Add accounts, edit details and delete accounts. </p>
    <AdminAccountTable/>
      </v-col>
    </v-row>
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
