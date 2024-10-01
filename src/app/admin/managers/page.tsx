import { CreateManagers } from '@/components/templates/CreateManagers'
import { ListManagers } from '@/components/templates/ListManagers'

export default async function Page() {
  return (
    <div className="">
      <div className=""> Manage Managers</div>
      <CreateManagers />
      <ListManagers />
    </div>
  )
}
