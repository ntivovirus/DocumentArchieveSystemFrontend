<template>
  <v-app class="grey lighten-4">
    <Navbar/>
    <v-main class="mx-1 mb-1">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'; //Importing the Navbar component

export default {
  name: 'App',

  components: { Navbar}, // registering the Navbar component

  data: () => ({
    //
  }),
};
</script>
