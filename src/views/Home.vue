<template>
  <div class="home">
    <Banner />
    <v-row align="center" justify="center">
      <Vision :vision="vision" :mission="mission"/>
    </v-row>
    <v-row class="my-5">
      <CompaniesVisited />
    </v-row>
    <v-row class="my-5" align="center" justify="center">
      <Footer/>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Banner from "@/components/Banner.vue";
import Vision from "@/components/commonDashboard/Vision";
import CompaniesVisited from "@/components/commonDashboard/CompaniesVisited";
import Footer from "@/layouts/footer/Footer";

export default {
  name: "Home",
  components: {
    Banner,
    Vision,
    CompaniesVisited,
    Footer
  },
  data : function() {
    return {
      vision: "To be the center of excellence in technical education and research.",
      mission: "To address the emerging needs through quality technical education and advanced research."
    }
  }
};
</script>
