import { CreateAdmin } from '@/components/templates/CreateAdmin'
import { ListAdmins } from '@/components/templates/ListAdmin'

export default async function Page() {
  return (
    <div className="">
      <div className=""> Manage Admins</div>
      <CreateAdmin />
      <ListAdmins />
    </div>
  )
}
