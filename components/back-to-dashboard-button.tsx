'use client'

import Link from 'next/link'
import { House } from 'lucide-react'
import { Button } from './ui/button'

export default function BackToDashBoardButton({
  side = 'left',
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
}) {
  if (side === 'right') {
    return (
      <div
        className={
          'absolute top-2 right-2 z-50 group transition-all duration-300'
        }
      >
        <div className="relative inline-block p-[2px]  rounded-full rainbow-border hover:cursor-pointer transition-all duration-300">
          <div className="rounded-full overflow-hidden">
            <Link href="/">
              <Button className="bg-black text-white hover:bg-black px-3 py-2 shadow-md transition-all duration-300 overflow-hidden hover:px-4 flex items-center gap-2">
                <span className="hidden group-hover:inline transition-opacity duration-300">
                  Home
                </span>
                <House className="group-hover:rotate-360 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      className={'absolute top-2 left-2 z-50 group transition-all duration-300'}
    >
      <div className="relative inline-block p-[2px] rounded-full rainbow-border hover:cursor-pointer transition-all duration-300">
        <div className="rounded-full overflow-hidden">
          <Link href="/">
            <Button className="bg-black text-white hover:bg-black px-3 py-2 shadow-md transition-all duration-300 overflow-hidden hover:px-4 flex items-center gap-2">
              <House className="group-hover:rotate-360 transition-transform duration-300" />
              <span className="hidden group-hover:inline transition-opacity duration-300">
                Home
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
