'use client'

import BackToDashBoardButton from '@/components/back-to-dashboard-button'
import Music from '@/components/music/music'

export default function Home() {
  return (
    <main className="relative w-screen h-screen flex flex-col items-center bg-black">
      <BackToDashBoardButton />
      <Music />
    </main>
  )
}
