import { Link } from '../molecules/CustomLink'

export const ManagerMenu = () => {
  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <Link href="/manager">Dashboard</Link>
      <Link href="/manager/cinemas">Cinemas</Link>

      <Link href="/manager/cinemas/new-showtime" className="pl-4">
        Create Showtime
      </Link>
    </div>
  )
}
