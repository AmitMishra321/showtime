import { StatCard } from '@/components/organisms/StatCard'
import { trpcServer } from '@/trpc/clients/server'

export default async function AdminPage() {
  const dashboard = await trpcServer.admins.dashboard.query()
  return (
    <main>
      {Object.entries(dashboard).map(([key, value]) => (
        <StatCard key={key} title={key}>
          {value}
        </StatCard>
      ))}
    </main>
  )
}
