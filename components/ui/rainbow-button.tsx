import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RainbowButton({
  text,
  href,
}: {
  text: string
  href: string
}) {
  return (
    <div className="relative inline-block p-[2px] rounded-lg rainbow-border hover:cursor-pointer">
      <div className="rounded-lg overflow-hidden">
        <Link href={href} passHref>
          <Button className="bg-black text-white hover:bg-black px-6 py-2 w-full hover:cursor-pointer">
            {text}
          </Button>
        </Link>
      </div>
    </div>
  )
}
