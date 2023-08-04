<template>
  <div class="section">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <h4>SECTIONS/DEPARTMENTS</h4>
              <v-spacer></v-spacer>
              <v-btn
                slot="activator"
                depressed
                class="primary"
                @click="showAddSectionDialog"
              >
                <v-icon>mdi-plus</v-icon>
                <span class="text-capitalize">new section</span>
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
                :items="sections"
                :items-per-page="10"
                class="elevation-1"
                :search="search"
                :loading="sectiondataloading"
                loading-text="Loading... Please wait"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-5" @click="FetchSectionDetails(item.id)"> mdi-pencil </v-icon>
                  <v-icon small @click="deleteItem(item.id)"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!--ADD SECTION DIALOG-->

      <v-dialog v-model="addsectiondialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Add New Section</h3>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3">
              <v-text-field
                label="Section Name"
                v-model="sectionNameTxtField"
                prepend-icon="mdi-group"
              ></v-text-field>
              <v-textarea
                label="Section Description"
                v-model="sectionDescriptionTxtField"
                prepend-icon="mdi-pencil"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-btn
            class="primary ma-5"
            @click="addSectionMethod"
            :loading="BtnAddSectionLoading"
          >
            Add Section</v-btn
          >
        </v-card>
      </v-dialog>

      <!-- END ADD SECTION DIALOG -->

      <!-- START UPDATE SECTION DIALOG -->
      <v-dialog v-model="updatesectiondialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Update Section</h3>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3">
              <v-text-field
                label="Section Name"
                v-model="section.SECTION_NAME"
                prepend-icon="mdi-group"
              ></v-text-field>
              <v-textarea
                label="Section Description"
                v-model="section.SECTION_DESCRIPTION"
                prepend-icon="mdi-pencil"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-btn
            class="primary ma-5"
            @click="updateSectionMethod"
            :loading="BtnUpdateSectionLoading"
          >
            Update Section
            </v-btn>
        </v-card>
      </v-dialog>


      <!-- END UPDATE SECTION DIALOG -->

    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "section", // name of component view

  data() {
    return {
      //ADD NEW SECTION DATA
      sectionNameTxtField: "",
      sectionDescriptionTxtField: "",
      addsectiondialog: false,
      BtnAddSectionLoading: false,
      search: "",
      test: false,
      sectiondataloading: false,

      //END ADD NEW SECTION DATA
      ////////////////////////////////////////////////////////////////////////////////////////////


      //UPDATE SECTION DATA
      updatesectiondialog: false,
      sectionID: null,
      section: {
        CORRESPONDENCE_NAME:null, 
        CORRESPONDENCE_DESCRIPTION:null
      },

      //END UPDATE SECTION DATA
      ////////////////////////////////////////////////////////////////////////////////////////////


      sections: [],
      headers: [
        {
          text: "CORRESPONDENCE ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "CORRESPONDENCE NAME", value: "CORRESPONDENCE_NAME" },
        { text: "CORRESPONDENCE DESCRIPTION", value: "CORRESPONDENCE_DESCRIPTION" },
        { text: "ACTION", sortable: false, value: "actions" },
      ],
    };
  },

  methods: {

    getSectionsFromApi() {
      this.sectiondataloading=true;
      axios
        .get("http://127.0.0.1:8000/api/ListCorrespondenceRoute")
        .then((response) => {
          if (response.status === 200) {
            this.sections = response.data;
      this.sectiondataloading=false;

          } else {
            alert("Error Loading Correspondences data");
          }
        });
    },
      
    showAddSectionDialog() {
      this.addsectiondialog = true;
    },

    addSectionMethod() {
      this.BtnAddSectionLoading = true;
      axios
        .post("http://127.0.0.1:8000/api/AddSectionRoute", {
          SectionNameHolder: this.sectionNameTxtField,
          SectionDescriptionHolder: this.sectionDescriptionTxtField,
        })
        .then((response) => {
          if (response.status === 200) {
            this.BtnAddSectionLoading = false;
            this.addsectiondialog = false;
            this.getSectionsFromApi();
          } else {
            alert("Error adding section");
          }
        });
    },

    FetchSectionDetails(SectionId) {
      this.sectionID= SectionId;
      axios
        .get(`http://127.0.0.1:8000/api/getupdatedetail/${this.sectionID}`)
        .then((response) => {
          if (response.status ===200) {
            this.section = response.data.section
            this.updatesectiondialog = true;

          }
        })  
      
    },

    updateSectionMethod(SectionId) {
        this.SectionID = SectionId;
        alert(this.SectionID);
        axios
          .put("http://127.0.0.1:8000/api/updateSectionRoute/${this.sectionID}", {
            SectionNameHolder: this.section.SECTION_NAME,
            SectionDescriptionHolder: this.section.SECTION_DESCRIPTION
          })
          .then((response) => {
            if (response.status ===200) {
              alert("data updated succeessfully");
            }
          })
    }
  },

  mounted() {
    this.getSectionsFromApi();
    //this.addSectionMethod();
  },
};
</script>
