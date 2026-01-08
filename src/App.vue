<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Global resets or base styles can go here if not in main.css */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #0d1117; /* Dark theme default */
  color: #c9d1d9;
  overflow: hidden; /* Prevent scroll on full screen app */
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
