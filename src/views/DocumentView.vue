<template>
  <div class="document">
    <v-container fluid> 
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <v-icon left>mdi-file</v-icon>
              <h4>DOCUMENTS</h4>
              <v-spacer></v-spacer>
              <!-- <v-btn slot="activator" v-bind:disabled="newDocumentDisabled" depressed class="primary" @click="adddocumentdialog = !adddocumentdialog"> -->
              <v-btn v-show="false" slot="activator" depressed class="primary" @click="adddocumentdialog = !adddocumentdialog">

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
              :search="search" :loading="documentdataloading" loading-text="Loading... Please wait">
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-3" @click="FetchFileDetails(item.id)"> mdi-pencil </v-icon>
                  <v-icon v-show="deleteShowIcon" color="red" small class="mr-3" @click="FetchDeleteDocumentDetails(item.id)"> mdi-delete </v-icon>
                  <!-- <v-icon small class="mr-3" @click="FetchDocumentFileDetails(item.id)"> mdi-plus-thick </v-icon> -->
                  <v-icon small class="mr-3" @click="FetchDownloadDocumentDetails(item.id)"> mdi-download </v-icon>
                  <v-icon small class="mr-3" @click="FetchPreviewDocumentDetails(item.id)"> mdi-eye-check </v-icon> 
                  <v-icon small class="mr-3" @click="downloadFile"> mdi-download-lock </v-icon>
                  <v-icon small class="mr-3" @click="previewFile"> mdi-eye-remove </v-icon>
                  <!-- <v-icon small class="mr-5" @click="FetchDocumentFileDetails(item.id)"> mdi-printer </v-icon> -->

                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>


      <!-- START ADD DOCUMENT MODAL --> 

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
            <v-form class="px-3" ref="addDocForm" enctype="multipart/form-data" v-model="valid" lazy-validation>
              
              <v-autocomplete v-model="selectCorrespondence" :items="correspondences" label="Select Correspondence"
              placeholder="Select..." prepend-icon="mdi-group" :rules="nameRules" required></v-autocomplete>
              <v-autocomplete v-model="selectFile" :items="files" label="Select File"
              placeholder="Select..." prepend-icon="mdi-folder-multiple" :rules="nameRules" required></v-autocomplete>
              <!-- <v-select v-model="selectStatus" :items="filestatuses" label="File Status" data-vv-name="select"
                prepend-icon="mdi-file-settings" required></v-select> -->
              <v-text-field id="fileNameTxtField" label="Document Name" v-model="documentNameTxtField"
                prepend-icon="mdi-file" :rules="nameRules" required></v-text-field>
              <v-text-field type="number" label="Folio Number" v-model="folioNumberTxtField"
                prepend-icon="mdi-file-question" :rules="numberRules" required></v-text-field>
              <input type="file"    ref="fileInput" required/>

            </v-form>
          </v-card-text>
          <div class="text-center d-flex align-center justify-end">
            <v-btn class="grey ma-2" justify-start 
              @click="adddocumentdialog = !adddocumentdialog">
              CANCEL
            </v-btn>
            <v-btn class="primary ma-2" justify-end @click="addDocumentMethod" :loading="BtnAddDocumentLoading" right :disabled="!valid">
              Add Document</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <!-- END ADD DOCUMENT MODAL -->



      <!-- START UPDATE DOCUMENT MODAL -->
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
            <v-form class="px-3" ref="updateform" v-model="valid" lazy-validation>
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

      <!-- END UPDATE DOCUMENT MODAL -->

      <!-- START DELETE DOCUMENT MODAL -->
      <v-dialog v-model="deletedocumentdialog" max-width="400">
        <v-card>
          <v-card-title class="text-center">
            <h5>DELETE</h5>

          </v-card-title>
          <v-card-text>

          </v-card-text>

          <div class="text-center d-flex align-center justify-end">
            <v-btn class=" grey ma-2" @click="deletedocumentdialog = !deletedocumentdialog">
              CANCEL
            </v-btn>
            <v-btn class="error ma-2" @click="deleteDocumentMethod" :loading="BtnDeleteDocumentLoading">
              DELETE
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- END DELETE DOCUMENT MODAL -->


      <!-- START DOCUMENT PREVIEW MODAL -->
      <v-dialog v-model="previewdocumentdialog" max-width="900" max-height="900">
        <v-card>
          <div>
          <v-card-title>DOCUMENT</v-card-title>
          <v-card-text>
            <div>
             <iframe id="pdfViewer" width="100%" height="900"  frameborder="5"></iframe> 
             <!-- <iframe :src={iframeDocSrcPreview} width="100%" height="900"  frameborder="5"></iframe>  -->
             <!-- <iframe src="public/testtest.pdf" width="100%" height="900"  frameborder="5"></iframe>  -->

             <!-- {{iframeDocSrcPreview}} -->
            </div>
          </v-card-text>
        </div>
        </v-card>
      </v-dialog>
      

      <!-- END DOCUMENT PREVIEW MODAL -->

    </v-container>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "document", // name of component view

  data() {
    return {

      iframeDocSrcPreview: null,
      name: 'PDFViewer',

      userID: null,

      // USER ROLE CONTROLLER
      newDocumentDisabled: false,

      editShowIcon: null,
      deleteShowIcon: null,

      // END USER ROLE CONTROLLER

      documentdataloading: false,

       // SWEETALERTS 
       apimessage: null,
      apistatus: null,
      apititle: null,

      // END SWEETALERTS 


      //DOCUMENT PREVIEW
      previewdocumentdialog: false,
      documenturl: null,

      //END DOCUMENT PREVIEW


      //ADD NEW DOCUMENT DATA
      // documentNameTxtField: "",
      // folioNumberTxtField: "",
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
      documentID: null,
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

      deletedocumentdialog: false,
      BtnDeleteDocumentLoading: false,

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
        { text: "ADDED BY", value: "user.name" },
        { text: "CREATED AT", value: "created_at"},
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

// END VALIDATION RULES

    };
  },

  methods: {

    async downloadFile() {
      try {
        const downloadUrl = `http://127.0.0.1:8000/api/previewDocumentRouteDownload`;
        
     
        const response = await axios.get(downloadUrl, {
          responseType: 'blob', // Ensure responseType is set to blob for file downloads
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Extract the filename from the response headers to include the file extension
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloaded_file'; // Default file name

        if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
          const regex = /filename="(.+?)"/;
          const matches = contentDisposition.match(regex);
          if (matches && matches.length > 1) {
            filename = matches[1];
          }
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading the file:', error);
        // Handle error as needed
      }
  },


  async previewFile() {
      try {
        const previewUrl = `http://127.0.0.1:8000/api/previewDocumentRoute`;

        const response = await axios.get(previewUrl, {
          responseType: 'blob', // Ensure responseType is set to blob for file content
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        this.fileContent = url;
      } catch (error) {
        console.error('Error previewing the file:', error);
        // Handle error as needed
      }
    },


    getDocumentsFromApi() { // USED
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

  FetchDeleteDocumentDetails(DocumentId) { // USED

      this.documentID = DocumentId;
      axios
        .get(`http://127.0.0.1:8000/api/getdocumentupdatedetail/${this.documentID}`)
        .then((response) => {
          if (response.status === 200) {
            this.file = response.data.Document
            this.deletedocumentdialog = true;


          }
        })

    },

    FetchDownloadDocumentDetails(DocumentId) { // USED

this.documentID = DocumentId;
axios
  .get(`http://127.0.0.1:8000/api/downloadDocumentRoute/${this.documentID}`)
  .then((response) => {
    if (response.status === 200) {

    }
  })

},
//////////////////////////////////////
///////////////////////////////////
async FetchPreviewDocumentDetails(DocumentId) {
    try {
      this.documentID = DocumentId;
      this.previewdocumentdialog = true;
      const response = await axios.get('http://127.0.0.1:8000/api/previewDocumentRoute/${this.documentID}', {
        responseType: 'blob', // Important: responseType must be set to 'blob' to handle binary data
      });
      this.iframeDocSrcPreview= URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }

  },
////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////

// FetchPreviewDocumentDetails(DocumentId) { // USED

// this.documentID = DocumentId;
// this.previewdocumentdialog = true;

// axios
//   .get(`http://127.0.0.1:8000/api/previewDocumentRoute/${this.documentID}`)
//   .then((response) => {
    
//       //this.documenturl = response.data.url;
//       // this.documenturl = response.data;

//       this.iframeDocSrcPreview = response.data.DocPathFromAPI;

//   })
//   .catch(error => {
//         console.error(error);
//       });

// },


///////////////////////////////// GPT
// async FetchPreviewDocumentDetails(DocumentId) {
//   this.documentID = DocumentId;
//   this.previewdocumentdialog = true;
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/previewDocumentRoute/${this.documentID}'); // Replace with your API endpoint
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const blob = await response.blob();
//         this.displayPDF(blob);
//       } catch (error) {
//         console.error('There has been a problem with your fetch operation:', error);
//       }
//     },
//     displayPDF(blob) {
//       const url = URL.createObjectURL(blob);
//       const iframe = this.$el.querySelector('#pdfViewer');
//       iframe.src = url;
//     },


/////////////////////////////////////// END GPT

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

    deleteDocumentMethod(DocumentId) {
      this.BtnDeleteDocumentLoading = true,
        this.DocumentID = DocumentId;
      axios 
        .delete(`http://127.0.0.1:8000/api/deleteDocumentRoute/${this.documentID}`, {

        })
        .then((response) => {
          this.SwtAlertResponse(response.data);

          if (response.status === 200) {
            this.BtnDeleteDocumentLoading = false;

            this.$swal(this.apititle,this.apimessage,this.apistatus).then(()=>{
              this.getDocumentsFromApi();
              this.deletedocumentdialog = false;
            });

          }
          else{
            this.$swal(this.apititle,this.apimessage,this.apistatus);

          }
        })
    },

    selectcorrespondencemethod() {
      axios
        .get(`http://127.0.0.1:8000/api/ListCorrespondenceRoute`)
        .then((response) => {
          if (response.status === 200) {
            var correspondences = response.data
            // console.log('steve' + correspondences);
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

 
    userRolemethodDeterminer(){
      const user = JSON.parse(sessionStorage.getItem("userdetails")) 
      this.user_role = user.role;

      if (this.user_role === 'User'){
          this.editShowIcon = false;
          this.deleteShowIcon = false;

        } 
        else{
          this.AddFileShowBtn = true;
          this.editShowIcon = true;
          this.deleteShowIcon = true;


        }


    }




  },

  mounted() {
    this.getDocumentsFromApi();
    this.selectcorrespondencemethod();
    this.selectfilemethod();
    this.getuserDetailsMethod();
    this.userRolemethodDeterminer();
    
  },
};
</script>
