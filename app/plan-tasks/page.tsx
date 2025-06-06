'use client'

import BackToDashBoardButton from '@/components/back-to-dashboard-button'
import PlaningTasks from '@/components/plan-tasks/plan-tasks'

export default function Home() {
  return (
    <main className="relative w-screen h-screen flex flex-col items-center bg-black">
      <BackToDashBoardButton />
      <PlaningTasks />
    </main>
  )
}
