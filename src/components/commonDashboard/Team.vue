<template>
    <v-container fluid class="down-top-padding" >
            <BaseCard heading="Team">
            
           
    <v-slide-group
      
      class="pa-4"
      center-active
      show-arrows
      align = "center"
      justify ="center"
    >
      <v-slide-item
        v-for="n in 3"
        :key="n"
        v-slot="{ active, toggle }"
      >
      <v-hover v-slot="{ hover }">
        <v-card
          :color="active ? 'peach' : 'grey lighten-1'"
          class="ma-4"
          height="290"
          width="290"
          :elevation="hover ? 12 : 2"
          outlined
          @click="toggle"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-scale-transition>
              <!-- <v-icon
                v-if="active"
                color="white"
                size="48"
              ></v-icon> -->
            </v-scale-transition>
          </v-row>
        </v-card>
      </v-hover>
      </v-slide-item>
    </v-slide-group>
 

            </BaseCard>
    </v-container>
</template>

<script>

export default ({
    name: "Team",

    data: () => ({
    }),
 
})
</script>


<style scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 1;
 }
</style>