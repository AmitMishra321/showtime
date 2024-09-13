import { Link } from '../molecules/CustomLink'

export const AdminMenu = () => {
  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/cinemas">Cinemas</Link>
      <Link className="pl-4" href="/admin/cinemas/new">
        Create Cinema
      </Link>
      <Link href="/admin/movies">Movies</Link>
      <Link className="pl-4" href="/admin/movies/new">
        Create Movies
      </Link>

      <Link href="/admin/admins">Manage Admins</Link>
      <Link href="/admin/managers">Manage Managers</Link>
    </div>
  )
}
