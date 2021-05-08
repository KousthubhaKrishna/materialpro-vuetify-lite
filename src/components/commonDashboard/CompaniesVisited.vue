<template>
  <v-card
    class="mx-auto"
    max-width="1000"
    outlined
    color="gray"
    style="width:100%"
  >
    <!-- <v-row align="center" justify="center" class="pt-3">
        <h2 style="font-size:2rem;font:roboto;font-weight:300">Top  Visited Companies</h2>
    </v-row>

    <div>
      <v-row >
        <v-col v-for="(img,index) in items" :key="index" col="12" sm="2">

            <v-img
              :src="img.url"
              :alt="img.name"
            ></v-img>

        </v-col>
      </v-row>
    </div> -->


  </v-card>
</template>


<script>
  export default {
    name: "CompaniesVisited",
    data: () => ({
      model: null,
      companies: [],
      items:[
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
        { 
          name:"Oracle",
          url:'https://www.smartinterviews.in/assets/images/oracle-logo.png'
        },
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },{ 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
        { 
          name:"Microsoft",
          url:'https://www.smartinterviews.in/assets/images/microsoft.png'
        },
      ],
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

