<template>
  <div class="file">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title> 
              <h4>FILES</h4>
              <v-spacer></v-spacer>
              <v-btn slot="activator" depressed class="primary" @click="addfiledialog = !addfiledialog">
                <v-icon>mdi-plus</v-icon>
                <span class="text-capitalize">New File</span>
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
              :items="files" 
              :items-per-page="10" 
              class="elevation-1"
              :search="search" :loading="filedataloading" loading-text="Loading... Please wait">
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-5" @click="FetchFileDetails(item.id)"> mdi-pencil </v-icon>
                  <v-icon small class="mr-5" @click="FetchDeleteFileDetails(item.id)"> mdi-delete </v-icon>
                  <v-icon small @click="FetchDocumentFileDetails(item.id)"> mdi-plus-thick </v-icon>

                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>


      <!-- START ADD FILE MODAL -->

      <v-dialog v-model="addfiledialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Add New File</h3>
            <v-spacer></v-spacer>

            <v-btn text color="grey" rounded @click="addfiledialog = !addfiledialog">
              <span>Close</span>
              <v-icon right>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field id="fileNameTxtField" label="File Name" v-model="fileNameTxtField"
                prepend-icon="mdi-file"></v-text-field>
              <v-textarea label="File Description" v-model="fileDescriptionTxtField"
                prepend-icon="mdi-file-question"></v-textarea>
              <v-select v-model="selectCorrespondence" :items="correspondences" label="Select Correspondence"
                data-vv-name="select" prepend-icon="mdi-group" required></v-select>
              <v-select v-model="selectStatus" :items="filestatuses" label="File Status" data-vv-name="select"
                prepend-icon="mdi-file-settings" required></v-select>

            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
            <v-btn class="grey ma-2" justify-start 
              @click="addfiledialog = !addfiledialog">
              CANCEL
            </v-btn>
            <v-btn class="primary ma-2" justify-end @click="addFileMethod" :loading="BtnAddFileLoading" right>
              Add File</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <!-- END ADD FILE MODAL -->



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
          <div class="text-center d-flex align-center justify-end">
            <v-btn class="grey ma-2" justify-start 
              @click="updatefiledialog = !updatefiledialog">
              CANCEL
            </v-btn>
          <v-btn class="primary ma-2" @click="updateFileMethod" :loading="BtnUpdateFileLoading">
            Update file
          </v-btn>
          </div>
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

          <div class="text-center d-flex align-center justify-end">
            <v-btn class="grey ma-2" @click="deletefiledialog = !deletefiledialog">
              CANCEL
            </v-btn>
            <v-btn class="ma-2" color="error" @click="deleteFileMethod" :loading="BtnDeleteFileLoading">
              DELETE
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- END DELETE FILE MODAL -->

      <!-- START ADD DOCUMENT MODAL -->
      <v-dialog v-model="adddocumentdialog" max-width="500">
        <v-card>
          <v-card-title>
            <h3>Add Document</h3>
            <v-spacer></v-spacer>

            <v-btn text color="grey" rounded @click="adddocumentdialog = !adddocumentdialog">
              <span>Close</span>
              <v-icon right>mdi-close-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
          <v-form class="px-3" ref="addDocForm"  enctype="multipart/form-data">
              <v-text-field disabled label="File Name" v-model="file.FILE_NAME" prepend-icon="mdi-group"></v-text-field>
              <v-text-field disabled label="File Description" v-model="file.FILE_DESCRIPTION"
                prepend-icon="mdi-group"></v-text-field>
              <v-text-field label="Document Name" v-model="documentNameInFileTextField" prepend-icon="mdi-group"></v-text-field>
              <v-text-field label="Folio Number" v-model="documentFolioNumberInFileTextField"
                prepend-icon="mdi-group"></v-text-field>
              <input type="file"    ref="fileInput"/>

                <!-- <v-file-input
                  clearable
                  show-size
                  label="File input"
                  v-model="pinDocumentInFileTextField"
                ></v-file-input> -->
            
            </v-form>
          </v-card-text>
          <!-- <v-btn class="primary ma-5" @click="addDocumentInFileMethod" :loading="BtnAddDocumentLoading"> -->
          <div class="text-center d-flex align-center justify-end">
            <v-btn class="grey ma-2" @click="adddocumentdialog = !adddocumentdialog">
              CANCEL
            </v-btn>
          <v-btn class="primary ma-2" @click="submitForm" :loading="BtnAddDocumentLoading">
            Add Document
          </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- END ADD DOCUMENT MODAL -->




    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
export default {
  name: "file", // name of component view
  


  data() {
    return {

      filedataloading: false,

      //ADD NEW FILE DATA
      fileNameTxtField: "",
      fileDescriptionTxtField: "",
      selectStatus: "",


      selectedcorrespondence: "", // from update model
      selectCorrespondence: "",
      correspondences: [],

      filestatuses: [
        'CLOSED', 'OPEN'
      ],


      addfiledialog: false,
      BtnAddFileLoading: false,
      search: "",
      // test: false,






      //END ADD NEW FILE DATA
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
      BtnAddDocumentLoading:false,
      fileDocuments: [],


      documentNameInFileTextField:"",
      pinDocumentInFileTextField:null,
      documentFolioNumberInFileTextField:"",


      //END ADD DOCUMENTS TO FILES



      files: [],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "FILE NAME", value: "FILE_NAME" },
        { text: "FILE DESCRIPTION", value: "FILE_DESCRIPTION" },
        { text: "CORRESPONDENCE", value: "correspondence.CORRESPONDENCE_NAME" },
        { text: "FILE STATUS", value: "STATUS" },
        { text: "CREATED AT", value: "created_at" },
        { text: "UPDATED AT", value: "updated_at" },
        { text: "ACTION", sortable: false, value: "actions" },
      ],
    };
  },

  methods: {

    getFilesFromApi() {
      this.filedataloading = true;
      axios
        .get("http://127.0.0.1:8000/api/ListFileRoute")
        .then((response) => {
          if (response.status === 200) {
            this.files = response.data;
            this.filedataloading = false;

          } else {
            alert("Error Loading Files data");
          }
        });
    },


    addFileMethod() {
      this.BtnAddFileLoading = true;
      axios
        .post("http://127.0.0.1:8000/api/AddFileRoute", {
          FileNameHolder: this.fileNameTxtField,
          FileDescriptionHolder: this.fileDescriptionTxtField,
          StatusHolder: this.selectStatus,
          correspondenceHolder: this.selectCorrespondence

        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.BtnAddFileLoading = false;
            this.addfiledialog = false;
            this.getFilesFromApi();
            this.$refs.form.reset();
          } else {
            alert("Error adding file");
          }
        });
    },

    FetchFileDetails(FileId) {

      this.fileID = FileId;
      axios
        .get(`http://127.0.0.1:8000/api/getFileupdatedetail/${this.fileID}`)
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
  .get(`http://127.0.0.1:8000/api/getFileupdatedetail/${this.fileID}`)
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
        .get(`http://127.0.0.1:8000/api/getFileupdatedetail/${this.fileID}`)
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

    addDocumentInFileMethod(){
      this.BtnAddDocumentLoading = true,

      axios
      .post("http://127.0.0.1:8000/api/AddDocumentRoute", {
          FileHolder: this.file.FILE_NAME,
          DocumentNameHolder: this.documentNameInFileTextField,
          FolioNumberHolder: this.documentFolioNumberInFileTextField,
          DocPathHolder: this.pinDocumentInFileTextField

        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.BtnAddDocumentLoading = false;
            this.adddocumentdialog;
            this.getFilesFromApi();
            this.$refs.form.reset();
          } else {
            alert("Error adding document");
          }
        });
    },

      ///////////////////////////////////////////////////////////////

      // ONE COMMENTED BLOCK

  // handleFileUpload(event) {
  //     this.pinDocumentInFileTextField = event.target.files[0];
  //   },
  //   submitForm() {

  //           this.BtnAddDocumentLoading = true;
  //     const formData = new FormData();
  //     formData.append('FileHolder', this.file.FILE_NAME);
  //     formData.append('DocumentNameHolder', this.documentNameInFileTextField);
  //     formData.append('FolioNumberHolder', this.documentFolioNumberInFileTextField);
  //     formData.append('DocPathHolder', this.pinDocumentInFileTextField);

  //     axios.post('http://127.0.0.1:8000/api/AddDocumentRoute', formData)
  //       .then(response => {
  //         console.log(response.data);
  //         this.BtnAddDocumentLoading = false;
  //           this.adddocumentdialog;
  //           this.getFilesFromApi();
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   }


// END ONE COMMENTED BLOCK


// START RECENT BLOCK

submitForm() {

  this.BtnAddDocumentLoading = true;
  const fileinput = this.$refs.fileInput.files[0];

  const formData = new FormData();
  formData.append('FileHolder', this.file.FILE_NAME);
  formData.append('DocumentNameHolder', this.documentNameInFileTextField);
  formData.append('FolioNumberHolder', this.documentFolioNumberInFileTextField);
  formData.append('DocPathHolder', fileinput);

  // alert(fileinput);

  axios.post('http://127.0.0.1:8000/api/AddDocumentRoute', formData, {
    headers : {
      'Content-Type':'multipart/form-data'
    }
  })
    .then(response=>{
      console.log(response.data.message);
      this.BtnAddDocumentLoading = false;
      this.adddocumentdialog = false;
      this.getFilesFromApi();
      this.$refs.addDocForm.reset();

      // alert(response)
    })
      .catch(error => {
          // console.error(error);
      });

}


// END START RECENT BLOCK






  ////////////////////////////////////////////////////////////////////////////
  
    
  }
  

  ,

  mounted() {
    this.getFilesFromApi();
    this.selectcorrespondencemethod();
  },
};
</script>
