<script setup lang="ts">
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-vue-next'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
// eslint-disable-next-line import/no-named-default
import { default as ListItem } from '@/components/ui/navigation-menu/NavigationMenuItem.vue'

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
    <div class="bg-accent min-h-screen">
        <div class="flex w-fit min-w-[10vw] align-middle text-center flex-col py-8 h-full gap-8">
            <h1 class="mx-auto">Pholi</h1>
            <NavigationMenu :viewport="false">
                <NavigationMenuList class="flex-col h-fit w-full gap-2">
                    <NavigationMenuItem class="w-full flex-row">
                        <NavigationMenuTrigger class="bg-secondary w-full rounded-none">Home</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul class="flex flex-row gap-2">
                                <li>
                                    <NavigationMenuLink as-child>
                                        plonk
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
                    <NavigationMenuItem class="w-full">
                        <NavigationMenuTrigger class="bg-secondary w-full rounded-none">Components</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul class="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                                <ListItem v-for="component in components" :key="component.title"
                                    :title="component.title" :to="component.href">
                                    {{ component.description }}
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem class="w-full">
                        <NavigationMenuLink as-child class="w-full bg-secondary rounded-none">
                            <a href="/docs">Docs</a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem class="w-full">
                        <NavigationMenuTrigger class="bg-secondary w-full rounded-none">List</NavigationMenuTrigger>
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
                    <NavigationMenuItem class="w-full">
                        <NavigationMenuTrigger class="bg-secondary w-full rounded-none">Simple</NavigationMenuTrigger>
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
                    <NavigationMenuItem class="w-full">
                        <NavigationMenuTrigger class="bg-secondary w-full rounded-none">With Icon</NavigationMenuTrigger>
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
    </div>
</template>

<style scoped>
.media-display {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}
div {
    width: 100%;
}
</style>