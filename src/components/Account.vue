<script setup lang="ts">
import { ref } from 'vue'
import AccountInfoEdit from './blocks/AccountInfoEdit.vue'
import AccountInfoDisplay from './blocks/AccountInfoDisplay.vue'
import AccountMedia from './blocks/AccountMedia.vue'
import Heading from './Heading.vue'
import ManageMedia from './blocks/ManageMedia.vue'
import { onMounted } from 'vue'
import { mediaHandler } from '@/lib/mediaHandler'
import { infoHandler } from '@/lib/infoHandler'
import { authHandler } from '@/lib/authHandler'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import EditPholi from './blocks/EditPholi.vue'
import Button from './ui/button/Button.vue'

const { loadMedia } = mediaHandler()
const { getProfile } = infoHandler()
const { user, signOut } = authHandler()

onMounted(async () => {
    if (user.value) {
        await loadMedia()
        await getProfile()
    } else {
        signOut()
    }
})

const editInfo = ref(false)
const editPholi = ref(false)

async function toggleEdit() {
    editInfo.value = !editInfo.value
}

async function editPholiOn() {
    editPholi.value = true
}

async function savePholi() {
    editPholi.value = false
}

</script>

<template>
    <Heading />
    <div class="flex h-fit">
        <Tabs default-value="profile" class="basis-1/4 flex-col flex m-4 h-full w-full gap-4 items-center">
            <TabsList>
                <TabsTrigger value="profile" @click.prevent="savePholi">
                    Profile
                </TabsTrigger>
                <TabsTrigger value="media" @click.prevent="editPholiOn">
                    Manage Media
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <div class="flex flex-row">
                    <div class="flex flex-col items-center gap-4">
                        <div v-if="editInfo">
                            <AccountInfoEdit />
                        </div>
                        <div v-else>
                            <AccountInfoDisplay />
                        </div>
                        <div class="flex flex-row gap-4 ">
                            <Button @click.prevent="toggleEdit">
                                Edit info
                            </Button>
                            <Button @click.prevent="signOut">
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="media" class="w-full">
                <ManageMedia />
            </TabsContent>
        </Tabs>

        <Tabs default-value="pholi" class="basis-3/4 flex-col flex m-4 h-fit w-full gap-4 items-center">
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
                <AccountMedia class="w-full h-fit" />
            </TabsContent>
        </Tabs>

    </div>
</template>
