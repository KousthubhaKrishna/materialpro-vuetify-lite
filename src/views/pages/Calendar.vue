<template>
  <v-container fluid class="down-top-padding">
    <v-row>
      <v-col cols="12" sm="12">
        
        <BaseCard heading="Calender">
            <CalendarEvents></CalendarEvents>
        </BaseCard>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "Calendar",

  data: () => ({
  }),
  components: {
     
      CalendarEvents: () => import('@/components/vuetifyComponents/calendar/CalendarEvents'),
  }
};
</script>
