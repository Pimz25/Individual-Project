'use client'

import RainbowButton from '@/components/rainbow-button'

const webs = [
  { name: 'Planing tasks', href: '/plan-tasks' },
  { name: 'Music Webapp', href: '/music-app' },
  { name: 'Weather Webapp', href: '/weather' },
]

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center text-center bg-black">
      <h1 className="text-[70px] font-bold mb-8 rainbow-text">
        My Individual Projects
      </h1>

      <section className="grid grid-cols-2 gap-x-10 gap-y-5">
        {webs.map(({ name, href }, index) => (
          <RainbowButton key={index} text={name} href={href} />
        ))}
      </section>
    </main>
  )
}
