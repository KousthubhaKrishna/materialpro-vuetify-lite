<template>
<v-container fluid>
    <!-- <v-footer app  color="white" class="footerpart" inset>
      <v-col cols="12">
        <span>© {{ new Date().getFullYear() }} — Material Pro Admin by wrappixel.com</span>
      </v-col>
    </v-footer> -->
    <div class="row">
      <aside id="text-3" class="widget widget_text">
      <div class="textwidget"><p><img class="alignnone size-medium wp-image-1069" src="https://www.cbit.ac.in/wp-content/uploads/2020/01/logo.png" alt="" width="300" height="88"></p></div>
      </aside>
    </div>
    <div class="row">
            <div class="col-md-6">
                <div class="f-left-col">
                    
                      <p>College Contact Info</p>
                      <p>Gandipet, Hyderabad, Telangana,<br>
                      PIN : 500075<br>
                      </p>
                      
                </div>
              </div>
              <div class="col-md-6">
                <p>
                  Phone: 040-24193276<br>
                  Mobile: 8466997201<br>
                  Email: principal@cbit.ac.in
                </p>
              </div>
            
        </div>
      </v-container>
</template>
<script>
export default {
    name: "Footer",
}
</script>
<style lang="scss">
  .v-application .footerpart{
    border-top:1px solid rgba(0,0,0,0.1)!important;
  }
</style>