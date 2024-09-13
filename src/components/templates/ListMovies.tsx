import { trpcServer } from '@/trpc/clients/server'
import { MovieInfo } from '../organisms/MovieInfo'

export interface ListMoviesProps {}

export const ListMovies = async ({}: ListMoviesProps) => {
  const movies = await trpcServer.movies.movies.query()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieInfo key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
