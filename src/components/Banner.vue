<template>
  <div>
    <v-carousel
      cycle
      height="400"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item v-for="(image, index) in backgroundImages" :key="index">
        <v-img
          contain
          :src="getImgUrl(image)"
          gradient="to bottom, rgba(2,44,2,0.9) 34%, rgba(5,66,4,0.9) 78%"
          width="3000"
          height="400"
        >
          <v-row class="fill-height" align="center" justify="center">
            <div align="center">
              <p class="display-2">
                Career Development Center
              </p>
              <p class="display-1">
                #CBIT
              </p>
              <v-btn large color="primary" to="/login"> Login </v-btn>
            </div>
          </v-row>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: "Banner",
  data: () => ({
    backgroundImages : ["about.jpg","i3.jpg","i5.jpg"]
  }),
  methods :{
    getImgUrl(name) {
      return require("@/assets/images/"+name);
    }
  }
};
</script>
