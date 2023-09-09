<template>
  <div class="correspondence">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <h4>CORRESPONDENCES</h4>
              <v-spacer></v-spacer>
              <v-btn
                slot="activator"
                depressed
                class="primary"
                @click="showAddCorrespondenceDialog"
              >
                <v-icon>mdi-plus</v-icon>
                <span class="text-capitalize">new correspondence</span>
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
                :items="correspondences"
                :items-per-page="10"
                class="elevation-1"
                :search="search"
                :loading="correspondencedataloading"
                loading-text="Loading... Please wait"
              >
                <template v-slot:item.actions="{ item }">
                  <!-- <v-icon small class="mr-5" @click="FetchCorrespondenceDetails(item.id)"> mdi-pencil </v-icon> -->
                  <v-icon small class="mr-5" @click="FetchCorrespondenceDetails(item.id)"> mdi-pencil</v-icon>
                  <v-icon color="red" small @click="FetchDeleteCorrespondenceDetails(item.id)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    
<!-- START ADD CORRESPONDENCE MODAL -->

      <v-dialog v-model="addcorrespondencedialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Add New Correspondence</h3>
            <v-spacer></v-spacer>

            <v-btn 
            text color="grey"
            rounded
            @click="addcorrespondencedialog = !addcorrespondencedialog"
            >
              <span>Close</span>
              <v-icon right>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form" v-model="valid" lazy-validation>
              <v-text-field
                label="Correspondence Name"
                v-model="correspondenceNameTxtField"
                prepend-icon="mdi-group"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                label="Correspondence Code Name"
                v-model="correspondenceCodeNameTxtField"
                prepend-icon="mdi-group"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-textarea
                label="Correspondence Description"
                v-model="correspondenceDescriptionTxtField"
                prepend-icon="mdi-pencil"
                :counter="4"
                :rules="nameRules"
                required
              ></v-textarea>
            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
          <v-btn
           class="grey ma-2" 
           justify-start 
           @click="addcorrespondencedialog = !addcorrespondencedialog"
           >
           CANCEL
           </v-btn>
          <v-btn
            :disabled="!valid"
            class="primary ma-2"
            justify-end
            @click="addCorrespondenceMethod"
            :loading="BtnAddCorrespondenceLoading"
            right
          >
            Add Correspondence</v-btn>
          </div>
        </v-card>
      </v-dialog>
<!-- END ADD CORRESPONDENCE MODAL -->


      
<!-- START UPDATE CORRESPONDENCE MODAL -->
      <v-dialog v-model="updatecorrespondencedialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Update Correspondence</h3>
            <v-spacer></v-spacer>

            <v-btn 
            text color="grey"
            rounded
            @click="updatecorrespondencedialog = !updatecorrespondencedialog"
            >
              <span>Close</span>
              <v-icon right>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="updateform" v-model="valid" lazy-validation>
              <v-text-field
                label="Correspondence Name"
                v-model="correspondence.CORRESPONDENCE_NAME"
                prepend-icon="mdi-group"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                label="Correspondence Code Name"
                v-model="correspondence.CORRESPONDENCE_CODENAME"
                prepend-icon="mdi-group"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-textarea
                label="Section Description"
                v-model="correspondence.CORRESPONDENCE_DESCRIPTION"
                prepend-icon="mdi-pencil"
                :counter="4"
                :rules="nameRules"
                required
              ></v-textarea>
            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
            <v-btn
            class=" grey ma-1"
            @click="updatecorrespondencedialog = !updatecorrespondencedialog"
          >
            CANCEL
            </v-btn>
          <v-btn
            :disabled="!valid"
            class="primary ma-2"
            @click="updateCorrespondenceMethod"
            :loading="BtnUpdateCorrespondenceLoading"
          >
            Update Correspondence
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

<!-- END UPDATE CORRESPONDENCE MODAL -->

<!-- START DELETE CORRESPONDENCE MODAL -->
<v-dialog v-model="deletecorrespondencedialog" max-width="400">
        <v-card>
          <v-card-title class="text-center">
            <h5>DELETE</h5>
           
          </v-card-title>
          <v-card-text>
            
          </v-card-text>

          <div class="text-center d-flex align-center justify-end">
          <v-btn
            class=" grey ma-2"
            @click="deletecorrespondencedialog = !deletecorrespondencedialog"
          >
            CANCEL
            </v-btn>
          <v-btn
            class="error ma-2"
           
            @click="deleteCorrespondenceMethod"
            :loading="BtnDeleteCorrespondenceLoading"
          >
            DELETE
            </v-btn>
            </div>
        </v-card>
      </v-dialog>

<!-- END DELETE CORRESPONDENCE MODAL -->



    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "correspondence", // name of component view

  data() {
    return {

      // SWEETALERTS 
      apimessage: null,
      apistatus: null,
      apititle: null,

      // END SWEETALERTS 
      
      //ADD NEW CORRESPONDENCE DATA
      correspondenceNameTxtField: "",
      correspondenceCodeNameTxtField: "",
      correspondenceDescriptionTxtField: "",
      addcorrespondencedialog: false,
      BtnAddCorrespondenceLoading: false,
      search: "",
      test: false,
      correspondencedataloading: false,

      //END ADD NEW CORRESPONDENCE DATA
      ////////////////////////////////////////////////////////////////////////////////////////////


      //UPDATE CORRESPONDENCE DATA
      updatecorrespondencedialog: false,
      correspondenceID: null,
      BtnUpdateCorrespondenceLoading: false,
      correspondence: {
        CORRESPONDENCE_NAME:null, 
        CORRESPONDENCE_CODENAME:null, 
        CORRESPONDENCE_DESCRIPTION:null
      },

      //END UPDATE CORRESPONDENCEDATA
      ////////////////////////////////////////////////////////////////////////////////////////////

      //DELETE CORRESPONDENCE DATA

      deletecorrespondencedialog: false,
      BtnDeleteCorrespondenceLoading: false,

      //END UPDATE CORRESPONDENCE DATA
      ////////////////////////////////////////////////////////////////////////////////////////////



      correspondences: [],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "NAME", value: "CORRESPONDENCE_NAME" },
        { text: "CODE NAME", value: "CORRESPONDENCE_CODENAME" },
        { text: "DESCRIPTION", value: "CORRESPONDENCE_DESCRIPTION" },
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


      // END VALIDATION RULES

    };
  },

  methods: {

    // VALIDATION METHODS
   


    // END VALIDATION NOTES

    getCorrespondencesFromApi() {
      this.correspondencedataloading=true;
      axios
        .get("http://127.0.0.1:8000/api/ListCorrespondenceRoute")
        .then((response) => {
          if (response.status === 200) {
            this.correspondences = response.data; 
            this.correspondencedataloading=false;

          } else {
            alert("Error Loading Correspondences data");
          }
        });
    },
      
    showAddCorrespondenceDialog() {
      this.addcorrespondencedialog = true;
    },

    addCorrespondenceMethod() {
      this.BtnAddCorrespondenceLoading = true;
      axios
        .post("http://127.0.0.1:8000/api/AddCorrespondenceRoute", {
          CorrespondenceNameHolder: this.correspondenceNameTxtField,
          CorrespondenceCodeNameHolder: this.correspondenceCodeNameTxtField,
          CorrespondenceDescriptionHolder: this.correspondenceDescriptionTxtField
        })
        .then((response) => {
          this.SwtAlertResponse(response.data);

          if (response.status === 200) {
            this.BtnAddCorrespondenceLoading = false;
            this.addcorrespondencedialog = false;
            this.getCorrespondencesFromApi();
            this.$refs.form.reset();
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          } else {
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
        });
    },

    FetchCorrespondenceDetails(CorrespondenceId) {
      
      this.correspondenceID= CorrespondenceId;
      axios
        .get(`http://127.0.0.1:8000/api/getCorrespondenceupdatedetail/${this.correspondenceID}`)
        .then((response) => {
          if (response.status ===200) {
            this.correspondence = response.data.Correspondence

            this.updatecorrespondencedialog = true;

         }
        })  
      
    },

    FetchDeleteCorrespondenceDetails(CorrespondenceId) {
      
      this.correspondenceID= CorrespondenceId;
      axios
        .get(`http://127.0.0.1:8000/api/getCorrespondenceupdatedetail/${this.correspondenceID}`)
        .then((response) => {
          if (response.status ===200) {
            this.correspondence = response.data.Correspondence

            this.deletecorrespondencedialog = true;


         }
        })  
      
    },

    updateCorrespondenceMethod(CorrespondenceId) {
        this.BtnUpdateCorrespondenceLoading = true,
        this.CorrespondenceID = CorrespondenceId;
        axios
          .put(`http://127.0.0.1:8000/api/updateCorrespondenceRoute/${this.correspondenceID}`, {
            CorrespondenceNameHolder: this.correspondence.CORRESPONDENCE_NAME,
            CorrespondenceCodeNameHolder: this.correspondence.CORRESPONDENCE_CODENAME,
            CorrespondenceDescriptionHolder: this.correspondence.CORRESPONDENCE_DESCRIPTION
          })
          .then((response) => {
            this.SwtAlertResponse(response.data);
            if (response.status ===200) {
              this.BtnUpdateCorrespondenceLoading = false;
              this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
                this.updatecorrespondencedialog = false;
              
                this.getCorrespondencesFromApi();
              })


            }
          })
    },

    deleteCorrespondenceMethod(CorrespondenceId) {
        this.BtnDeleteCorrespondenceLoading = true,
        this.CorrespondenceID = CorrespondenceId;
        axios
          .delete(`http://127.0.0.1:8000/api/deleteCorrespondenceRoute/${this.correspondenceID}`, {
           
          })
          .then((response) => {
            this.SwtAlertResponse(response.data);
            if (response.status ===200) {
              this.getCorrespondencesFromApi();
              this.deletecorrespondencedialog = false;
              this.BtnDeleteCorrespondenceLoading = false;
              this.$swal(this.apititle,this.apimessage,this.apistatus);

            }
            else{
              this.$swal(this.apititle,this.apimessage,this.apistatus);

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
    this.getCorrespondencesFromApi();
    //this.addSectionMethod();
  },
};
</script>
