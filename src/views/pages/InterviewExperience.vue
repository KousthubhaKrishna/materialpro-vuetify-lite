<template>
<v-container>
<div class = "InterviewExperience"> 
    <h1> Interview Experience </h1>
    <div v-for="post in posts" :key="post.id">
        <h2> {{ post.company_name }}</h2>
        <h4> {{ post.content }}</h4>
        <!-- <h4> {{ post.created_by[basic_info][full_name] }}</h4> -->
        <hr/>
    </div>
</div>
</v-container>
</template>

<script>
import axios from 'axios'

export default {
    name: "InterviewExperience",
    data(){
        return{
            posts:[]
        }
    },
    methods: {

    },
    created(){
        axios.get('/api/interviewExperiences')
        .then( response =>{
            this.posts = response.data
            console.log(response.data)
        })
        .catch(error =>{
            console.log(error)
        })
    },
}
</script>

<style scoped>
h1{
    color:red;
    text-align: center;
}
</style>