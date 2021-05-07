<template>
    <v-container v-if="loaded">
        <div v-if="!expired">
        <p class="font-weight-regular">Registration ends in
            <span style="font-size:1.3rem;">
        {{ displayDays }} :
        {{ displayHours }} :
        {{ displayMinutes }} :
        {{ displaySeconds }}
            </span></p>
        </div>
        <h5 class="red--text pl-6 font-weight-regular" style="font-size:1rem;"  v-else>Registrations Closed <v-icon color="red">mdi-alert-circle </v-icon></h5>

    </v-container>
</template>

<script>

import { EventBus } from '@/event-bus.js'

export default {
    name: "Counter",
    props: ['lastDate'],
   
   data: () => ({
     displayDays:0,
     displayHours:0,
     displayMinutes:0,
     displaySeconds:0,
     loaded: false,
     expired: false,
    }),
    computed:{
        _seconds: () => 1000,
        _minutes(){
            return this._seconds*60;
        },
        _hours(){
            return this._minutes*60;
        },
        _days(){
            return this._hours*24;
        }
    },
    mounted(){
        this.showRemaining();
    },

    methods:{

        formatNum : num => (num<10 ? "0"+num : num),
        showRemaining(){
           const timer = setInterval(() => {
               const now = new Date();
               const end = new Date(this.lastDate);
               end.setHours(end.getHours() - 5); 
               end.setMinutes(end.getMinutes() - 30);          
               
                const distance = end.getTime() - now.getTime() ;

                if(distance<0){
                    clearInterval(timer);
                    this.expired = true; 
                    this.loaded = true;
                    EventBus.$emit('timerOut',0);
                    return ;
                }

                const days = Math.floor(distance/this._days);
                const hours = Math.floor((distance % this._days)/this._hours);
                const minutes = Math.floor((distance % this._hours)/this._minutes);
                const seconds = Math.floor((distance % this._minutes)/this._seconds);

                this.displayMinutes = this.formatNum(minutes);
                this.displaySeconds = this.formatNum(seconds) ;
                this.displayHours = this.formatNum(hours);
                this.displayDays =this.formatNum(days);
                this.loaded = true;
           }, 1000);
       } 
    },

  }
</script>
