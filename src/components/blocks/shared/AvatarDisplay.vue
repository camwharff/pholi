<script setup lang="ts">
import { onMounted } from 'vue';

const prop = defineProps(['src'])
onMounted(() => {
    console.log(prop.src)
})
</script>

<template>
    <div class="flex flex-col items-center w-full h-full">
        <div class="aspect-square overflow-hidden w-full">
            <img :src="src" alt="Avatar"
                class="w-full h-full avatar image rounded-3xl border-accent border-4 object-cover" />
        </div>
    </div>
</template>