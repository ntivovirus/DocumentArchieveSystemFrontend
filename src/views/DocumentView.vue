<template>
  <div class="document">
    <v-container fluid> 
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <h4>DOCUMENTS</h4>
              <v-spacer></v-spacer>
              <v-btn slot="activator" depressed class="primary" @click="adddocumentdialog = !adddocumentdialog">
                <v-icon>mdi-plus</v-icon>
                <span class="text-capitalize">New Document</span>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="d-flex justify-end">
                <v-text-field class="shrink ml-2" v-model="search" append-icon="mdi-magnify" label="Search">
                </v-text-field>
              </div>
              <v-data-table 
              dense 
              :headers="headers"  
              :items="documents"  
              :items-per-page="10" 
              class="elevation-1"
              :search="search" :loading="filedataloading" loading-text="Loading... Please wait">
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-5" @click="FetchFileDetails(item.id)"> mdi-pencil </v-icon>
                  <v-icon small class="mr-5" @click="FetchDeleteFileDetails(item.id)"> mdi-delete </v-icon>
                  <v-icon small class="mr-5" @click="FetchDocumentFileDetails(item.id)"> mdi-plus-thick </v-icon>
                  <v-icon small class="mr-5" @click="FetchDocumentFileDetails(item.id)"> mdi-eye-check </v-icon>
                  <v-icon small class="mr-5" @click="FetchDocumentFileDetails(item.id)"> mdi-printer </v-icon>

                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>


      <!-- START ADD FILE MODAL -->

      <v-dialog v-model="adddocumentdialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Add New Document</h3>
            <v-spacer></v-spacer>

            <v-btn text color="grey" rounded @click="adddocumentdialog = !adddocumentdialog">
              <span>Close</span>
              <v-icon right>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              
              <v-autocomplete v-model="selectCorrespondence" :items="correspondences" label="Select Correspondence"
              placeholder="Select..." prepend-icon="mdi-group" required></v-autocomplete>
              <v-autocomplete v-model="selectFile" :items="files" label="Select File"
              placeholder="Select..." prepend-icon="mdi-folder-multiple" required></v-autocomplete>
              <!-- <v-select v-model="selectStatus" :items="filestatuses" label="File Status" data-vv-name="select"
                prepend-icon="mdi-file-settings" required></v-select> -->
              <v-text-field id="fileNameTxtField" label="Document Name" v-model="documentNameTxtField"
                prepend-icon="mdi-file"></v-text-field>
              <v-text-field label="Folio Number" v-model="folioNumberTxtField"
                prepend-icon="mdi-file-question"></v-text-field>

            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
            <v-btn class="danger ma-5" justify-start color="grey"
              @click="adddocumentdialog = !adddocumentdialog">
              Close
            </v-btn>
            <v-btn class="primary ma-5" justify-end @click="addDocumentMethod" :loading="BtnAddDocumentLoading" right>
              Add Document</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <!-- END ADD DOCUMENT MODAL -->



      <!-- START UPDATE FILE MODAL -->
      <v-dialog v-model="updatefiledialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Update File</h3>
            <v-spacer></v-spacer>

            <v-btn text color="grey" rounded @click="updatefiledialog = !updatefiledialog">
              <span>Close</span>
              <v-icon right>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="updateform">
              <v-text-field label="File Name" v-model="file.FILE_NAME" prepend-icon="mdi-group"></v-text-field>
              <v-textarea label="File Description" v-model="file.FILE_DESCRIPTION" prepend-icon="mdi-group"></v-textarea>
              <v-select v-model="selectCorrespondence" :items="correspondences" label="Select Correspondence"
                data-vv-name="select" prepend-icon="mdi-group" required></v-select>
              <v-select v-model="file.STATUS" :items="filestatuses" label="File Status" data-vv-name="select"
                prepend-icon="mdi-group" required></v-select>
            </v-form>
          </v-card-text>
          <v-btn class="primary ma-5" @click="updateFileMethod" :loading="BtnUpdateFileLoading">
            Update file
          </v-btn>
        </v-card>
      </v-dialog>

      <!-- END UPDATE FILE MODAL -->

      <!-- START DELETE FILE MODAL -->
      <v-dialog v-model="deletefiledialog" max-width="400">
        <v-card>
          <v-card-title class="text-center">
            <h5>DELETE</h5>

          </v-card-title>
          <v-card-text>

          </v-card-text>

          <div class="text-center d-flex align-center justify-space-between">
            <v-btn class=" primary ma-5" @click="deletefiledialog = !deletefiledialog">
              CANCEL
            </v-btn>
            <v-btn class="ma-5" color="error" @click="deleteFileMethod" :loading="BtnDeleteFileLoading">
              DELETE
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- END DELETE FILE MODAL -->

    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "document", // name of component view

  data() {
    return {

      documentdataloading: false,

      //ADD NEW DOCUMENT DATA
      documentNameTxtField: "",
      folioNumberTxtField: "",
      // selectStatus: "", //IF TO ADD IT TO THE ADD DIALOG


      selectedcorrespondence: "", // from update model
      selectCorrespondence: "",
      selectFile: "",
      correspondences: [],
      files: [],

      // filestatuses: [
      //   'CLOSED', 'OPEN'
      // ],


      adddocumentdialog: false,
      BtnAddDocumentLoading: false,
      search: "",
      // test: false,






      //END ADD NEW DOCUMENT DATA
      ////////////////////////////////////////////////////////////////////////////////////////////


      //UPDATE FILE DATA
      updatefiledialog: false,
      fileID: null,
      BtnUpdateFileLoading: false,
      file: {
        id: null,
        FILE_NAME: null,
        FILE_DESCRIPTION: null,
        STATUS: null,
        correspondence_id: null
      },

      //END UPDATE FILE DATA
      ////////////////////////////////////////////////////////////////////////////////////////////

      //DELETE FILE DATA

      deletefiledialog: false,
      BtnDeleteFileLoading: false,

      //END UPDATE FILE DATA
      ////////////////////////////////////////////////////////////////////////////////////////////

      /////////////////////////////////////////////////////////////////
      //ADD DOCUMENTS TO FILES
      adddocumentdialog: false,
      fileDocuments: [],

      //END ADD DOCUMENTS TO FILES



      documents: [],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "DOCUMENT NAME", value: "DOCUMENT_NAME" },
        { text: "FOLIO NUMBER", value: "FOLIO_NUMBER" },
        { text: "CORRESPONDENCE", value: "file.correspondence.CORRESPONDENCE_NAME" },
        { text: "FILE", value: "file.FILE_NAME" },
        { text: "FILE STATUS", value: "file.STATUS" },
        { text: "ADDED BY", value: "FOLIO_NUMBER" },
        { text: "CREATED AT", value: "created_at" },
        { text: "UPDATED AT", value: "updated_at" },
        { text: "ACTION", sortable: false, value: "actions" },
      ],
    };
  },

  methods: {

    getDocumentsFromApi() {
      this.documentdataloading = true;
      axios
        .get("http://127.0.0.1:8000/api/ListDocumentRoute")
        .then((response) => {
          if (response.status === 200) {
            this.documents = response.data;
            this.documentdataloading = false;

          } else {
            alert("Error Loading Documents data");
          }
        });
    },


    addDocumentMethod() {
      this.BtnAddDocumentLoading = true;
      axios
        .post("http://127.0.0.1:8000/api/AddDocumentRoute", {
          DocumentNameHolder: this.documentNameTxtField,
          FolioNumberHolder: this.folioNumberTxtField,
          fileHolder: this.selectFile,
          correspondenceHolder: this.selectCorrespondence

        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.BtnAddDocumentLoading = false;
            this.adddocumentdialog = false;
            this.getDocumentsFromApi();
            this.$refs.form.reset();
          } else {
            alert("Error adding Document");
          }
        });
    },

    FetchFileDetails(FileId) {

      this.fileID = FileId;
      axios
        .get(`http://127.0.0.1:8000/api/getupdatedetail/${this.fileID}`)
        .then((response) => {
          if (response.status === 200) {
            this.file = response.data.File
            this.selectCorrespondence = response.data.updateFileCorrespondanceNameSelect
            // alert(selectStatus);
            this.updatefiledialog = true;

          }
        })

    },

    FetchDocumentFileDetails(FileId) {

this.fileID = FileId;
axios
  .get(`http://127.0.0.1:8000/api/getupdatedetail/${this.fileID}`)
  .then((response) => {
    if (response.status === 200) {
      this.file = response.data.File
      this.selectCorrespondence = response.data.updateFileCorrespondanceNameSelect
      // alert(selectStatus);
      this.adddocumentdialog = true;

    }
  })

},

    FetchDeleteFileDetails(FileId) {

      this.fileID = FileId;
      axios
        .get(`http://127.0.0.1:8000/api/getupdatedetail/${this.fileID}`)
        .then((response) => {
          if (response.status === 200) {
            this.file = response.data.File
            this.deletefiledialog = true;


          }
        })

    },

    updateFileMethod() {
      this.BtnUpdateFileLoading = true,
        // this.FileID = FileId;
        axios
          .put(`http://127.0.0.1:8000/api/updateFileRoute/${this.file.id}`, {
            FileNameHolder: this.file.FILE_NAME,
            FileDescriptionHolder: this.file.FILE_DESCRIPTION,
            StatusHolder: this.file.STATUS,
            correspondenceHolder: this.selectCorrespondence

          })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              this.BtnUpdateFileLoading = false;
              this.updatefiledialog = false;
              this.getFilesFromApi();
              this.$refs.form.reset();
            } else {
              alert("Error updating file");
            }
          })
    },

    deleteFileMethod(FileId) {
      this.BtnDeleteFileLoading = true,
        this.FileID = FileId;
      axios
        .delete(`http://127.0.0.1:8000/api/deleteFileRoute/${this.fileID}`, {

        })
        .then((response) => {
          if (response.status === 200) {
            this.getFilesFromApi();
            this.deletefiledialog = false;
            this.BtnDeleteFileLoading = false;
          }
        })
    },

    selectcorrespondencemethod() {
      axios
        .get(`http://127.0.0.1:8000/api/ListCorrespondenceRoute`)
        .then((response) => {
          if (response.status === 200) {
            var correspondences = response.data
            console.log('steve' + correspondences);
            correspondences.forEach(correspondence => {
              this.correspondences.push(correspondence.CORRESPONDENCE_NAME);
              // $zako = this.correspondences.push(correspondence.id); 
              // alert($zako);

            });
            // this.deletefiledialog = true;

          }

        }
        )
    },


    selectfilemethod() {
      axios
        .get(`http://127.0.0.1:8000/api/ListFileRoute`)
        .then((response) => {
          if (response.status === 200) {
            var files = response.data
            console.log('steve' + files);
            files.forEach(file => {
              this.files.push(file.FILE_NAME);
              // $zako = this.correspondences.push(correspondence.id); 
              // alert($zako);

            });
            // this.deletefiledialog = true;
          }
        }
        )
    }



  },

  mounted() {
    this.getDocumentsFromApi();
    this.selectcorrespondencemethod();
    this.selectfilemethod();
  },
};
</script>
