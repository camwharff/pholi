<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import type { ChartConfig } from '@/components/ui/chart'
import { VisGroupedBar, VisXYContainer } from '@unovis/vue'
import {
    ChartContainer,
    ChartCrosshair,
    ChartTooltip,
    ChartTooltipContent,
    componentToString,
} from '@/components/ui/chart'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from '@/components/ui/sidebar'

const chartData = [
    { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
    { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
    { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
]
type Data = (typeof chartData)[number]

const chartConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

const themes = ['blue', 'root', 'dark']
const currentTheme = ref(document.documentElement.classList.contains('root') ? 'root' : 'blue')

function applyTheme(theme: string) {
    themes.forEach(t => document.documentElement.classList.remove(t))
    document.documentElement.classList.add(theme)
    currentTheme.value = theme
}

import Heading from '@/components/blocks/admin/Heading.vue'
</script>

<template>
    <Heading />
    <div class="flex flex-row">
        <SidebarProvider class="w-1/5 m-4 h-min">
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg">
                                <div
                                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd class="size-4" />
                                </div>
                                <div class="grid flex-1 text-left text-sm leading-tight">
                                    <span class="truncate font-semibold">Acme Inc</span>
                                    <span class="truncate text-xs">Enterprise</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <label for="themes">Choose Theme:</label>
                                    <select id="themes" :value="currentTheme"
                                        @change="(e) => applyTheme((e.target as HTMLSelectElement).value)">
                                        <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
                                    </select>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton as-child>
                                        <RouterLink to="/home">Go home</RouterLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter />
                <SidebarRail />
            </Sidebar>
        </SidebarProvider>

        <div class="grid grid-cols-4 gap-4 m-4 auto-rows-min">
            <Card class="w-full p-4 h-min bg-accent text-primary-foreground">
                <CardTitle>Primary</CardTitle>
                <CardContent>This card follows the selected theme</CardContent>
            </Card>

            <Card class="w-full p-4 h-min bg-secondary text-secondary-foreground">
                <CardTitle>Secondary</CardTitle>
                <CardContent>This card follows the selected theme</CardContent>
            </Card>

            <Card class="w-full p-4 h-min bg-muted text-muted-foreground">
                <CardTitle>Muted</CardTitle>
                <CardContent>This card follows the selected theme</CardContent>
            </Card>

            <Card class="w-full p-4 h-min bg-accent text-accent-foreground">
                <CardTitle>Accent</CardTitle>
                <CardContent>This card follows the selected theme</CardContent>
            </Card>

            <Card class="w-full p-4 h-min">
                <CardTitle>Chart</CardTitle>
                <CardContent>
                    <ChartContainer :config="chartConfig" class="h-full w-full">
                        <VisXYContainer :data="chartData">
                            <VisGroupedBar :x="(d: Data) => d.date" :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
                                :color="[chartConfig.desktop.color, chartConfig.mobile.color]" />
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(chartConfig, ChartTooltipContent, {
                                labelFormatter(d) {
                                    return new Date(d).toLocaleDateString('en-US', { month: 'long' })
                                },
                            })" :color="[chartConfig.desktop.color, chartConfig.mobile.color]" />
                        </VisXYContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min bg-accent text-primary-foreground">
                <CardHeader>
                    <CardTitle>Popover with Inputs</CardTitle>
                    <CardDescription>
                        Popover contains form controls
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline">Open Popover</Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-80">
                            <div class="grid gap-4">
                                <div class="space-y-2">
                                    <h4 class="font-medium leading-none">Dimensions</h4>
                                    <p class="text-sm text-muted-foreground">
                                        Set the dimensions for the layer.
                                    </p>
                                </div>
                                <div class="grid gap-2">
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="width">Width</Label>
                                        <Input id="width" placeholder="100%" class="col-span-2 h-8" />
                                    </div>
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="maxWidth">Max Width</Label>
                                        <Input id="maxWidth" placeholder="300px" class="col-span-2 h-8" />
                                    </div>
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="height">Height</Label>
                                        <Input id="height" placeholder="25px" class="col-span-2 h-8" />
                                    </div>
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="maxHeight">Max Height</Label>
                                        <Input id="maxHeight" placeholder="none" class="col-span-2 h-8" />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>

            <Card class="w-full p-4 h-min bg-secondary text-secondary-foreground">
                <CardHeader>
                    <CardTitle>Form Card</CardTitle>
                    <CardDescription>
                        Card contains an input and button
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="grid w-full items-center gap-4">
                        <div class="flex flex-col space-y-2">
                            <div class="flex items-center justify-between">
                                <Label for="email">Email</Label>
                                <a href="#" class="text-sm underline">Help</a>
                            </div>
                            <Input id="email" type="email" placeholder="m@example.com" class="h-10" />
                        </div>
                    </form>
                </CardContent>
                <CardFooter class="flex flex-col gap-2">
                    <Button class="w-full">Submit</Button>
                    <Button variant="outline" class="w-full">Cancel</Button>
                </CardFooter>
            </Card>

        </div>
    </div>

</template>