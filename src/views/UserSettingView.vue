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
                        <v-form v-on:submit.prevent="ownUserUpdateMethod">
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.name"
                                label="Full Name"
                                dense
                                prepend-icon="mdi-account"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.last_name"
                                label="Last Name"
                                dense
                                prepend-icon="mdi-account"
                              ></v-text-field>
                            </v-col>
                          </v-row> -->
                          <!-- <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.user_name"
                                label="Username"
                                dense
                                prepend-icon="mdi-account"
                              ></v-text-field>
                            </v-col>
                          </v-row> -->
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                              disabled
                                type="email"
                                v-model.trim="user.email"
                                label="Email"
                                dense
                                prepend-icon="mdi-mail"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.phone_number"
                                label="Phone"
                                dense
                                prepend-icon="mdi-phone"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row> -->
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                              disabled
                                type="password"
                                v-model.trim="user.password"
                                label="Enter password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-btn
                            class="grey text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="cancelUserUpdate"
                            >Cancel</v-btn
                          >
                          <v-btn
                            type="submit"
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
                  <v-tab-item>
                    <v-card flat>
                      <v-card-title>
                        Change Password
                      </v-card-title>
                      <v-card-text>
                        <v-form
                          ref="passwordForm"
                          v-on:submit.prevent="updatePassword"
                        >
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                type="password"
                                v-model.trim="user.oldPassword"
                                label="Enter old password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                type="password"
                                v-model.trim="user.password"
                                label="New password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                type="password"
                                v-model.trim="user.password_confirmation"
                                label="Confirm new password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-btn
                            class=" grey text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="cancelPasswordUpdate"
                            >Cancel</v-btn
                          >
                          <v-btn
                            type="submit"
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

      UserID:null,

      // SWEETALERTS 
      apimessage: null,
      apistatus: null,
      apititle: null,

      // END SWEETALERTS 
      ////////////////////////////////////////////////////////////////////////////////////////////


      //UPDATE USER DATA 
      user: {
        name:null, 
        email:null, 
        role:null
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

// END VALIDATION RULES

    };
  },

  methods: {

    FetchUserDetails(UserId) {

this.userID = UserId;
axios
  .get(`http://127.0.0.1:8000/api/getUserupdatedetail/${this.userID}`)
  .then((response) => {
    if (response.status === 200) {
      this.user = response.data.User
      // this.selectCorrespondence = response.data.updateFileCorrespondanceNameSelect
      // alert(selectStatus);
      // this.updatefiledialog = true;
    }
  })

},

    ownUserUpdateMethod(){
      axios
        .put(`http://127.0.0.1:8000/api/updateOwnUserRoute/${this.UserID}`, {
            UserNameHolder: this.user.name
          })
          .then((response) => {
            this.SwtAlertResponse(response.data);
            if (response.status ===200) {
              this.BtnUpdateCorrespondenceLoading = false;

              this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
                this.updatecorrespondencedialog = false;
                this.getCorrespondencesFromApi();
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
    }
  },

  mounted() {
    this.getuserDetailsMethod();
    this.FetchUserDetails(UserId);
  },
};
</script>
