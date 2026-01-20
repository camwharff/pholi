<script setup lang="ts">
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

</script>


<template>
    <div class="mb-16 relative z-0 flex flex-col w-full lg:w-2/3  align-middle m-auto text-center items-center">
        <p class="text-7xl font-medium leading-tight mt-4">Join Pholi Today!</p>
        <Carousel class="w-full mt-8" :opts="{
            loop: true,
            align: 'start',
        }">
            <CarouselContent>
                <CarouselItem 
                    class="flex items-center w-full justify-center align-middle">
                    <img src="@/assets/pholi-demo.png" class="rounded-3xl border-4 border-background " />
                </CarouselItem>
                <CarouselItem 
                    class="flex items-center w-full justify-center align-middle">
                    <img src="@/assets/pholi-demo.png" class="rounded-3xl border-4 border-background " />
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        <p class="w-full text-3xl lg:text-xl mt-4">
            Pholi is a portfolio hosting and collaboration platform designed by creatives for creatives. Show off your
            work
            like never before, meet your next collaborators, and build your unique community.
            <br/><br/>
            Current 
            <br/><br/>
            <b>Please note: Pholi is current in beta testing, so things will be changing rapidly and we will be asking for your feedback. </b>
        </p>
    </div>
</template>