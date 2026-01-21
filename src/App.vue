<script setup lang="ts">
import { onMounted } from 'vue'
import Footer from '@/components/blocks/admin/Footer.vue'
import Heading from '@/components/blocks/admin/Heading.vue'

onMounted(() => {
  document.documentElement.classList.remove('root')
  document.documentElement.classList.add('blue')
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <div class="grow" >
      <Heading />
      <router-view :key="$route.fullPath"/>
    </div>
    <Footer />
  </div>
</template>
