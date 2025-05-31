'use client'

import BackToDashBoardButton from '@/components/back-to-dashboard-button'
import Weather from '@/components/weather/weather'

export default function Home() {
  return (
    <main className="relative w-screen h-screen flex flex-col items-center bg-black">
      <BackToDashBoardButton />
      <Weather />
    </main>
  )
}
