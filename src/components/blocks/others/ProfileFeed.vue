<script setup lang="ts">
    import { postHandler } from '@/lib/postHandler'
    
    const { posts, viewPost } = postHandler()
    
    </script>
    
    <template>
        <div class=" p-8 gap-4 grid grid-cols-4 w-3/4">
            <div v-for="post in posts" :key="post.id"
                class="bg-accent border-4 border-secondary relative transition-all aspect-square rounded-3xl p-4 flex flex-col gap-4 w-full overflow-hidden"
                @mouseover="viewPost(post, true)" @mouseleave="viewPost(post, false)">
                <img v-if="post.src" :src="post.src"
                    class="border-4 border-secondary rounded-3xl object-cover h-full w-full" />
            </div>
        </div>
    </template>