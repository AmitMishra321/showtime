'use client'

import { SignOutButton, useAuth } from '@clerk/nextjs'
import { Lock, LucideIcon, Menu, ScreenShare, User } from 'lucide-react'
import { Button, buttonVariants } from '../atoms/button'
import Link from 'next/link'
import { Sheet } from '../atoms/sheet'
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '../atoms/sheet'
import { useDialogState } from '@/utils/hooks'

const menu: { href: string; title: string; icon: LucideIcon }[] = [
  { href: '/user', title: 'user', icon: User },
  { href: '/admin', title: 'admin', icon: Lock },
  { href: '/manager', title: 'manager', icon: ScreenShare },
]

export function Sidebar() {
  const user = useAuth()

  const [open, setOpen] = useDialogState(false)

  if (!user.isSignedIn) {
    return (
      <Link href="/sign-in" className={buttonVariants({ variant: 'default' })}>
        Sign in
      </Link>
    )
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <div className="flex flex-col gap-2 mt-4 mb-8">
          {menu.map((item) => (
            <Link href={item.href} key={item.title}>
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />{' '}
                <div className="capitalize">{item.title}</div>
              </div>
            </Link>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <SignOutButton />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
