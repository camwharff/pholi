<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
    <div class="flex items-center justify-center">
        <p>{{ text }}</p>
    </div>
</template>