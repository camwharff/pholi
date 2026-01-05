<script setup lang="ts">
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, UserRoundSearch, X } from 'lucide-vue-next'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from './ui/navigation-menu'
import Button from './ui/button/Button.vue'
import {
    Dialog,
    DialogTrigger
} from './ui/dialog'
import { default as ListItem } from './ui/navigation-menu/NavigationMenuItem.vue'
import Auth from './blocks/AuthDialog.vue'
import { authHandler } from '@/lib/authHandler'
import { ref } from 'vue'
import TempAlerts from './blocks/TempAlerts.vue'
import { infoHandler } from '@/lib/infoHandler'
import Input from './ui/input/Input.vue'

const { searchUsers } = infoHandler()

const username = ref('')
const showSignupBar = ref(true)

const { user, signOut, changeMode } = authHandler()
const searchVisible = ref(false)

function toggleSearch() {
    searchVisible.value = !searchVisible.value
}

const components: { title: string, href: string, description: string }[] = [
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
]
</script>

<template>
    <div v-if="!user" class="absolute m-auto left-0 right-0 w-fit flex flex-row items-center py-2 px-4 rounded-b-xl gap-2 h-fit bg-white text-black text-base text-center transition-all duration-1000" :class="showSignupBar ? '' : '-translate-y-full'">
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
    <div
        class="flex w-full align-middle justify-between px-20 text-center flex-row gap-18 p-8 py-0 bg-sky-950 h-[10vh] min-h-25">
        <RouterLink to="/home" class="p-0 my-auto mx-0">
            <h1 class="p-0 m-0">Pholi</h1>
        </RouterLink>
        <NavigationMenu :viewport="false" class="z-50 w-fit flex-initial">
            <NavigationMenuList class="w-fit h-fit gap-4">
                <NavigationMenuItem v-if="searchVisible">
                    <Input type="search" id="userSearch" placeholder="Enter to search" name="userSearch"
                        v-model="username" @keyup.enter="searchUsers(username)" />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button v-if="username" @click.prevent="searchUsers(username)"
                        class="cursor-pointer h-[45px] aspect-square items-center flex justify-center bg-sky-900 hover:bg-sky-700 transition rounded-xl">
                        <p>
                            <UserRoundSearch />
                        </p>
                    </button>
                    <button v-else @click.prevent="toggleSearch"
                        class="cursor-pointer h-[45px] aspect-square items-center flex justify-center bg-sky-900 hover:bg-sky-700 transition rounded-xl">
                        <p>
                            <UserRoundSearch />
                        </p>
                    </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        class="cursor-pointer bg-sky-900 h-full hover:bg-sky-700 font-medium px-4 py-2 transition rounded-xl text-base flex-row flex items-center gap-1">
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
                        class="cursor-pointer bg-sky-900 h-full hover:bg-sky-700 font-medium px-4 py-2 transition rounded-xl text-base flex-row flex items-center gap-1">
                        With Icon</NavigationMenuTrigger>
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
                <NavigationMenuItem>
                    <template v-if="user">
                        <Button
                            class="cursor-pointer bg-sky-900 h-full hover:bg-sky-700 px-4 py-2 transition rounded-xl text-base flex-row flex items-center gap-1"
                            @click.prevent="signOut">
                            Log Out
                        </Button>
                    </template>
                    <template v-else>
                        <Dialog>
                            <DialogTrigger as-child>
                                <Button
                                    class="cursor-pointer h-full bg-sky-900 hover:bg-sky-700 px-4 py-2 leading-none transition rounded-xl text-base flex-row flex items-center gap-1"
                                    @click.prevent="changeMode('LOGIN')">
                                    Log In
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