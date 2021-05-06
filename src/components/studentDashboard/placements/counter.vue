<template>
    <v-container v-if="loaded">
        <h5 v-if="!expired">Registration ends in 
        {{ displayDays }}:
        {{ displayHours }}:
        {{ displayMinutes }}:
        {{ displaySeconds }}</h5>
        <h5 v-else>Registrations Closed </h5>

    </v-container>
</template>

<script>

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
                    this.$emit('timerOut');
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
