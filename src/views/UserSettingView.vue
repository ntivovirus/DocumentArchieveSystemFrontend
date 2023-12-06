<template>
  <div class="usersettings">
    <v-container fluid>
      <v-row>
        <v-col>
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account-settings</v-icon>
              <h4>USER SETTINGS</h4> 
              <v-spacer></v-spacer> 

          </v-card-title>
          <v-card-text>

            <v-tabs>
                  <v-tab color="primary">
                    <v-icon left> mdi-account </v-icon>
                    User Info
                  </v-tab>
                  <v-tab>
                    <v-icon left> mdi-lock </v-icon>
                    Security
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-title>
                        Update User Info
                      </v-card-title>
                      <v-card-text>
                        <v-form v-model="valid" lazy-validation>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                :rules="nameRules"
                                v-model="userdata.name"
                                label="Full Name"
                                dense
                                prepend-icon="mdi-account"
                                :loading="fullnameloading"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                              disabled
                                type="email"
                                v-model="userdata.email"
                                label="Email"
                                dense
                                prepend-icon="mdi-email"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                  
                          <!-- <v-btn
                            class="grey text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="cancelUserUpdate"
                            >Cancel</v-btn
                          > -->
                          <v-btn
                            :disabled="!valid"
                            elevation="2"
                            outlined
                            class="primary text-capitalize ml-2"
                            @click="ownUserUpdateMethod"
                            >Save</v-btn
                          >
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-title>
                        Change Password
                      </v-card-title>
                      <v-card-text>
                        <v-form
                          ref="passwordForm"
                          v-model="valid"
                        >
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                              :rules="oldpasswordrules"
                                type="password"
                                v-model.trim="old_password"
                                label="Enter old password"
                                dense
                                prepend-icon="mdi-lock-open-check"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                :rules="passwordRules"
                                type="password"
                                v-model.trim="new_password"
                                label="New password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                :rules="passwordRules"
                                type="password"
                                v-model.trim="confirm_password"
                                label="Confirm new password"
                                dense
                                prepend-icon="mdi-lock-check"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-btn
                            class=" grey text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="resetForms"
                            >Clear
                            </v-btn
                          >
                          <v-btn
                            :disabled="!valid"
                            @click="update_password"
                            elevation="2"
                            :loading="loading ? '#B55B68' : null"
                            outlined
                            class="primary text-capitalize ml-2"
                            >Save</v-btn
                          >
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>

          </v-card-text>
        </v-card>
      </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "usersettings", // name of component view

  data() {
    return {

      userID:null,

      //PASSWORD UPDATE TEXT FIELDS
      confirm_password: null,
      old_password: null,
      new_password: null,

      //END PASSWORD UPDATE FIELDS

      // SWEETALERTS 
      apimessage: null,
      apistatus: null,
      apititle: null,

      // END SWEETALERTS 

      // LOADING
      fullnameloading:false,

      // END LOADING

      ////////////////////////////////////////////////////////////////////////////////////////////


      //UPDATE USER DATA 
      userdata: {
        name: null,
        email: null
        
      },

      

      //END UPDATE USER DATA
      ////////////////////////////////////////////////////////////////////////////////////////////


    

      // VALIDATION RULES
      valid: true,

      nameRules: [
        v => !!v || 'This is a required field',
        v => (v && v.length >= 3) || 'Must be greater than 3 characters',
      ],

      numberRules: [
        v => !!v || 'This is a required field! Please Enter Folio number',
        ],
      
  emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],

  passwordRules: [
        v => !!v || 'Password cannot be empty',
        v => (v && v.length >= 8) || 'Password should have a minimum of 8 characters',
      ],

      oldpasswordrules: [
        v => !!v || 'This is a required field!',
        v => (v && v.length >= 8) || 'I hope your old Password does not have a minimum of 8 characters',
        ],

// END VALIDATION RULES

    };
  },

  methods: {

    FetchUserDetails(UserId) {
this.fullnameloading=true,
this.userID = UserId;
axios
  .get(`http://127.0.0.1:8000/api/getUserupdatedetail/${this.userID}`)
  .then((response) => {
    if (response.status === 200) {
      this.userdata = response.data.User
      this.fullnameloading=false
    }
  })

},

    ownUserUpdateMethod(){
      this.fullnameloading=true,

      axios
        .put(`http://127.0.0.1:8000/api/updateOwnNameRoute/${this.userID}`, {
          updatenameholder: this.userdata.name
          })
          .then((response) => {
            this.SwtAlertResponse(response.data);
            if (response.status ===200) {
              this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
                this.FetchUserDetails(this.userID);
                this.fullnameloading=false

              });
            }
          })

    },

    getuserDetailsMethod(){
      // this.username = sessionStorage.getItem("userdetails"); // WORKING LINK

              // Retrieve the JSON string from Session Storage
        const storedUser = sessionStorage.getItem("userdetails");

        // Parse the JSON string back to an object
        const user = storedUser ? JSON.parse(storedUser) : null;

        ////////////////////
        /////////////////

        let stringValue = user ? user.id : null; // Example string containing a number
        let intValue = parseInt(stringValue); // Convert string to integer

        ////////////////////
        /////////////////

        // Access the 'username' property
        this.userID =  intValue;

        // alert(this.userID);

    },



    SwtAlertResponse($ntivo){
          this.apimessage = $ntivo.message;
          this.apistatus = $ntivo.status;
          this.apititle = $ntivo.status;
    },

    resetForms(){
      this.$refs.passwordForm.reset()

    },

    update_password(){

      if (!this.old_password || !this.new_password || !this.confirm_password){
        this.$swal('Error', 'Text fields cannot be empty', 'error');
      }
      else{
        if(this.new_password == this.confirm_password){
            axios
              .put(`http://127.0.0.1:8000/api/updateOwnPasswordRoute/${this.userID}`, {
                oldpasswordholder : this.old_password,
                newpasswordholder : this.new_password,
                confirmpasswordholder : this.confirm_password
              }). then((response) => {
                this.SwtAlertResponse(response.data);

                if(response.status === 200){
              this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{});
                }
              })

            // this.$swal('Password Matched','','success');
            }
            else{
            this.$swal('Error', 'New and Confirm passwords do not match','error');
            }









      }



      





    }
  },

  computed: {
    passwordmatch(){

      if(this.new_password==this.confirm_password){
        alert("Iwe virus samala");
      }
      else{
        alert("not yet done");
      }


    }

  },

  mounted() {
    this.getuserDetailsMethod();
    this.FetchUserDetails(this.userID);
  },
};
</script>
