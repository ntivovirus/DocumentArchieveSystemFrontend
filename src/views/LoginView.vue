<template>
    <div class="d-flex align-center justify-center" style="height: 100vh">
        <v-sheet width="400" class="mx-auto">
            <v-form  @submit.prevent="login">
                <v-text-field v-model="munthu.useremailTxtField" variant="outlined" type="email" label="User Name"></v-text-field>

                <v-text-field v-model="munthu.passwordTxtField" variant="outlined" type="password" label="password"></v-text-field>
                <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>

                <v-btn type="submit" color="primary" block class="mt-2">Sign in</v-btn>

            </v-form>
            <div class="mt-2">
                <p class="text-body-2">Don't have an account? <a href="#">Sign Up</a></p> 
            </div>
        </v-sheet>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "login", // name of component view

  data() {
    return {

      munthu : {
        useremailTxtField: null,
        passwordTxtField: null
      },
       
        // loginBtn: false,

    

      
    };
  },

  methods: {

    login() {

      if(!this.munthu.useremailTxtField || !this.munthu.passwordTxtField){

        alert("Please fill in all textfields iwe");

      }
      else{

        axios
        .post("http://127.0.0.1:8000/api/LoginRoute", {
          email: this.munthu.useremailTxtField,
          password: this.munthu.passwordTxtField
          
        })
        .then((response) => {
          if (response.status === 201) {
            // this.BtnAddCorrespondenceLoading = false;
            // this.addcorrespondencedialog = false;
            // this.getCorrespondencesFromApi();
            // this.$refs.form.reset();
            const token = response.data.token;
            sessionStorage.setItem('api_token', token);
            alert(token);



            // sessionStorage.setItem("Username",response.user.name);
            // sessionStorage.setItem("Authorization", response.token.Value);
            // $vi = sessionStorage.getItem("Authorization");
            // alert("Welcome" + $vi);



            this.$router.push({path: '/'});
          } 
          else {
            alert("Invalid Username or Password");
          }
        });

      }

     
        
    }

    
  },

  mounted() {
    
  },
};
</script>
