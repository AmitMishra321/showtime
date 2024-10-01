import { trpcServer } from '@/trpc/clients/server'
import { Title2 } from '../atoms/typography'
import { UserCard } from '../organisms/UserCard'

export const ListAdmins = async () => {
  const admins = await trpcServer.admins.findAll.query()
  return (
    <div className="mt-6">
      <Title2>Admin</Title2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {admins?.map(({ User: { id, image, name } }) => (
          <UserCard key={id} user={{ id, image, name }} children={undefined} />
        ))}
      </div>
    </div>
  )
}
