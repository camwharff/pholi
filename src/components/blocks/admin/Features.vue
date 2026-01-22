<script setup lang="ts">
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

const items = [
    { id: 2, title: 'Discovery Feed', content: 'The discovery feed will prioritize work from creators and organizers in your area, so that you can meet collaborators and strengthen community within your local ecosystem.' },
    { id: 3, title: 'Process and Progress Posts', content: 'Creators are encouraged share in-progress and experimental work on their progress page, allowing you to showcase your creative process in addition to finished work.' },
    { id: 4, title: 'Community Pools', content: 'Creators can form and join community pools, where you can post relevant work and meet other artists for discussion, critique, and collaboration.' },
    { id: 5, title: 'Jobs and Projects Board', content: 'Looking for collaborators? Creators can post and discover creative jobs, commissions, and projects.' },
    { id: 6, title: 'Sales Listings', content: 'Creators can post commissions and sales on their page, and facilitate sales from their Pholi account.' }
]
</script>

<template>
    <div class="mb-16 w-full flex flex-col items-center">
        <p class="text-7xl font-medium leading-tight mb-8">Hold Tight, More Coming Soon!</p>
        <Carousel class="w-4/5 lg:w-2/3 " :opts="{
            loop: true,
            align: 'start',
        }">
            <CarouselContent>
                <CarouselItem v-for="item in items" :key="item.id"
                    class="flex items-center w-full justify-center align-middle">
                    <div
                        class=" border-sky-700 border-2 items-center flex flex-col gap-4 px-32 pb-16 h-fit w-fit justify-center text-white bg-sky-950/90 p-4 rounded-2xl">
                        <div class="flex flex-col text-center gap-4 m-auto w-full">
                            <h1 class=" text-5xl lg:text-7xl font-bold">{{ item.title }}</h1>
                            <p class="lg:text-xl text-3xl">{{ item.content }}</p>
                        </div>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
</template>