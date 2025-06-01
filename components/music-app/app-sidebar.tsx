'use client'

import {
  Activity,
  RotateCcw,
  Home,
  Flame,
  Disc3,
  Heart,
  Settings,
} from 'lucide-react'

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
  useSidebar,
} from '@/components/ui/sidebar'
import { useState } from 'react'

const MUSIC_TABS = {
  homepage: 'Homepage',
  trending: 'Trending',
  recent: 'Recent',
  albums: 'Albums',
  favourites: 'Facourites',
}

// Menu items.
const discoveryItems = [
  {
    title: 'Homepage',
    icon: Home,
  },
  {
    title: 'Trending',
    icon: Flame,
  },
]

// Library items.
const libraryItems = [
  {
    title: 'Recent',
    icon: RotateCcw,
  },
  {
    title: 'Albums',
    icon: Disc3,
  },
  {
    title: 'Favourites',
    icon: Heart,
  },
]

// Playlist items.
const playlistItems = [
  {
    title: 'Albums',
    icon: Disc3,
  },
]

export function AppSidebar() {
  const { setOpen } = useSidebar()
  const [activeTab, setActiveTab] = useState<
    'Homepage' | 'Trending' | 'Recent' | 'Albums' | 'Favourites'
  >('Homepage')

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarHeader className="mb-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/music-app" className="flex discoveryItems-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="hidden font-bold text-lg group-hover:inline transition-opacity duration-300">
                  Music App
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-3">
        <SidebarGroup>
          <SidebarGroupLabel className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Discovery
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {discoveryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex discoveryItems-center gap-2 hover:cursor-pointer hover:text-blue-800 hover:border-r-2 hover:border-b-2 ${activeTab === item.title ? 'text-blue-800 border-r-2 border-b-2 bg-blue-800/10' : ''}`}
                    onClick={() => setActiveTab(item.title)}
                  >
                    <div
                      className="flex discoveryItems-center gap-2"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="hidden group-hover:inline transition-opacity duration-300">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex discoveryItems-center gap-2 hover:cursor-pointer hover:text-blue-800 hover:border-r-2 hover:border-b-2 ${activeTab === item.title ? 'text-blue-800 border-r-2 border-b-2 bg-blue-800/10' : ''}`}
                    onClick={() => setActiveTab(item.title)}
                  >
                    <div className="flex discoveryItems-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span className="hidden group-hover:inline transition-opacity duration-300">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Playlist
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlistItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`flex discoveryItems-center gap-2 hover:cursor-pointer hover:text-blue-800 hover:border-r-2 hover:border-b-2 ${activeTab === item.title ? 'text-blue-800 border-r-2 border-b-2 bg-blue-800/10' : ''}`}
                    onClick={() => setActiveTab(item.title)}
                  >
                    <div className="flex discoveryItems-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span className="hidden group-hover:inline transition-opacity duration-300">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="" className="flex discoveryItems-center gap-2">
                <Settings className="w-5 h-5" />
                <span className="hidden group-hover:inline transition-opacity duration-300">
                  Settings
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
