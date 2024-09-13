import { RouterOutputs } from '@/trpc/clients/types'
import Image from 'next/image'

export const MovieInfo = ({
  movie,
}: {
  movie: RouterOutputs['movies']['movies'][0]
}) => {
  return (
    <div className="">
      <Image
        src={movie.posterUrl || '/film.png'}
        alt={movie.title}
        width={300}
        height={300}
        className="aspect-square object-cover rounded shadow-lg"
      />
      <div>
        <div className="text-lg font-semibold">{movie.title}</div>
        <div>{movie.director}</div>
        <div className="text-xs text-grey-500 mt-2">{movie.genre}</div>
        <div>{movie.duration}</div>
        <div>{movie.releaseDate.toString()}</div>
      </div>
    </div>
  )
}
