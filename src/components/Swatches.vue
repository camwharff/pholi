<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Card,
    CardAction,
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
];
type Data = (typeof chartData)[number]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

import { ref } from 'vue'

const isDark = ref(document.documentElement.classList.contains('blue'))

function setMode() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('blue', isDark.value)
}
</script>

<template>
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
                                    <SidebarMenuButton as-child>
                                        <a href="#" @click.prevent="setMode">
                                            <Home />
                                            <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
                                        </a>
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
            <Card class="w-full p-4 h-min bg-primary text-primary-foreground">
                <CardTitle>
                    Primary
                </CardTitle>
                <CardContent>
                    this is what primary colors look like
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min bg-secondary text-secondary-foreground">
                <CardTitle>
                    Secondary
                </CardTitle>
                <CardContent>
                    this is what secondary colors look like
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min bg-muted text-muted-foreground">
                <CardTitle>
                    Muted
                </CardTitle>
                <CardContent>
                    this is what muted colors look like
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min bg-accent text-accent-foreground">
                <CardTitle>
                    Accent
                </CardTitle>
                <CardContent>
                    this is what accent colors look like
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min">
                <CardTitle>
                    Chart
                </CardTitle>
                <CardContent>
                    <ChartContainer :config="chartConfig" class="h-full w-full">
                        <VisXYContainer :data="chartData">
                            <VisGroupedBar :x="(d: Data) => d.date" :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
                                :color="[chartConfig.desktop.color, chartConfig.mobile.color]" />
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(chartConfig, ChartTooltipContent, {
                                labelFormatter(d) {
                                    return new Date(d).toLocaleDateString('en-US', {
                                        month: 'long',
                                    });
                                },
                            })
                                " :color="[chartConfig.desktop.color, chartConfig.mobile.color]" />
                        </VisXYContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min">
                <CardTitle>
                    Popover
                </CardTitle>
                <CardContent>
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline">
                                Open popover
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-80">
                            <div class="grid gap-4">
                                <div class="space-y-2">
                                    <h4 class="font-medium leading-none">
                                        Dimensions
                                    </h4>
                                    <p class="text-sm text-muted-foreground">
                                        Set the dimensions for the layer.
                                    </p>
                                </div>
                                <div class="grid gap-2">
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="width">Width</Label>
                                        <Input id="width" default-value="100%" class="col-span-2 h-8" />
                                    </div>
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="maxWidth">Max. width</Label>
                                        <Input id="maxWidth" default-value="300px" class="col-span-2 h-8" />
                                    </div>
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="height">Height</Label>
                                        <Input id="height" default-value="25px" class="col-span-2 h-8" />
                                    </div>
                                    <div class="grid grid-cols-3 items-center gap-4">
                                        <Label for="maxHeight">Max. height</Label>
                                        <Input id="maxHeight" default-value="none" class="col-span-2 h-8" />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>
            <Card class="w-full p-4 h-min">
                <CardHeader>
                    <CardTitle>Default Card + Input and Button</CardTitle>
                    <CardDescription>
                        Card Description
                    </CardDescription>
                    <CardAction>
                        <Button variant="link">
                            Button, link variant
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div class="grid w-full items-center gap-4">
                            <div class="flex flex-col space-y-1.5">
                                <div class="flex items-center">
                                    <Label for="email">Input w/placeholder</Label>
                                    <a href="#" class="ml-auto inline-block text-sm underline">
                                        Link
                                    </a>
                                </div>
                                <Input id="password" type="password" placeholder="m@example.com" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter class="flex flex-col gap-2">
                    <Button class="w-full">
                        Regular Button
                    </Button>
                    <Button variant="outline" class="w-full">
                        Button, outline variant
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>