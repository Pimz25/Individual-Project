'use client'

import Link from 'next/link'
import { House } from 'lucide-react'
import { Button } from './ui/button'

export default function BackToDashBoardButton() {
  return (
    <div className="absolute top-4 left-4 z-50 group transition-all duration-300">
      <div className="relative inline-block p-[2px] rounded-lg rainbow-border hover:cursor-pointer transition-all duration-300">
        <div className="rounded-lg overflow-hidden">
          <Link href="/">
            <Button className="bg-black text-white hover:bg-black px-3 py-2 shadow-md transition-all duration-300 overflow-hidden hover:px-4 flex items-center gap-2">
              <House className="group-hover:rotate-360 transition-transform duration-300" />
              <span className="hidden group-hover:inline group-hover:inline transition-all duration-300">
                Home
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
