<script setup>
import { ref } from 'vue'

const applications = ref([
  {
    name: 'Finder',
    icon: 'path/to/icon.png',
  },
  {
    name: 'Terminal',
    icon: 'path/to/icon.png',
  },
  {
    name: 'Réglages Système',
    icon: 'path/to/icon.png',
  },
  {
    name: 'GitHub',
    icon: 'path/to/icon.png',
  },
  {
    name: 'Linkedin',
    icon: 'path/to/icon.png',
  },
])
</script>

<template>
  <div id="dock">
    <img
      v-for="(application, index) in applications"
      :key="index"
      :src="application.icon"
      :alt="application.name"
    />
  </div>
</template>

<style scoped>
#dock {
  position: absolute;
  left: calc(50% - 10em - 0.75em - 2em);
  bottom: 1em;
  border-radius: 3vh;
  display: flex;
  justify-content: center;
  gap: 1em;
  padding: 0.75em;
  background-color: rgba(231, 231, 231, 0.43);
}
img {
  height: 4em;
  width: 4em;
  border-radius: 2vh;
}
</style>
