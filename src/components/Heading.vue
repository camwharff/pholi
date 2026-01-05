<script setup lang="ts">
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-vue-next'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from './ui/navigation-menu'
import { default as ListItem } from './ui/navigation-menu/NavigationMenuItem.vue'
import Auth from './blocks/AuthBtn.vue'

const components: { title: string, href: string, description: string }[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description:
            'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
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
    <div
        class="flex w-full align-middle justify-between px-20 text-center flex-row gap-18 p-8 py-0 bg-sky-950 h-[10vh] min-h-25">
        <h1 class="p-0 my-auto mx-0">Pholi</h1>
        <NavigationMenu :viewport="false" class="z-50">
            <NavigationMenuList>
                <NavigationMenuItem class="hover:bg-sky-700">
                    <Auth />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul class="grid gap-2 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                            <li class="row-span-3">
                                <NavigationMenuLink as-child>
                                    <a class="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                        href="/">
                                        <div class="mt-4 mb-2 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p class="text-muted-foreground text-sm leading-tight">
                                            Beautifully designed components built with Tailwind CSS.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem to="/docs" title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </ListItem>
                            <ListItem to="/docs/installation" title="Installation">
                                How to install dependencies and structure your app.
                            </ListItem>
                            <ListItem to="/docs/primitives/typography" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul class="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                            <ListItem v-for="component in components" :key="component.title" :title="component.title"
                                :to="component.href">
                                {{ component.description }}
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>List</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul class="grid w-75 gap-4">
                            <li>
                                <NavigationMenuLink as-child>
                                    <a href="#">
                                        <div class="font-medium">Components</div>
                                        <div class="text-muted-foreground">
                                            Browse all components in the library.
                                        </div>
                                    </a>
                                </NavigationMenuLink>
                                <NavigationMenuLink as-child>
                                    <a href="#">
                                        <div class="font-medium">Documentation</div>
                                        <div class="text-muted-foreground">
                                            Learn how to use the library.
                                        </div>
                                    </a>
                                </NavigationMenuLink>
                                <NavigationMenuLink as-child>
                                    <a href="#">
                                        <div class="font-medium">Blog</div>
                                        <div class="text-muted-foreground">
                                            Read our latest blog posts.
                                        </div>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul class="grid w-50 gap-4">
                            <li>
                                <NavigationMenuLink as-child>
                                    <a href="#">Components</a>
                                </NavigationMenuLink>
                                <NavigationMenuLink as-child>
                                    <a href="#">Documentation</a>
                                </NavigationMenuLink>
                                <NavigationMenuLink as-child>
                                    <a href="#">Blocks</a>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
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
        </NavigationMenu>
    </div>
</template>

<style scoped>
.media-display {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}
</style>