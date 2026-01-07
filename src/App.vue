<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  document.documentElement.classList.remove('root')
  document.documentElement.classList.add('blue')
})
</script>

<template>
  <router-view />
</template>
