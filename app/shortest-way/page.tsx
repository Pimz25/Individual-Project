'use client'

import BackToDashBoardButton from '@/components/back-to-dashboard-button'
import ShortestWay from '@/components/shortest-way/shortest-way'

export default function Home() {
  return (
    <main className="relative w-screen h-screen flex flex-col items-center bg-black">
      <BackToDashBoardButton/>
      <ShortestWay />
    </main>
  )
}
