<template>
  <div>
  <v-card outline class="my-5">
    <v-row class = "pa-5">
      <v-col align="right">
        <h2 class="primary--text text--darken-1">Vision</h2>
      </v-col>
      <v-col>
        {{ vision }}
      </v-col>
    </v-row>
    <hr/>
    <v-row class = "pa-5">
      <v-col align="right">
        {{ mission }}
      </v-col>
      <v-col>
        <h2 class="primary--text text--darken-1">Mission</h2>
      </v-col>
    </v-row>
  </v-card>
  <v-card maxWidth="1000">
    <v-row align="center" justify="center">
        <v-card-title>
        <h3 class="green--text text--darken-2"> We’re talking Self-Enlightenment. </h3>
        </v-card-title>
    </v-row>
            <v-card-text>
        <p>
          Chaitanya Bharathi Institute of Technology, established in the Year 1979, esteemed as the Premier Engineering Institute in the States of Telangana and Andhra Pradesh, was promoted by a Group of Visionaries from varied Professions of Engineering, Medical, Legal and Management, with an Objective to facilitate the Best Engineering and Management Education to the Students and contribute towards meeting the need of Skilled and Technically conversant Engineers and Management Professionals, for the Country that embarked on an Economic Growth Plan.
        </p>
        </v-card-text>
    </v-card>
  </div>
</template>


<script>
  export default {
    name: "Vision",
    props: ["vision","mission"],
    data: () => ({
    }),
   
  };
</script>

