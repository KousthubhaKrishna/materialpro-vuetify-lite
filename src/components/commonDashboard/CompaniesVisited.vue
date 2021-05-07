<template>
  <v-sheet
    class="mx-auto"
    max-width="1000"
  >
    <v-row align="center" justify="center" class="pt-3">
        <h2 class="indigo--text text--darken-1"> Companies Visited </h2>
    </v-row>
    <v-slide-group
      v-model="model"
      class="pb-3"
      center-active
      show-arrows
    >
      <v-slide-item
        v-for="(company,index) in companies"
        :key="index"
        v-slot="{ active, toggle }"
      >
        <v-card
          :color="active ? 'primary' : 'grey lighten-1'"
          class="ma-4"
          height="100"
          width="150"
          @click="toggle"
        >
            <v-img
                height="100"
                width="150"
                :src="company.photo_url"
                />
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-scale-transition>
            </v-scale-transition>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>


<script>
  export default {
    name: "CompaniesVisited",
    data: () => ({
      model: null,
      companies: [],
    }),
    created() {
        this.getCompanies();
    },
    methods: {
        getCompanies() {
            this.$axios.get('/api/company')
            .then(response=> {
                this.companies = response.data;
            })
            .catch(error =>{
            console.log(error);
        })
      }
    }
  };
</script>

