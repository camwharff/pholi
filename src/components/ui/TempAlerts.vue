<script setup lang="ts">
import {
    Alert,
    AlertTitle,
} from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-vue-next';
import { uiHandler } from '@/lib/uiHandler'

const { alerts } = uiHandler()

</script>

<template>
    <div class="z-50">
        <div class="m-auto left-0 right-0 absolute w-fit">
            <ul class="m-2 flex flex-col gap-2 w-full">
                <li v-for="alert in alerts" :key="alert.id" class="z-50 *:transition-all duration-300" :class="alert.visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'">
                    <Alert>
                        <AlertCircleIcon />
                        <AlertTitle>{{ alert.message }}</AlertTitle>
                    </Alert>
                </li>
            </ul>
        </div>
    </div>
</template>
