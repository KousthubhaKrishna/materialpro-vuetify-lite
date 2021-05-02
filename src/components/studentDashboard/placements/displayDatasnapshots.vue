<template>
<v-container>
           <v-card>
             <v-card-title>
               {{ snap.snap_name }}
             </v-card-title>
               
            <v-card-text>
              {{ snap.type_of_data }}<br/>
              {{ snap.placement_batch }}<br/>
              {{ snap.fields }}<br/>
              {{ snap.extra_fields }}<br/>
              {{ snap.last_date }}<br/>
            </v-card-text>
        
            </v-card>

            <TableCRUD></TableCRUD>


</v-container>
</template>

<script>
import axios from 'axios'

  export default {
    name: "Displaysnap",

    props:['id'],

    data: () => ({
      snap:[],
      error:"",
    }),
    created(){

      axios.get('/api/snaps/'+this.id)
      .then(response=>{
          this.snap = response.data;
          console.log(this.snap);
      })
      .catch(error =>{
          console.log(error);
      })

    },
    
    components:{
    //   AddDatasnapshot: () => import('@/components/studentDashboard/snaps/addDatasnapshot'),
      TableCRUD: () => import('@/components/vuetifyComponents/tables-simple/TableCRUD'),
    }
  }
</script>

