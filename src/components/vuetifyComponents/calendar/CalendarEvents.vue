<template>
    <!-- ----------------------------------------------------------------------------- -->
    <!-- Events -->
    <!-- ----------------------------------------------------------------------------- -->
    <div>
        <v-list-item-subtitle class="text-wrap">
        You can find all the important announcements and events here. Click on the event or the day for detailed view.
        </v-list-item-subtitle>
        <div class="mt-4">
            <v-sheet height="64">
                <v-toolbar flat color="white">
                <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                    Today
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom right>
                    <template v-slot:activator="{ on }">
                    <v-btn
                        outlined
                        color="grey darken-2"
                        v-on="on"
                    >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                    </template>
                    <v-list>
                    <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 days</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
                </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
                <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :now="today"
                :type="type"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
                @change="updateRange"
                ></v-calendar>
                <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
                >
                <v-card
                    color="grey lighten-4"
                    min-width="350px"
                    flat
                >
                    <v-toolbar
                    :color="selectedEvent.color"
                    dark
                    >
                    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon>mdi-heart</v-icon>
                    </v-btn>
                    </v-toolbar>
                    <v-card-text>
                    <p class="font-weight-medium"> {{ selectedEvent.details }} </p>
                    Posted on: {{ selectedEvent.posted_date }}
                    </v-card-text>
                </v-card>
                </v-menu>
            </v-sheet>
        </div>
    </div>
</template>

<script>
export default {
  name: "CalendarEvents",

  data: () => ({
      focus: '',
      type: 'month',
      today: null,
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      fetchedEvents : [],
      colors: ['info', 'success', 'warning', 'error', 'indigo', 'pink', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      eventTypes: { "Message":"","Meeting":"info","Pre-placement Talk":"indigo","Test":"success"}
  }),
  computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'IST', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange();
      this.$axios.get('/api/announcements/')
        .then(res => {
          this.fetchedEvents = res.data;
          this.updateRange(this.start, this.end);
        })
        .catch(err => {
          console.log(err);
        });
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        console.log("KOU",start);
        // const events = [
        //   {
        //     name: "name",
        //     start: this.formatDate(new Date(), true),
        //     end: this.formatDate(new Date(), false),
        //     color: "info"
        //   },
        //   {
        //     name: "Kousthu",
        //     start: this.formatDate(new Date(), true),
        //     end: this.formatDate(new Date(), false),
        //     color: "success"
        //   }
        // ]

        const events = [];
        console.log(this.fetchedEvents);
        for(let i = 0; i < this.fetchedEvents.length; i++) {
          events.push({
            name: this.fetchedEvents[i].title,
            start: this.formatDate(new Date(this.fetchedEvents[i].date),false),
            end: this.formatDate(new Date(this.fetchedEvents[i].date), false),
            color: this.eventTypes[this.fetchedEvents[i].type],
            details: this.fetchedEvents[i].message,
            posted_date: new Date(this.fetchedEvents[i].posted_date).toString().slice(4,15),
          })
        }

        // var events = [];
        // const min = new Date(`${start.date}T00:00:00`)
        // const max = new Date(`${end.date}T23:59:59`)
        // const days = (max.getTime() - min.getTime()) / 86400000
        // const eventCount = this.rnd(days, days + 20)

        // for (let i = 0; i < eventCount; i++) {
        //   const allDay = this.rnd(0, 3) === 0
        //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        //   const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        //   const second = new Date(first.getTime() + secondTimestamp)

        //   events.push({
        //     name: this.names[this.rnd(0, this.names.length - 1)],
        //     start: this.formatDate(first, !allDay),
        //     end: this.formatDate(second, !allDay),
        //     color: this.colors[this.rnd(0, this.colors.length - 1)],
        //   })
        // }

        this.start = start
        this.end = end
        this.events = events
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      formatDate (a, withTime) {
        return withTime
          ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
          : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
      },
    }
};
</script>