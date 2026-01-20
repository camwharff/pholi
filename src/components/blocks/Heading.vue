<script setup lang="ts">
import { Search, X, UserRound, LogOut, LogIn } from 'lucide-vue-next'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from '@/components/ui/navigation-menu'
import Button from '@/components/ui/button/Button.vue'
import {
    Dialog,
    DialogTrigger
} from '@/components/ui/dialog'
import Auth from '@/components/blocks/AuthDialog.vue'
import { authHandler } from '@/lib/authHandler'
import { ref } from 'vue'
import TempAlerts from '@/components/ui/TempAlerts.vue'
import { infoHandler } from '@/lib/infoHandler'
import Input from '@/components/ui/input/Input.vue'
import logoCircleBack from '@/assets/logo-circle-back.vue'
import logoCircleFront from '@/assets/logo-circle-front.vue'

const { searchUsers } = infoHandler()

const username = ref('')
const showSignupBar = ref(true)

const { user, signOut, changeMode } = authHandler()
const searchVisible = ref(false)

function toggleSearch() {
    searchVisible.value = !searchVisible.value
}
</script>

<template>
    <div v-if="!user"
        class="absolute m-auto left-0 right-0 w-fit flex flex-row items-center py-2 px-4 rounded-b-xl gap-2 h-fit bg-white text-black text-base text-center transition-all duration-1000"
        :class="showSignupBar ? '' : '-translate-y-full'">
        New to Pholi?
        <Dialog>
            <DialogTrigger as-child>
                <a href="#" class="underline" @click.prevent="changeMode('SIGNUP')">
                    Sign up here!
                </a>
            </DialogTrigger>
            <Auth />
        </Dialog>
        <button @click.prevent="showSignupBar = false">
            <X />
        </button>
    </div>
    <logoCircleBack width="200" height="200" class=" rounded-full mx-auto z-10 absolute inset-0 inline" />
    <div
        class="z-50 relative flex w-full items-center justify-between px-20 text-center flex-row gap-18 p-8 py-0 bg-accent h-[10vh] min-h-25">
        <!-- <NavigationMenu :viewport="false" class="z-40 relative w-fit flex-initial h-full">
            <NavigationMenuList class="w-fit h-fit gap-4">
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        class="cursor-pointer bg-accent h-full hover:bg-secondary font-medium px-4 py-2 transition rounded-lg text-base flex-row flex items-center gap-1">
                        Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul class="grid w-50 gap-4">
                            <ListItem v-for="component in components" :key="component.title" :title="component.title"
                                :to="component.href">
                                {{ component.description }}
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        class="cursor-pointer bg-accent h-full hover:bg-secondary font-medium px-4 py-2 transition rounded-lg text-base flex-row flex items-center gap-1">
                        With Icon
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul class="grid w-50 gap-4">
                            <li>
                                <NavigationMenuLink as-child>
                                    <a href="#" class="flex-row items-center gap-2">
                                        <CircleHelpIcon />
                                        Backlog
                                    </a>
                                </NavigationMenuLink>
                                <NavigationMenuLink as-child>
                                    <a href="#" class="flex-row items-center gap-2">
                                        <CircleIcon />
                                        To Do
                                    </a>
                                </NavigationMenuLink>
                                <NavigationMenuLink as-child>
                                    <a href="#" class="flex-row items-center gap-2">
                                        <CircleCheckIcon />
                                        Done
                                    </a>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu> -->
        <div class="h-inherit w-fit inset-0 m-auto">
            <RouterLink to="/home" class="h-fit w-fit p-0 m-auto inset-0">
                <logoCircleFront width="200" height="200"
                    class="p-2 rounded-full mx-auto z-50 absolute inset-0 inline border-4 border-transparent border-none" />
            </RouterLink>
        </div>
        <NavigationMenu :viewport="false" class="z-40 w-fit flex-initial">
            <NavigationMenuList class="w-fit h-fit gap-4">
                <NavigationMenuItem v-if="searchVisible">
                    <Input type="search" id="userSearch" placeholder="Enter to search" name="userSearch"
                        v-model="username" @keyup.enter="searchUsers(username)" />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button v-if="username" @click.prevent="searchUsers(username)"
                        class="cursor-pointer h-[45px] aspect-square items-center flex justify-center hover:bg-secondary transition rounded-lg">
                        <Search />
                    </button>
                    <button v-else @click.prevent="toggleSearch"
                        class="cursor-pointer h-[45px] aspect-square items-center flex justify-center hover:bg-secondary transition rounded-lg">
                        <Search />
                    </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <RouterLink v-if="user" to="/account"
                        class="cursor-pointer h-[45px] aspect-square items-center flex justify-center hover:bg-secondary transition rounded-lg">
                        <UserRound />
                    </RouterLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <template v-if="user">
                        <Button
                            class="cursor-pointer h-full hover:bg-secondary px-4 py-2 transition rounded-lg text-base flex-row flex items-center gap-1"
                            @click.prevent="signOut">
                            <LogOut />
                        </Button>
                    </template>
                    <template v-else>
                        <Dialog>
                            <DialogTrigger as-child>
                                <Button
                                    class="cursor-pointer h-full hover:bg-secondary px-4 py-2 leading-none transition rounded-lg text-base flex-row flex items-center gap-1"
                                    @click.prevent="changeMode('LOGIN')">
                                    <LogIn />
                                </Button>
                            </DialogTrigger>
                            <Auth />
                        </Dialog>
                    </template>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </div>
    <TempAlerts class="m-auto w-full" />
</template>

<style scoped>
.media-display {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}
</style>