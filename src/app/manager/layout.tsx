import { TellThem } from '@/components/molecules/TellThem'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { SimpleSidebar } from '@/components/molecules/SimpleSidebar'
import { trpcServer } from '@/trpc/clients/server'
import { ManagerMenu } from '@/components/organisms/ManagerMenu'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    return <Link href="/api/auth/signin">Login</Link>
  }

  const adminMe = await trpcServer.managers.managerMe.query()

  if (!adminMe?.id) {
    return <TellThem uid={userId} role="manager" />
  }

  return (
    <div className="flex mt-2 ">
      <div className="hidden w-full max-w-xs min-w-min sm:block">
        <ManagerMenu />
      </div>

      <div className="flex-grow ">
        <div className="sm:hidden">
          <SimpleSidebar>
            <ManagerMenu />
          </SimpleSidebar>
        </div>
        <div className="p-4 bg-gray-100">{children}</div>
      </div>
    </div>
  )
}
