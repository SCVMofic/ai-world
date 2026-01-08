<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Global resets using variables */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  transition:
    background-color 0.3s,
    color 0.3s;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
