<template>
  <div class="user">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <v-icon left>mdi-account-group</v-icon>
              <h4>USERS</h4>
              <v-spacer></v-spacer>
              <v-btn
                slot="activator"
                depressed
                class="primary"
                @click="showAddUserDialog"
              >
                <v-icon>mdi-plus</v-icon>
                <span class="text-capitalize">new user</span>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="d-flex justify-end">
                <v-text-field
                  class="shrink ml-2"
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                >
                </v-text-field>
              </div>
              <v-data-table dense
                :headers="headers"
                :items="users"
                :items-per-page="10"
                class="elevation-1"
                :search="search"
                :loading="userdataloading"
                loading-text="Loading... Please wait"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-5" @click="FetchUserDetails(item.id)"> mdi-pencil </v-icon>
                  <v-icon color="red" small @click="FetchDeleteUserDetails(item.id)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    
<!-- START ADD USER MODAL -->

      <v-dialog v-model="adduserdialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Add New User</h3>
            <v-spacer></v-spacer>

            <v-btn 
            text color="grey"
            rounded
            @click="adduserdialog = !adduserdialog"
            >
              <span>Close</span>
              <v-icon right>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form" v-model="valid" lazy-validation>
              <v-text-field
                label="User Full Name"
                v-model="userFullNameTxtField"
                prepend-icon="mdi-account-box"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                label="User Email"
                v-model="userEmailTxtField"
                prepend-icon="mdi-email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                type="password"
                label="Password"
                v-model="userPasswordTxtField"
                prepend-icon="mdi-lock" 
                :rules="nameRules"
                required
              ></v-text-field>
              <v-select v-model="userRoleSelectField" :items="selectUserRole" label="User Role"
                data-vv-name="select" prepend-icon="mdi-account-group" :rules="nameRules"
                required></v-select>
                <v-select v-model="userStatusSelectField" :items="selectUserStatus" label="Account Status" prepend-icon="mdi-account-question" 
               :rules="nameRules" required>
              </v-select>
              
            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
          <v-btn
           class="danger ma-5" 
           justify-start 
           color="grey"
           @click="adduserdialog = !adduserdialog"
           >
           Close
           </v-btn>
          <v-btn
            class="primary ma-5"
            justify-end
            @click="addUserMethod"
            :loading="BtnAddUserLoading"
            right
            :disabled="!valid"
          >
            Add User</v-btn>
          </div>
        </v-card>
      </v-dialog>
<!-- END ADD USER MODAL -->


      
<!-- START UPDATE USER MODAL -->
      <v-dialog v-model="updateuserdialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Update User</h3>
            <v-spacer></v-spacer>

            <v-btn 
            text color="grey"
            rounded
            @click="updateuserdialog = !updateuserdialog"
            >
              <span>Close</span>
              <v-icon right>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="updateform" v-model="valid" lazy-validation>
              <v-text-field
                label="User Full Name"
                v-model="user.name" 
                prepend-icon="mdi-account-box"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                label="User Email"
                v-model="user.email"
                prepend-icon="mdi-email"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-select 
               v-model="user.role" 
               :items="selectUserRole"
               prepend-icon="mdi-account-group" 
               :rules="nameRules">
              </v-select>
              <v-select 
               v-model="user.account_status" 
               :items="selectUserStatus"
               prepend-icon="mdi-account-question" 
               :rules="nameRules">
              </v-select>
            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
          <v-btn
           class="grey ma-2" 
           justify-start 
           @click="updateuserdialog  = !updateuserdialog "
           >
           Close
           </v-btn>
          <v-btn
            class="primary ma-2"
            @click="updateUserMethod"
            :loading="BtnUpdateUserLoading"
            :disabled="!valid"
            
          >
            Update User
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

<!-- END UPDATE USER MODAL -->

<!-- START DELETE USER MODAL -->
<v-dialog v-model="deleteuserdialog" max-width="400">
        <v-card>
          <v-card-title class="text-center">
            <h5>DELETE</h5>
           
          </v-card-title>
          <v-card-text>
            
          </v-card-text>

          <div class="text-center d-flex align-center justify-end">
          <v-btn
            class=" grey ma-2"
            @click="deleteuserdialog = !deleteuserdialog"
          >
            CANCEL
            </v-btn>
          <v-btn
            class="ma-2"
            color="error"
            @click="deleteUserMethod"
            :loading="BtnDeleteUserLoading"
          >
            DELETE
            </v-btn>
            </div>
        </v-card>
      </v-dialog>

<!-- END DELETE USER MODAL -->



    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "user", // name of component view

  data() {
    return {

      // SWEETALERTS 
      apimessage: null,
      apistatus: null,
      apititle: null,

      // END SWEETALERTS 



      //ADD NEW CORRESPONDENCE DATA
      userFullNameTxtField: "",
      userEmailTxtField: "",
      userPasswordTxtField: "",
      userRoleSelectField:"",
      userStatusSelectField:"",
      selectUserRole:["Administrator","User"],
      selectUserStatus:["ACTIVE","DEACTIVATED"],
      adduserdialog: false,
      BtnAddUserLoading: false,
      search: "",
      test: false,
      userdataloading: false,

      //END ADD NEW USER DATA
      ////////////////////////////////////////////////////////////////////////////////////////////


      //UPDATE USER DATA
      updateuserdialog: false,
      userID: null,
      BtnUpdateUserLoading: false,
      user: {
        name:null, 
        email:null, 
        role:null,
        account_status:null

      },

      //END UPDATE USER DATA
      ////////////////////////////////////////////////////////////////////////////////////////////

      //DELETE USER DATA

      deleteuserdialog: false,
      BtnDeleteUserLoading: false,       

      //END UPDATE USER DATA
      ////////////////////////////////////////////////////////////////////////////////////////////



      users: [],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "USER FULL NAME", value: "name" },
        { text: "EMAIL", value: "email" },
        { text: "ROLE", value: "role" },
        { text: "STATUS", value: "account_status" },
        { text: "CREATED AT", value: "created_at" },
        { text: "UPDATED AT", value: "updated_at" },
        { text: "ACTION", sortable: false, value: "actions" },
      ],

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

    getUsersFromApi() {
      this.userdataloading=true;
      axios
        .get("http://127.0.0.1:8000/api/ListUserRoute")
        .then((response) => {
          
          if (response.status === 200) {
            this.users = response.data;
      this.userdataloading=false;

          } else {
            // alert("Error Loading Users data");
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
        });
    },
      
    showAddUserDialog() {
      this.adduserdialog = true;
    },

    addUserMethod() {
      this.BtnAddUserLoading = true;
      axios
        .post("http://127.0.0.1:8000/api/AddUserRoute", { 
          UserfullnameHolder: this.userFullNameTxtField,
          UserEmailHolder: this.userEmailTxtField,
          UserPasswordHolder: this.userPasswordTxtField,
          UserRoleHolder: this.userRoleSelectField,
          UserStatusHolder: this.userStatusSelectField
        })
        .then((response) => {
          this.SwtAlertResponse(response.data);

          if (response.status === 200) {
            this.BtnAddUserLoading = false;
            this.$refs.form.reset();

            this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
              this.adduserdialog = false;
              this.getUsersFromApi();
            });

          } else if(response.status === 500) {
            // alert("Error adding User");
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
          else{
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
        });
    },

    FetchUserDetails(UserId) {
      
      this.userID= UserId;
      axios
        .get(`http://127.0.0.1:8000/api/getUserupdatedetail/${this.userID}`)
        .then((response) => {
          if (response.status ===200) {
            this.user = response.data.User

            this.updateuserdialog = true;

         }
        })  
      
    },

    FetchDeleteUserDetails(UserId) {
      
      this.userID= UserId;
      axios
        .get(`http://127.0.0.1:8000/api/getUserupdatedetail/${this.userID}`)
        .then((response) => {
          if (response.status ===200) {
            this.user = response.data.User

            this.deleteuserdialog = true;


         }
        })  
      
    },

    updateUserMethod(UserId) {
        this.BtnUpdateUserLoading = true,
        this.UserID = UserId;
        axios
          .put(`http://127.0.0.1:8000/api/updateUserRoute/${this.userID}`, {
            UserFullNameHolder: this.user.name,
            UserEmailHolder: this.user.email,
            UserRoleHolder: this.user.role,
            UserStatusHolder: this.user.account_status

          })
          .then((response) => {
            this.SwtAlertResponse(response.data);
            if (response.status ===200) {
              this.BtnUpdateUserLoading = false;

              this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
                this.updateuserdialog = false;
                this.getUsersFromApi();
              });

            }
          })
    },

    deleteUserMethod(UserId) {
        this.BtnDeleteUserLoading = true,
        this.UserID = UserId;
        axios
          .delete(`http://127.0.0.1:8000/api/deleteUserRoute/${this.userID}`, {
           
          })
          .then((response) => {
            this.SwtAlertResponse(response.data);
            if (response.status ===200) {
              this.BtnDeleteUserLoading = false;

              this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
                this.deleteuserdialog = false;
                this.getUsersFromApi();
              });

            }
          })
    },

    SwtAlertResponse($ntivo){
          this.apimessage = $ntivo.message;
          this.apistatus = $ntivo.status;
          this.apititle = $ntivo.status;
    }
  },

  mounted() {
    this.getUsersFromApi();
    //this.addSectionMethod();
  },
};
</script>
