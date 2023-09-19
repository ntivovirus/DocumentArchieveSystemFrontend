<template>
    <div class="d-flex align-center justify-center text-center" style="height: 100vh">
      <v-container fluid>
        <v-row>
          <v-col>
           
        <v-sheet width="400"  class="mx-auto justify-center">
            <v-avatar size="150" tile>
            <img
              src="/Malawi-Gov.png"
              alt="BLantyre District Council"
              height="100"
            >
          </v-avatar>
          <div class="mb-10">
          <h2  >PASSWORD </h2>
          <h4 class="">Forgot Your Password</h4>
        </div>
        <div class="md-3">
            <v-form  @submit.prevent="login">
                <v-text-field  v-model="munthu.useremailTxtField" variant="outlined" type="email" label="Your Registered Email" prepend-icon="mdi-email"></v-text-field>

                <v-btn type="submit" color="green white--text" block class="mt-2" :loading="BtnLoginLoading">Sign in</v-btn>

            </v-form>
          </div>
            <div class="mt-2">
                <p class="text-body-2">Don't have an account? <a href="#">Sign Up</a></p> 
            </div>
        </v-sheet>

          </v-col>
        </v-row> 
      </v-container>
    
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "forgotpassword", // name of component view

  data() {
    return {

      apimessage: null,
      apistatus: null,
      apititle: null,
 
      munthu : {
        useremailTxtField: null,
        passwordTxtField: null
      },

      BtnLoginLoading: false,
       
        // loginBtn: false,

    

      
    };
  },

  methods: {
    
    login() {



      if(!this.munthu.useremailTxtField || !this.munthu.passwordTxtField){

        // alert("Please fill in all textfields iwe");
        // this.$swal('Password or Email cannot be empty');
        this.$swal(
              'Error',
              'Password or Email cannot be empty',
              'error'
              );


      }
      else{
        this.BtnLoginLoading=true;

        axios
        .post("http://127.0.0.1:8000/api/LoginRoute", {
          email: this.munthu.useremailTxtField,
          password: this.munthu.passwordTxtField
          
        })
        .then((response) => {
          this.apimessage = response.data.message;
          this.apistatus = response.data.status;
          this.apititle = response.data.status;

          if (response.status === 201) {
            // this.BtnLoginLoading = true;
            // this.$refs.form.reset();
            const token = response.data.token;
            const tuser = response.data.user;  
            // this.apimessage = response.data.message;

            sessionStorage.setItem('api_token', token);
            sessionStorage.setItem('userdetails', JSON.stringify(tuser)); // converting object so that it can be stored in session storage
            // sessionStorage.setItem('userdetailssession', tuser);
            this.$router.push({path: '/'});
            this.BtnLoginLoading=false;
            this.$swal(
              'Warning (Message Of The Day)',
              'All connections are monitored and recorded. Disconnect/LogOut IMMEDIATELY if you are NOT an authorized user!',
              'warning'
              );

          } 
          else if(response.status===200){
          
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
          else if(response.status===501){

            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
          else if(response.status===404){

            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
          else{
            
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
        });

      this.BtnLoginLoading = false;
      }
        
    }
    
  },

  mounted() {
    
  },
};
</script>
