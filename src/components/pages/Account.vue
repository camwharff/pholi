<script setup lang="ts">
import { ref, watch } from 'vue'
import AccountInfoEdit from '@/components/blocks/AccountInfoEdit.vue'
import AccountInfoDisplay from '@/components/blocks/AccountInfoDisplay.vue'
import AccountMedia from '@/components/blocks/AccountMedia.vue'
import AccountFeed from '@/components/blocks/AccountFeed.vue'
import ManageMedia from '@/components/blocks/ManageMedia.vue'
import AddPost from '@/components/blocks/AddPost.vue'
import ViewedPost from '@/components/blocks/ViewedPost.vue'
import { onMounted } from 'vue'
import { mediaHandler } from '@/lib/mediaHandler'
import { infoHandler } from '@/lib/infoHandler'
import { authHandler } from '@/lib/authHandler'
import { postHandler } from '@/lib/postHandler'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import EditPholi from '@/components/blocks/EditPholi.vue'
import Button from '@/components/ui/button/Button.vue'
const { loadPosts, postViewable } = postHandler()
const { loadMedia } = mediaHandler()
const { getProfile } = infoHandler()
const { user, signOut } = authHandler()
const infoTab = ref<'profile' | 'media' | 'post'>('profile')
const displayTab = ref<'pholi' | 'feed'>('pholi')

watch(infoTab, (value) => {
    if (value === 'profile'){
        editPholi.value = false
    } else if (value === 'media') {
        displayTab.value = 'pholi'
        editPholi.value = true
    } else {
        displayTab.value = 'feed'
        editPholi.value = false
    }
})

onMounted(async () => {
    if (user.value) {
        await loadPosts()
        await loadMedia()
        await getProfile()
    } else {
        signOut()
    }
})

const editInfo = ref(false)
const editPholi = ref(false)

</script>

<template>
    <div class="flex h-fit">
        <Tabs v-model="infoTab" default-value="profile" class="basis-1/5 flex-col flex m-4 h-full w-full gap-4 items-center">
            <TabsList>
                <TabsTrigger value="profile">
                    Profile
                </TabsTrigger>
                <TabsTrigger value="media">
                    Manage Media
                </TabsTrigger>
                <TabsTrigger value="post">
                    Add Post
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <div v-if="postViewable">
                    <ViewedPost />
                </div>
                <div v-else class="flex flex-row">
                    <div class="flex flex-col items-center gap-4">
                        <div class="flex flex-row gap-4 ">
                            <Button v-if="editInfo" @click.prevent="editInfo = false">
                                Close Editor
                            </Button>
                            <Button @click.prevent="editInfo = true" v-else>
                                Edit Info
                            </Button>
                            <Button @click.prevent="signOut">
                                Sign Out
                            </Button>
                        </div>
                        <div v-if="editInfo">
                            <AccountInfoEdit />
                        </div>
                        <div v-else>
                            <AccountInfoDisplay />
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="media" class="w-full">
                <ManageMedia />
            </TabsContent>
            <TabsContent value="post" class="w-full">
                <AddPost />
            </TabsContent>
        </Tabs>

        <Tabs v-model="displayTab" default-value="pholi" class="basis-3/4 flex-col flex m-4 h-fit w-full gap-4 items-center">
            <TabsList>
                <TabsTrigger value="pholi">
                    Pholi
                </TabsTrigger>
                <TabsTrigger value="feed">
                    Feed
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pholi" class="w-full">
                <div v-if="editPholi">
                    <EditPholi class="w-full h-fit" />
                </div>
                <div v-else>
                    <AccountMedia class="w-full h-fit" />
                </div>
            </TabsContent>
            <TabsContent value="feed" class="w-full">
                <AccountFeed class="w-full h-fit" />
            </TabsContent>
        </Tabs>

    </div>
</template>
