<template>
  <div>
  <nav>
    <v-app-bar flat app>
      <!-- <v-toolbar-side-icon  @click="drawerSteve = !drawerSteve"></v-toolbar-side-icon> -->
      <v-toolbar-title class="text-uppercase grey--text" >
        <v-app-bar-nav-icon @click="drawerSteve = !drawerSteve"></v-app-bar-nav-icon>
        <span class="font-weight-light">Archive </span>
        <span>Management System</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="mr-2">
      <v-badge
      bordered
        color="green"
        icon="mdi-account"
        overlap
      >
      <div> <span class=" font-weight-bold text-lowercase blue--text mr-4 text-caption">{{this.username}}</span></div>
    </v-badge>
  </div>
    <v-divider
      class="mx-2"
      vertical
    ></v-divider>
    
      <v-btn text color="grey" outlined rounded small  @click="logoutmethod()">
        <v-divider
      class="mx-2"
      vertical
    ></v-divider><span>  Log~Out</span>
        <v-icon color="warning" right>mdi-exit-to-app</v-icon>
      </v-btn>
    
    </v-app-bar>

    <v-navigation-drawer app class="indigo" v-model="drawerSteve">
      <div class="d-flex mt-4 mb-5 justify-center" >
          <v-avatar size="150">
            <img
            src="/Malawi-Gov.png" alt="Blantyre District Council Emblem"> 
          </v-avatar>
          <!-- <pm class=" subheading grey--text">Blantyre District Council</pm> --> 
      </div>
    <!-- new menu list-->
        <v-list nav shaped>
          <v-list-item class="white--text text--lighten-4 font-weight-black" v-for="link in links" :key="link.text" router :to="link.route" >
            <v-list-item-icon>
              <v-icon >{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title >{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        <!-- </v-list-item-group> -->
      </v-list>
      <!-- end new menu list -->

      <!-- OLD WAY 1 -->
      <!-- <v-list >
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route" >
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text" >{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
      <!-- END OLD WAY 1 -->

      <!-- OLD WAY -->
      <!-- <v-list >
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route" >
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text" >{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
      <!-- END OLD WAY -->
    </v-navigation-drawer>
  </nav>
  <router-view />
</div>
</template>

<script>
export default {
  data () {
    return {
    drawerSteve : true,

    username : null,

    //selectedItem: 1,
    links : [
      {text: 'Dashboard', icon: 'mdi-view-dashboard',  route:'/'},
      {text: 'Correspondences', icon: 'mdi-group', route: '/correspondence'}, 
      {text: 'Files', icon: 'mdi-folder-multiple', route: '/file'},
      {text: 'Documents', icon: 'mdi-file', route: '/document'},
      {text: 'Users', icon: 'mdi-account-group', route: '/user'},
      {text: 'User Settings', icon: 'mdi-account-settings', route: '/usersetting'},
    ]

    // steve : (const token = sessionStorage.getItem('api_token'));

    }
  },
  methods: {

    getuserDetailsMethod(){
      // this.username = sessionStorage.getItem("userdetails"); // WORKING LINK

              // Retrieve the JSON string from Session Storage
        const storedUser = sessionStorage.getItem("userdetails");

        // Parse the JSON string back to an object
        const user = storedUser ? JSON.parse(storedUser) : null;

        // Access the 'username' property
        this.username = user ? user.email : null; 
         

        // console.log(username); // Output: 'john_doe'


      


    },

    logoutmethod(){
      // sessionStorage.removeItem('api_token'); // removing single session storage
      sessionStorage.clear(); // removing all session storage

      this.$router.push({path: 'login'});

    }


  },
  mounted () {

    this.getuserDetailsMethod(); 

  }
}

</script>