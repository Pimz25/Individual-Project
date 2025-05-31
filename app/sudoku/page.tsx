'use client'

import BackToDashBoardButton from '@/components/back-to-dashboard-button'
import Sudoku from '@/components/sudoku/sudoku'

export default function Home() {
  return (
    <main className="relative w-screen h-screen flex flex-col items-center bg-black">
      <BackToDashBoardButton />
      <Sudoku />
    </main>
  )
}
