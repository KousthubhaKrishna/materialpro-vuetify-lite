<template>
  <v-container fluid class="down-top-padding">
    <v-row>
      <v-col cols="12" lg="4">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col>
                <h3 class="title blue-grey--text text--darken-2 font-weight-regular">Annoucements
                </h3>
              </v-col>
              <v-col v-if="$PERMISSIONS.MED.has(this.user.role)" align="right">
                <v-btn
                  class="mx-2"
                  elevation="1"
                  fab
                  dark
                  small
                  color="white"
                  @click = "dialog=true"
                  >
                  <v-icon color="#FFC300">
                    mdi-bell-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-list two-line>
              <v-list-item-group v-model="selected" active-class="info--text">
                <v-virtual-scroll height="400" item-height="80" :items="announcements">
                  <template v-slot:default="{ item }">
                    <v-divider></v-divider>
                    <v-list-item :key="item.title" :to="'/dashboard/placements/' + ( item.placement_id || '')">
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title class="primary--text" v-text="item.title"></v-list-item-title>
                          <v-list-item-subtitle class="secondary--text"> On {{ getDate(item.date) }}</v-list-item-subtitle>
                          <v-list-item-subtitle v-text="item.message"></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-action-text> {{ timeSince(item.posted_date) }} ago </v-list-item-action-text>
                          <v-icon v-if="!active" color="grey lighten-1">mdi-star-outline</v-icon>
                          <v-icon v-else color="yellow">mdi-star</v-icon>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </template>
                </v-virtual-scroll>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-text class="pa-5">
            <h3
              class="title blue-grey--text text--darken-2 font-weight-regular mb-4"
              >Activity Timeline</h3>
              <v-timeline
                dense
                clipped
              >
                <v-timeline-item
                  v-for="(item,index) in activity"
                  :color="item.actType"
                  small
                  :key="index"

                >
                  <v-row justify="space-between">
                    <v-col cols="7">
                      {{ item.text }}
                    </v-col>
                    <v-col
                      class="text-right"
                      cols="5"
                    >
                      {{ getDate(item.date) }}
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px" 
      v-if="$PERMISSIONS.MED.has(user.role)"
      >
      <v-card>
        <v-card-title>
          <span class="headline">Announcements</span>
        </v-card-title>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-alert v-if="error.length > 0" dense outlined text type="error">
                {{ error }}
              </v-alert>
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  class="pa-1"
                  >
                  <v-text-field
                    label="Title*"
                    v-model="announcement.title"
                    :rules="[value => !!value || '']"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-textarea
                    ref="description"
                    name="input-7-1"
                    label="Message"
                    v-model="announcement.message"
                    auto-grow
                    :rules="[value => !!value || '']"
                    >
                  </v-textarea>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-select 
                    :items="type" 
                    label="Type of Announcement*"  
                    :rules="[value => !!value || '']"
                    v-model="announcement.type">
                  </v-select>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  >
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="announcement.date"
                        label="Date of event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="announcement.date"
                      @change="save"
                      ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog"
            >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submitMessage"
            >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
const gradients = [
  ["#6c757d"],
  ["#6c757d"],
  ["#6c757d", "#6c757d", "#6c757d"],
  ["#21c1d6", "21c1d6"],
  ["#21c1d6", "#21c1d6", "#21c1d6"],
  ["#21c1d6", "#21c1d6", "#21c1d6"]
];

const gradients2 = [
  ["#1e88e5"],
  ["#1e88e5"],
  ["#1e88e5", "#1e88e5", "#1e88e5"],
  ["#1e88e5", "#1e88e5"],
  ["#1e88e5", "#1e88e5", "#1e88e5"],
  ["#1e88e5", "#1e88e5", "#1e88e5"]
];

export default {
  name: "BasicDashboard",
  data: () => ({
    fill: true,
    gradient: gradients[4],
    gradients,
    padding: 8,
    radius: 50,
    value: [0, 2, 5, 9, 5, 10, 3, 5, 1, 8, 2, 9, 0],
    width: 1,

    fill2: true,
    gradient2: gradients2[4],
    gradients2,
    radius2: 0,
    padding2: 0,
    value2: [1, 2, 5, 9, 5, 10, 3, 5, 1, 8, 2, 9, 4],
    width2: 4,
    activity:[],
    activity1: [
      {
        message: "Registered for Amazon Internship Drive",
        time: "May 04, 2020"
      },
      {
        message: "Attended JP Morgan Placement Talk",
        time: "May 02, 2020"
      },
      {
        message: "Webinar on Internet of things",
        time: "May 01, 2020"
      },
      {
        message: "Preplcement Talk of Modak Analytics",
        time: "April 29, 2020"
      },
    ],
    task: null,
    selected: [2],
    announcements: [],
    announcement: {
      title: "",
      message: "",
      date: "",
      type: "",
    },
    dialog: false,
    error: "",
    menu: false,
    type: ["Message", "Meeting", "Pre-placement Talk", "Test"]
  }),
  computed: {
    completedTasks() {
      return this.tasks.filter(task => task.done).length;
    },
    progress() {
      return (this.completedTasks / this.tasks.length) * 100;
    },
    remainingTasks() {
      return this.tasks.length - this.completedTasks;
    }
  },
  components: {
  },
  created() {
    const access_token = window.$cookies.get("jwt");
    let tokens = JSON.parse(atob(access_token.split(".")[1]));
    this.user = tokens;
    this.initialize();
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date)
    },
    initialize() {
      this.$axios.get('/api/announcements/')
        .then(res => {
          this.announcements = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios.get('/api/activity/' + this.user._id)
        .then(res => {
          var list = res.data.list || [];
          this.activity = list.reverse();
        })
        .catch(err => {
          console.log(err);
        });
    },
    create() {
      this.tasks.push({
        done: false,
        text: this.task
      });

      this.task = null;
    },
    closeDialog() {
      this.dialog = false;
      this.error = "";
      this.$refs.form.reset();
    },
    submitMessage() {

      let isValid = this.$refs.form.validate(true);
      if (isValid) {
        this.dialog = false;
        this.$axios.post('/api/announcements/nil', this.announcement)
          .then(response => {
            console.log(" message submitted", response.data)
            this.$refs.form.reset();
            this.initialize();
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        this.error = "Fill all the required Fields";
      }
    },
    getDate(dateString) {
      return new Date(dateString).toString().slice(4, 11);
    },
    timeSince(dateString) {
      var date = new Date(dateString);
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }
  },
};
</script>