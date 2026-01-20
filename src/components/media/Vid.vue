<script setup lang="ts">
import MediaPlayer from './MediaPlayer.vue'
defineProps<{ src: string; alt?: string }>()
</script>

<template>
    <MediaPlayer :src="src" type="video"/>
</template>