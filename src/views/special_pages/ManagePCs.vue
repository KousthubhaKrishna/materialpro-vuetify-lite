<template>
  <v-container fluid class="down-top-padding">
    <v-card class="mb-5">
      <v-card-title>
        <h3>Add/Edit Coordinator Accounts</h3>
      </v-card-title>
      <v-card-text>
        <p> Add accounts, edit details and delete accounts. </p>
        <PCAccountTable/>
      </v-card-text>
      </v-card>
  </v-container>
</template>

<script>
import PCAccountTable from "@/components/accounts/PCAccountTable.vue";

export default {
  name: "ManagePCs",
  components: {
    PCAccountTable
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
