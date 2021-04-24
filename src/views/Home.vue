<template>
  <div class="home">
    <HomePage />
    <LoginBox />
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from "@/components/HomePage.vue";
import LoginBox from "@/components/LoginBox.vue";

export default {
  name: "Home",
  components: {
    HomePage,
    LoginBox
  }
};
</script>
