<script setup lang="ts">
import MediaPlayer from '@/components/media/MediaPlayer.vue'
defineProps<{ src: string; alt?: string; cover?: string }>()
</script>

<template>
    <MediaPlayer :src="src" :cover="cover" type="audio" />
</template>
