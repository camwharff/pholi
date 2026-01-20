<script setup lang="ts">
import MediaPlayer from '@/components/media/MediaPlayer.vue'
defineProps<{ src: string; alt?: string }>()
</script>

<template>
    <MediaPlayer :src="src" type="video"/>
</template>