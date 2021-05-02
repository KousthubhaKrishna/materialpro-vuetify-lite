<template>
  <v-container fluid class="down-top-padding">
    <v-row>
      <v-col>
        <h2>Add/Edit Coordinator Accounts</h2>
        <p> Add accounts, edit details and delete accounts. </p>
    <PCAccountTable/>
      </v-col>
    </v-row>
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
