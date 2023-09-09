<template>
  <div class="HomeView">
    <v-container fluid>
      <v-row>
        <v-col>
              <v-card
                        class="mx-auto"
                        max-width="400"
                        :loading="usercountLoading"
                      >
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title class="text-h5">
                              Users
                            </v-list-item-title>
                            <v-list-item-subtitle>Number of users</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>

                        <v-card-text>
                          <v-row align="center">
                            <v-col
                              class="text-h2"
                              cols="6"
                            >
                              <!-- 23&deg;C -->
                              {{this.usercount}}
                            </v-col>
                            <v-col cols="6">
                              <v-icon
                                
                                alt=""
                                width="150"
                                x-large
                                color="blue"
                              > mdi-account-group-outline
                            </v-icon>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <!-- <v-divider></v-divider> -->
                        
                </v-card>
                </v-col>
                <v-col>
                <v-card
                        class="mx-auto"
                        max-width="400"
                        :loading="documentcountLoading"
                      >
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title class="text-h5">
                              Documents
                            </v-list-item-title>
                            <v-list-item-subtitle>Number of documents</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>

                        <v-card-text>
                          <v-row align="center">
                            <v-col
                              class="text-h2"
                              cols="6"
                            >
                              <!-- 23&deg;C -->
                              {{this.documentcount}}
                            </v-col>
                            <v-col cols="6">
                              <v-icon
                                
                                alt=""
                                width="150" 
                                x-large
                                color="blue"
                              > mdi-file
                            </v-icon>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <!-- <v-divider></v-divider> -->
                        
                </v-card>
              </v-col>

              <v-col>
                <v-card
                        class="mx-auto"
                        max-width="400"
                        :loading="filecountLoading"
                      >
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title class="text-h5">
                              Files
                            </v-list-item-title>
                            <v-list-item-subtitle>Number of files</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>

                        <v-card-text>
                          <v-row align="center">
                            <v-col
                              class="text-h2"
                              cols="6"
                            >
                              <!-- 23&deg;C -->
                              {{this.filecount}}
                            </v-col>
                            <v-col cols="6">
                              <v-icon
                                
                                alt=""
                                width="150" 
                                x-large
                                color="blue"
                              >mdi-folder-multiple
                            </v-icon>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <!-- <v-divider></v-divider> -->
                        
                </v-card>
              </v-col>

              <v-col>
                <v-card
                        class="mx-auto"
                        max-width="400"
                        :loading="correspondencecountLoading"
                      >
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title class="text-h5">
                              Correspondences
                            </v-list-item-title>
                            <v-list-item-subtitle>Number of correspondences</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>

                        <v-card-text>
                          <v-row align="center">
                            <v-col
                              class="text-h2"
                              cols="6"
                            >
                              <!-- 23&deg;C -->
                              {{this.correspondencecount}}
                            </v-col>
                            <v-col cols="6">
                              <v-icon
                                
                                alt=""
                                width="150" 
                                x-large
                                color="blue"
                              > mdi-group
                            </v-icon>
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <!-- <v-divider></v-divider> -->
                        
                </v-card>
             </v-col>
      </v-row>
    </v-container> 
  </div>
</template>

<script>
import axios from "axios";
  export default {
  name: "home", // name of component view

  data() {
    return {
      usercount: 0,
      usercountLoading: false,

      correspondencecount: 0,
      correspondencecountLoading: false,

      filecount: 0,
      filecountLoading: false,

      documentcount: 0,
      documentcountLoading: false,

    }
  },
  methods: {

    countUsersMethod() {
      this.usercountLoading= true;
      axios
        .get("http://127.0.0.1:8000/api/countUsersRoute")
        .then((response) => {
          if (response.status === 200) {
            this.usercount = response.data; 
           this.usercountLoading= false;


          } else {
            alert("Error Loading data");
          }
        });

    },

    countDocumentsMethod() {
      this.documentcountLoading= true;
      axios
        .get("http://127.0.0.1:8000/api/countDocumentsRoute")
        .then((response) => {
          if (response.status === 200) {
            this.documentcount = response.data; 
            this.documentcountLoading= false;


          } else {
            alert("Error Loading data");
          }
        });

    },

    countFilesMethod() {
      this.filecountLoading= true;
      axios
        .get("http://127.0.0.1:8000/api/countFilesRoute")
        .then((response) => {
          if (response.status === 200) {
            this.filecount = response.data; 
            this.filecountLoading= false;


          } else {
            alert("Error Loading data");
          }
        });

    },

    countCorrespondencesMethod() {
      this.correspondencecountLoading= true;
      axios
        .get("http://127.0.0.1:8000/api/countCorrespondencesRoute")
        .then((response) => {
          if (response.status === 200) {
            this.correspondencecount = response.data; 
            this.correspondencecountLoading= false;


          } else {
            alert("Error Loading data");
          }
        });

    }

    

  },
  mounted() {
    this.countUsersMethod();
    this.countDocumentsMethod();
    this.countFilesMethod();
    this.countCorrespondencesMethod();




  },
   
  }
</script>
