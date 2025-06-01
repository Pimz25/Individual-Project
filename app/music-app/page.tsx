'use client'

import { AppSidebar } from '@/components/music-app/app-sidebar'
import BackToDashBoardButton from '@/components/back-to-dashboard-button'
import Music from '@/components/music-app/music'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function Home() {
  return (
    <SidebarProvider defaultOpen={false}>
      <main className="relative w-screen h-screen flex text-white bg-gradient-to-r from-blue-800 to-indigo-900">
        <BackToDashBoardButton side='right' />
        <AppSidebar />
        <Music />
      </main>
    </SidebarProvider>
  )
}
